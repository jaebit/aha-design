// 갤러리 사이트 + MCP 서버. Docker 이미지 하나로 띄운다.
//   /            갤러리 (dist, SPA)
//   /mcp         MCP Streamable HTTP (stateless)
//   /storybook/  개발자용 Storybook 정적 빌드
//   /catalog.json  갤러리·MCP가 쓰는 데이터
//   /healthz     컨테이너 상태 검사
import { existsSync, readFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { fileURLToPath } from 'node:url';

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import sirv from 'sirv';

import { site } from '../site.config.ts';
import type { Catalog } from '../src/catalog-types.ts';
import { createMcpServer } from './mcp.ts';

const port = Number(process.env.PORT ?? site.port);
const publicUrl = (process.env.PUBLIC_URL ?? `http://localhost:${port}`).replace(/\/$/, '');
// 빈 값(Docker 빌드 인자를 주지 않음)이면 site.config의 기본값.
const registry = process.env.NPM_REGISTRY || site.registry;
const path = (env: string | undefined, fallback: string) => env ?? fileURLToPath(new URL(fallback, import.meta.url));

// 사이트(SITE)마다 갤러리 빌드와 카탈로그가 다르다. Docker 이미지는 SITES_DIR/<사이트>/{dist,generated}에 사이트별로 둔다.
// 로컬에서는 마지막으로 빌드한 dist·generated를 쓴다 (SITE=iam pnpm --filter @aha/gallery build 뒤 SITE=iam으로 실행).
const siteDir = process.env.SITES_DIR ? `${process.env.SITES_DIR.replace(/\/$/, '')}/${site.id}` : undefined;
const catalogPath = path(process.env.CATALOG_PATH ?? (siteDir && `${siteDir}/generated/catalog.json`), '../generated/catalog.json');
const galleryDir = path(process.env.GALLERY_DIR ?? (siteDir && `${siteDir}/dist`), '../dist');
const storybookDir = path(process.env.STORYBOOK_DIR, '../../../packages/ui/storybook-static');

// DNS rebinding 방어: 인증 없는 /mcp는 Host가 이 서버 이름일 때만 받는다 (포트는 보지 않는다).
// localhost와 PUBLIC_URL의 호스트는 기본으로 받고, 다른 이름(IP 등)으로도 접속하면 MCP_ALLOWED_HOSTS에 쉼표로 적는다.
const allowedHosts = new Set([
  'localhost',
  '127.0.0.1',
  '[::1]',
  new URL(publicUrl).hostname,
  ...(process.env.MCP_ALLOWED_HOSTS ?? '').split(',').map((host) => host.trim().toLowerCase()).filter(Boolean),
]);
const isAllowedHost = (host: string | undefined) => {
  if (!host) return false;
  try {
    return allowedHosts.has(new URL(`http://${host}`).hostname);
  } catch {
    return false;
  }
};

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as Catalog;
// 다른 사이트로 만든 카탈로그를 내보내면 MCP가 다른 브랜드의 키트·템플릿·토큰 값을 알려 준다. 시작하지 않는다.
if (catalog.site && catalog.site.id !== site.id) {
  console.error(`${catalogPath}는 SITE=${catalog.site.id}로 만든 카탈로그입니다. SITE=${site.id}로 다시 만드세요.`);
  process.exit(1);
}
const ctx = { catalog, publicUrl, registry };

const notFound = (_req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
};
// 빌드 결과가 없으면(MCP만 띄울 때) 해당 경로는 404로 둔다.
const staticDir = (dir: string, options: Parameters<typeof sirv>[1]) => (existsSync(dir) ? sirv(dir, options) : notFound);
const gallery = staticDir(galleryDir, { single: true, etag: true });
const storybook = staticDir(storybookDir, { etag: true });

// sirv 3은 역순 범위와 안전한 정수 범위를 넘는 값을 createReadStream에 그대로 넘긴다.
// 파일 크기에 따른 416 처리는 sirv에 맡기고, 스트림 생성 전에 범위 문법·숫자를 검사한다.
function validByteRanges(value: string) {
  return value.split(',').every((part) => {
    const match = /^(\d*)-(\d*)$/.exec(part.trim());
    if (!match || (!match[1] && !match[2])) return false;
    const start = match[1] ? Number(match[1]) : undefined;
    const end = match[2] ? Number(match[2]) : undefined;
    return (
      (start === undefined || Number.isSafeInteger(start)) &&
      (end === undefined || Number.isSafeInteger(end)) &&
      (start === undefined || end === undefined || start <= end)
    );
  });
}

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  let url: URL;
  try {
    url = new URL(req.url ?? '/', 'http://localhost');
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  if (url.pathname === '/mcp') {
    if (req.method !== 'POST') {
      // stateless 서버라 GET(SSE 구독)과 DELETE(세션 종료)는 지원하지 않는다.
      res.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed.' }, id: null }));
      return;
    }
    if (!isAllowedHost(req.headers.host)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Host not allowed.' }, id: null }));
      return;
    }
    const mcp = createMcpServer(ctx);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on('close', () => {
      void Promise.all([transport.close(), mcp.close()]).catch((error) => {
        console.error('MCP 연결 정리 실패', error);
      });
    });
    await mcp.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  if (url.pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ok');
    return;
  }

  if (url.pathname === '/catalog.json') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(catalog));
    return;
  }

  if (url.pathname === '/storybook') {
    res.writeHead(301, { Location: '/storybook/' });
    res.end();
    return;
  }

  if (req.headers.range) {
    const bytes = /^bytes=(.*)$/i.exec(req.headers.range);
    if (!bytes) {
      // 지원하지 않는 범위 단위는 무시하고 전체 응답을 보낸다.
      delete req.headers.range;
    } else if (!validByteRanges(bytes[1]!)) {
      res.writeHead(416, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Range not satisfiable');
      return;
    } else {
      req.headers.range = `bytes=${bytes[1]}`;
    }
  }
  if (url.pathname.startsWith('/storybook/')) {
    req.url = req.url!.slice('/storybook'.length);
    storybook(req, res, () => notFound(req, res));
    return;
  }

  gallery(req, res);
}

const server = createServer((req, res) => {
  // HTTP 이벤트는 async 콜백의 Promise를 처리하지 않는다. 모든 라우트의 실패를 여기서 받는다.
  void handleRequest(req, res).catch((error) => {
    console.error('HTTP 요청 처리 실패', error);
    if (res.destroyed) return;
    if (res.headersSent) {
      res.destroy();
      return;
    }
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null }));
  });
});

server.listen(port, () => {
  console.log(`${site.title} 갤러리: ${publicUrl}`);
  console.log(`MCP: ${publicUrl}/mcp`);
});

// docker stop(SIGTERM)과 Ctrl+C에 바로 끝낸다. 진행 중인 요청은 마무리하고, 5초가 지나면 강제로 끝낸다.
const shutdown = () => {
  server.close(() => process.exit(0));
  server.closeIdleConnections();
  setTimeout(() => process.exit(0), 5000).unref();
};
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
