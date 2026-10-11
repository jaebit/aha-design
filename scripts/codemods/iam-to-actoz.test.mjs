// iam-to-actoz.mjs 검사. 임시 폴더에 @iam/*를 쓰는 작은 프로젝트를 만들어 코드모드를 돌린다.
//   pnpm test:codemods
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const codemod = fileURLToPath(new URL('./iam-to-actoz.mjs', import.meta.url));

const project = {
  'package.json': JSON.stringify({ name: 'app', dependencies: { '@iam/ui': '^0.2.1', '@iam/kit-console': '^0.1.2', '@iam/tokens': '^0.2.1', react: '^19.3.0' } }, null, 2),
  '.npmrc': '@iam:registry=http://localhost:3000/api/packages/iam/npm/\n',
  'index.html': '<!doctype html>\n<html lang="ko"><body></body></html>\n',
  'src/index.css': '@import "@iam/ui/styles.css";\n@import "@iam/kit-console/styles.css";\n.x { color: var(--iam-color-primary); }\n',
  'src/login.tsx': `import { AuthLayout, Button, FormField, Input, type AuthLayoutProps } from '@iam/ui';
export const Login = (p: Partial<AuthLayoutProps>) => (
  <AuthLayout title="로그인" {...p}>
    <FormField label="이메일" required hint="회사 메일">
      <Input />
    </FormField>
    <Button>로그인</Button>
  </AuthLayout>
);
`,
  'src/console.tsx': `import { AccountMenu, NavRail } from '@iam/ui';
import { SecretField } from '@iam/kit-console';
import { IamColorPrimary } from '@iam/tokens';
export const Console = () => (
  <>
    <NavRail items={[]} account={<AccountMenu name="a" team="b" email="c" initials="d" onAdminSettings={() => {}} onLogout={() => {}} />} />
    <SecretField label="비밀값" value="x" hint="서버에만 둔다" />
    <p data-c={IamColorPrimary} style={{ color: 'var(--iam-color-primary)' }} />
  </>
);
`,
};

async function makeProject(t) {
  const dir = await mkdtemp(join(tmpdir(), 'iam-to-actoz-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const [path, text] of Object.entries(project)) {
    await mkdir(join(dir, path, '..'), { recursive: true });
    await writeFile(join(dir, path), text);
  }
  return dir;
}
const run = (dir, ...flags) => execFileSync(process.execPath, [codemod, dir, ...flags], { encoding: 'utf8' });
const read = (dir, path) => readFile(join(dir, path), 'utf8');

test('미리보기는 파일을 바꾸지 않는다', async (t) => {
  const dir = await makeProject(t);
  const out = run(dir);
  assert.match(out, /고칠 파일 6개/);
  assert.equal(await read(dir, 'src/login.tsx'), project['src/login.tsx']);
});

test('--write는 패키지·import·CSS·prop·브랜드를 옮긴다', async (t) => {
  const dir = await makeProject(t);
  run(dir, '--write');
  const login = await read(dir, 'src/login.tsx');
  assert.match(login, /import \{ Button, FormField, Input \} from '@actoz\/ui';/);
  assert.match(login, /import \{ AuthLayout, type AuthLayoutProps \} from '@actoz\/kit-auth';/);
  assert.match(login, /<FormField label="이메일" required description="회사 메일">/);
  const consoleTsx = await read(dir, 'src/console.tsx');
  assert.match(consoleTsx, /from '@actoz\/kit-admin'/);
  assert.match(consoleTsx, /import \{ ActozColorPrimary \} from '@actoz\/tokens'/);
  assert.match(consoleTsx, /data-c=\{ActozColorPrimary\}/);
  assert.match(consoleTsx, /<NavRail aria-label="주 메뉴"/);
  assert.match(consoleTsx, /<AccountMenu adminLabel="관리 콘솔"/);
  assert.match(consoleTsx, /<SecretField label="비밀값" value="x" description="서버에만 둔다"/);
  assert.match(consoleTsx, /var\(--actoz-color-primary\)/);
  const css = await read(dir, 'src/index.css');
  assert.equal(
    css,
    '@import "@actoz/ui/styles.css";\n@import "@actoz/kit-auth/styles.css";\n@import "@actoz/kit-admin/styles.css";\n.x { color: var(--actoz-color-primary); }\n',
  );
  assert.match(await read(dir, 'index.html'), /<html data-brand="iam" lang="ko">/);
  assert.match(await read(dir, '.npmrc'), /^@actoz:registry=http:\/\/localhost:3000\/api\/packages\/actoz\/npm\/$/m);
  const deps = JSON.parse(await read(dir, 'package.json')).dependencies;
  assert.deepEqual(Object.keys(deps).sort(), ['@actoz/kit-admin', '@actoz/kit-auth', '@actoz/tokens', '@actoz/ui', 'react']);
  assert.ok(Object.values(deps).every((v) => v.startsWith('^')));
});

test('두 번 돌려도 더 고치지 않고, 사람이 볼 것은 계속 알려 준다', async (t) => {
  const dir = await makeProject(t);
  run(dir, '--write');
  const out = run(dir);
  assert.match(out, /고칠 파일 0개/);
  assert.match(out, /AuthLayout 기본 로고/);
  assert.match(out, /NavRail 기본 로고/);
  assert.match(out, /FormField required/);
});
