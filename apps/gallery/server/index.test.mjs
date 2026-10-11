import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { request, createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const entry = fileURLToPath(new URL('./index.ts', import.meta.url));
const content = '0123456789';

// 운영 포트·빌드 결과물을 건드리지 않고 실제 진입점을 별도 프로세스로 검사한다.
async function start(t, catalogOverride, failAfterHeaders = false) {
  const root = await mkdtemp(join(tmpdir(), 'gallery-http-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const dir of ['gallery', 'storybook']) {
    await mkdir(join(root, dir));
    await writeFile(join(root, dir, 'index.html'), content);
    await writeFile(join(root, dir, 'failure.html'), content);
    await writeFile(join(root, dir, 'empty.txt'), '');
  }
  const catalog = catalogOverride ?? {
    packages: { ui: { name: '@example/ui', version: '0.0.0' }, tokens: { name: '@example/tokens', version: '0.0.0' } },
    kits: [], categories: [], components: [], templates: [], tokens: [], templateFixtures: {},
  };
  await writeFile(join(root, 'catalog.json'), JSON.stringify(catalog));
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const args = [];
  if (failAfterHeaders) {
    const preload = join(root, 'stream-failure.mjs');
    // 헤더 전송 후 스트림 생성이 실패하는 경우도 실제 HTTP 응답 경계에서 검증한다.
    await writeFile(preload, `
      import fs from 'node:fs';
      import { syncBuiltinESMExports } from 'node:module';
      const original = fs.createReadStream;
      fs.createReadStream = (file, options) => {
        if (String(file).endsWith('failure.html')) throw new Error('Injected stream failure');
        return original(file, options);
      };
      syncBuiltinESMExports();
    `);
    args.push('--import', preload);
  }
  const child = spawn(process.execPath, [...args, entry], {
    cwd: root,
    env: {
      ...process.env, NODE_OPTIONS: '', PORT: String(port), CATALOG_PATH: join(root, 'catalog.json'),
      GALLERY_DIR: join(root, 'gallery'), STORYBOOK_DIR: join(root, 'storybook'),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stderr.on('data', (chunk) => { output += chunk; });
  const closed = once(child, 'close');
  t.after(async () => {
    child.kill('SIGTERM');
    await closed;
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Startup timeout: ${output}`)), 10_000);
    child.once('error', (error) => { clearTimeout(timeout); reject(error); });
    child.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`Server exited (${code}): ${output}`)); });
    child.stdout.on('data', (chunk) => {
      if (chunk.toString().includes('MCP:')) { clearTimeout(timeout); resolve(); }
    });
  });
  return (path, options = {}) => new Promise((resolve, reject) => {
    // fetch는 URL을 정규화하므로 원본 request target을 보내는 http.request를 쓴다.
    const req = request({ hostname: '127.0.0.1', port, path, method: options.method ?? 'GET', headers: options.headers }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('error', reject);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.setTimeout(5000, () => req.destroy(new Error('Request timeout')));
    req.on('error', (error) => reject(new Error(`${error.message}; server: ${output}`)));
    req.end(options.body);
  });
}

test('잘못된 URL을 거부한 뒤에도 같은 서버가 응답한다', async (t) => {
  const send = await start(t);
  assert.equal((await send('/healthz')).status, 200);
  for (const target of ['//[/', '//%zz/', 'http://[/']) {
    assert.equal((await send(target)).status, 400, target);
    assert.equal((await send('/healthz')).body, 'ok');
  }
});

test('두 정적 파일 경로의 잘못된 Range가 서버를 종료시키지 않는다', async (t) => {
  const send = await start(t);
  for (const path of ['/index.html', '/storybook/index.html']) {
    for (const range of ['bytes=2-1', 'bytes=0-9007199254740992', `bytes=0-${'9'.repeat(400)}`, 'bytes=9007199254740992-', 'bytes=1--2', 'bytes=+2-1', 'bytes=2-1,0-4', 'bytes=-9007199254740992']) {
      assert.equal((await send(path, { headers: { Range: range } })).status, 416, `${path} ${range}`);
      assert.equal((await send('/healthz')).body, 'ok');
    }
  }
});

test('정상 정적 파일·라우팅·캐시·MCP 동작을 유지한다', async (t) => {
  const send = await start(t);
  for (const path of ['/index.html', '/storybook/index.html']) {
    const full = await send(path);
    assert.equal(full.status, 200);
    assert.equal(full.body, content);
    assert.equal((await send(path, { headers: { 'If-None-Match': full.headers.etag } })).status, 304);
    const head = await send(path, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(head.body, '');
    assert.equal(head.headers['content-length'], String(content.length));
    const partial = await send(path, { headers: { Range: 'bytes=2-5' } });
    assert.equal(partial.status, 206);
    assert.equal(partial.body, '2345');
    assert.equal(partial.headers['content-range'], 'bytes 2-5/10');
    assert.equal((await send(path, { headers: { Range: 'bytes=2-' } })).body, '23456789');
    assert.equal((await send(path, { headers: { Range: 'bytes=20-' } })).status, 416);
    assert.equal((await send(path, { headers: { Range: 'BYTES=2-5' } })).body, '2345');
    assert.equal((await send(path, { headers: { Range: 'bytes=0002-0005' } })).body, '2345');
    assert.equal((await send(path, { headers: { Range: 'bytes=0-9007199254740991' } })).body, content);
    const unknownUnit = await send(path, { headers: { Range: 'items=2-5' } });
    assert.equal(unknownUnit.status, 200);
    assert.equal(unknownUnit.body, content);
  }
  for (const path of ['/components/example', '/%zz', '/%2f%2f[/']) assert.equal((await send(path)).body, content);
  assert.equal((await send('//localhost/healthz')).body, 'ok');
  assert.equal((await send('/storybook/missing.js')).status, 404);
  for (const path of ['/empty.txt', '/storybook/empty.txt']) {
    assert.equal((await send(path)).body, '');
    assert.equal((await send(path, { headers: { Range: 'bytes=0-' } })).status, 416);
  }
  const redirect = await send('/storybook');
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.location, '/storybook/');
  assert.deepEqual(JSON.parse((await send('/catalog.json')).body).components, []);
  assert.equal((await send('/mcp')).status, 405);
  assert.equal((await send('/mcp', { method: 'DELETE' })).status, 405);
  const initialized = await send('/mcp', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'http-regression', version: '1' } } }),
  });
  assert.equal(initialized.status, 200);
  assert.equal(JSON.parse(initialized.body).id, 1);
  assert.ok(JSON.parse(initialized.body).result.serverInfo);
  const rpcHeaders = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
  const listed = await send('/mcp', {
    method: 'POST', headers: rpcHeaders,
    body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }),
  });
  assert.equal(listed.status, 200);
  assert.ok(JSON.parse(listed.body).result.tools.some((tool) => tool.name === 'get_component'));
  assert.equal((await send('/mcp', { method: 'POST', headers: rpcHeaders, body: '{' })).status, 400);
  assert.equal((await send('/healthz', { headers: { Range: 'bytes=2-1' } })).body, 'ok');
});

test('MCP 준비 단계 예외도 요청 안에 가둔다', async (t) => {
  const send = await start(t, {});
  assert.equal((await send('/mcp', { method: 'POST' })).status, 500);
  assert.equal((await send('/healthz')).body, 'ok');
});

test('헤더 전송 뒤의 실패는 해당 연결만 종료한다', async (t) => {
  const send = await start(t, undefined, true);
  for (const path of ['/failure.html', '/storybook/failure.html']) {
    await assert.rejects(send(path));
    assert.equal((await send('/healthz')).body, 'ok');
    assert.equal((await send('/index.html')).body, content);
  }
});
