// @actoz/tokens 빌드 결과로 예전 이름(@aha/tokens)의 별칭을 만든다 (AHA·IAM 통합 5단계 호환 패키지).
// - dist/aliases.css: --aha-* → var(--actoz-*). 테마 속성을 단 요소에도 걸어, 안쪽 요소에서 테마가 바뀌어도 따라간다.
// - dist/tokens.css: @actoz/tokens/tokens.css + 별칭
// - dist/tokens.js·tokens.d.ts: Aha* 이름으로 Actoz* 상수를 다시 내보낸다
// - dist/tokens.manifest.json: prefix와 cssVar를 aha로 바꾼 사본
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const actoz = new URL('../../packages/tokens/dist/', import.meta.url);
const out = new URL('./dist/', import.meta.url);
const read = (name) =>
  readFile(new URL(name, actoz), 'utf8').catch(() => {
    throw new Error(`packages/tokens/dist/${name}이 없습니다. @actoz/tokens를 먼저 빌드하세요.`);
  });

const css = await read('tokens.css');
const manifest = JSON.parse(await read('tokens.manifest.json'));
const dts = await read('tokens.d.ts');

const vars = [...new Set([...css.matchAll(/(--actoz-[a-z0-9-]+)\s*:/g)].map((m) => m[1]))].sort();
// 테마는 :root나 그 속성을 단 요소에서 --actoz-* 값을 바꾼다. 별칭도 같은 요소에서 다시 계산되도록 같은 곳에 건다.
const attributes = [...new Set([...css.matchAll(/\[(data-[a-z-]+)=/g)].map((m) => m[1]))].sort();
const selectors = [':root', ...attributes.map((a) => `[${a}]`)];
const aliases = `/* 예전 이름(--aha-*)의 별칭. 새 코드는 --actoz-*를 쓴다. 이 파일은 compat/aha-tokens/build.mjs가 만든다. */\n${selectors.join(',\n')} {\n${vars
  .map((v) => `  ${v.replace('--actoz-', '--aha-')}: var(${v});`)
  .join('\n')}\n}\n`;

const names = [...dts.matchAll(/export const (Actoz\w+)/g)].map((m) => m[1]);
const reexport = `// @aha/tokens는 @actoz/tokens로 옮겼다. 예전 이름(Aha*)으로 다시 내보낸다.\nexport {\n${names
  .map((n) => `  ${n} as ${n.replace(/^Actoz/, 'Aha')},`)
  .join('\n')}\n} from '@actoz/tokens';\n`;

const renamed = {
  ...manifest,
  prefix: 'aha',
  tokens: manifest.tokens.map((t) => ({ ...t, cssVar: t.cssVar.replace('--actoz-', '--aha-') })),
};

await mkdir(out, { recursive: true });
await writeFile(new URL('aliases.css', out), aliases);
await writeFile(new URL('tokens.css', out), `@import "@actoz/tokens/tokens.css";\n\n${aliases}`);
await writeFile(new URL('tokens.js', out), reexport);
await writeFile(new URL('tokens.d.ts', out), reexport);
await writeFile(new URL('tokens.manifest.json', out), JSON.stringify(renamed, null, 2) + '\n');
console.log(`@aha/tokens 별칭: CSS 변수 ${vars.length}개, JS 상수 ${names.length}개, 선택자 ${selectors.join(' ')}`);
