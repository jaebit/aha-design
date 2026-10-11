#!/usr/bin/env node
// @iam/* (IAM 디자인 시스템)을 쓰는 프로젝트를 @actoz/*로 옮긴다 (AHA·IAM 통합 5단계).
// 안내: docs/migration/iam-to-actoz.md
//
//   node <aha-design>/scripts/codemods/iam-to-actoz.mjs <프로젝트 폴더>           바꿀 내용만 보여준다
//   node <aha-design>/scripts/codemods/iam-to-actoz.mjs <프로젝트 폴더> --write   파일을 고친다
//
// 기계적으로 정해지는 것은 고치고, 사람이 정해야 하는 것은 "확인할 것"으로 파일:줄을 알려 준다.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const [projectArg, ...flags] = process.argv.slice(2);
if (!projectArg || flags.some((f) => f !== '--write')) {
  console.error('사용법: node iam-to-actoz.mjs <프로젝트 폴더> [--write]');
  process.exit(2);
}
const root = projectArg;
const write = flags.includes('--write');

// 새 패키지 버전은 이 저장소(aha-design)의 package.json에서 읽는다. 배포한 버전과 같다 (pnpm version-packages 뒤 배포).
const repo = new URL('../../', import.meta.url);
const versionOf = async (dir) => JSON.parse(await readFile(new URL(`packages/${dir}/package.json`, repo), 'utf8')).version;
const versions = {
  '@actoz/ui': await versionOf('ui'),
  '@actoz/tokens': await versionOf('tokens'),
  '@actoz/kit-admin': await versionOf('kit-admin'),
  '@actoz/kit-auth': await versionOf('kit-auth'),
};
const REGISTRY = 'http://localhost:3000/api/packages/actoz/npm/';

// @iam/ui에서 인증 키트로 옮긴 이름. 나머지는 모두 @actoz/ui에 있다.
const AUTH_KIT_NAMES = new Set(['AuthLayout', 'AuthLayoutProps', 'OtpInput', 'OtpInputProps']);
const PACKAGE_MAP = { '@iam/ui': '@actoz/ui', '@iam/kit-console': '@actoz/kit-admin', '@iam/tokens': '@actoz/tokens' };
const CSS_MAP = [
  ['@iam/ui/styles.css', '@actoz/ui/styles.css'],
  ['@iam/kit-console/styles.css', '@actoz/kit-admin/styles.css'],
  ['@iam/tokens/', '@actoz/tokens/'],
];

const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.next', '.turbo', 'coverage', 'storybook-static']);
const CODE = /\.(m?[jt]sx?|cjs)$/;
const STYLE = /\.(css|scss)$/;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(join(dir, entry.name));
    } else yield join(dir, entry.name);
  }
}

const changes = []; // { file, what }
const todos = []; // { file, line, what }
const lineOf = (text, index) => text.slice(0, index).split('\n').length;
let usesAuthKit = false;

/** import·export ... from '@iam/ui' 를 @actoz/ui와 @actoz/kit-auth로 나눈다. */
function splitUiImports(text, file) {
  return text.replace(
    /(import|export)(\s+type)?\s*\{([^}]*)\}\s*from\s*(['"])@iam\/ui\4;?/g,
    (all, keyword, typeOnly = '', body, quote) => {
      const specs = body.split(',').map((s) => s.trim()).filter(Boolean);
      const name = (s) => s.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
      const auth = specs.filter((s) => AUTH_KIT_NAMES.has(name(s)));
      const ui = specs.filter((s) => !AUTH_KIT_NAMES.has(name(s)));
      if (auth.length > 0) usesAuthKit = true;
      const line = (list, pkg) => `${keyword}${typeOnly} { ${list.join(', ')} } from ${quote}${pkg}${quote};`;
      const out = [ui.length ? line(ui, '@actoz/ui') : '', auth.length ? line(auth, '@actoz/kit-auth') : ''].filter(Boolean);
      changes.push({ file, what: `${keyword} @iam/ui → ${auth.length ? '@actoz/ui + @actoz/kit-auth' : '@actoz/ui'}` });
      return out.join('\n');
    },
  );
}

/** 여는 태그 하나의 범위 [시작, 끝). JSX 속성 안의 {...}와 문자열을 건너뛴다. */
function openingTags(text, component) {
  const tags = [];
  const re = new RegExp(`<${component}(?=[\\s/>])`, 'g');
  for (const m of text.matchAll(re)) {
    let i = m.index + m[0].length;
    let depth = 0;
    let quote = null;
    for (; i < text.length; i++) {
      const c = text[i];
      if (quote) {
        if (c === quote && text[i - 1] !== '\\') quote = null;
      } else if (c === '"' || c === "'" || c === '`') quote = c;
      else if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '>' && depth === 0) break;
    }
    tags.push({ start: m.index, end: i + 1, source: text.slice(m.index, i + 1) });
  }
  return tags;
}

const hasProp = (tag, prop) => new RegExp(`\\s${prop.replace(/[-]/g, '\\-')}(\\s*=|[\\s/>])`).test(tag);

/** 여는 태그를 고친다. fix(tag) → 새 태그 문자열 또는 그대로. 뒤에서부터 바꿔 위치가 밀리지 않게 한다. */
function editTags(text, component, fix) {
  const tags = openingTags(text, component).reverse();
  for (const tag of tags) {
    const next = fix(tag.source, lineOf(text, tag.start));
    if (next !== tag.source) text = text.slice(0, tag.start) + next + text.slice(tag.end);
  }
  return text;
}

/** 예전 기본값을 유지하는 prop을 여는 태그 이름 바로 뒤에 넣는다. */
const addProp = (tag, component, prop) => tag.replace(`<${component}`, `<${component} ${prop}`);

function transformCode(text, file) {
  const before = text;
  text = splitUiImports(text, file);
  for (const [from, to] of Object.entries(PACKAGE_MAP)) {
    if (from === '@iam/ui') continue;
    const re = new RegExp(`(['"])${from.replace('/', '\\/')}(['"/])`, 'g');
    if (re.test(text)) {
      text = text.replace(re, `$1${to}$2`);
      changes.push({ file, what: `${from} → ${to}` });
    }
  }
  // @actoz/tokens에서 가져온 Iam* 상수 이름을 Actoz*로 바꾼다.
  const tokenImports = [...text.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]@actoz\/tokens['"]/g)].flatMap((m) =>
    m[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter((n) => /^Iam[A-Z]/.test(n)),
  );
  for (const name of new Set(tokenImports)) {
    text = text.replace(new RegExp(`\\b${name}\\b`, 'g'), name.replace(/^Iam/, 'Actoz'));
    changes.push({ file, what: `토큰 상수 ${name} → ${name.replace(/^Iam/, 'Actoz')}` });
  }
  // 남은 @iam 참조(네임스페이스 import, require, 하위 경로 등)는 사람이 본다.
  for (const m of text.matchAll(/['"](@iam\/[^'"]*)['"]/g)) {
    todos.push({ file, line: lineOf(text, m.index), what: `자동으로 옮기지 못한 참조 ${m[1]}. 대응표(docs/migration/iam-to-actoz.md)대로 바꾼다` });
  }

  if (/\.[jt]sx$/.test(file)) {
    // 안내 문구 prop 이름: hint → description (FormField, SecretField)
    for (const component of ['FormField', 'SecretField']) {
      text = editTags(text, component, (tag) => {
        if (!/\shint\s*=/.test(tag)) return tag;
        changes.push({ file, what: `${component} hint= → description=` });
        return tag.replace(/(\s)hint(\s*=)/, '$1description$2');
      });
    }
    text = editTags(text, 'FormField', (tag, line) => {
      if (hasProp(tag, 'required')) {
        todos.push({
          file,
          line,
          what: 'FormField required는 이제 aria-required만 건다 (브라우저 기본 검증 말풍선이 뜨지 않는다). 빈 값은 FormField error로 알린다. 브라우저 검증이 꼭 필요하면 입력 요소에 required를 직접 준다',
        });
      }
      return tag;
    });
    // NavRail: 기본 이름이 "서비스"(AHA)로 바뀌었다. IAM의 예전 기본값 "주 메뉴"를 넣는다. 로고는 사람이 넣는다.
    text = editTags(text, 'NavRail', (tag, line) => {
      let next = tag;
      if (!hasProp(tag, 'aria-label')) {
        next = addProp(next, 'NavRail', 'aria-label="주 메뉴"');
        changes.push({ file, what: 'NavRail aria-label="주 메뉴" (IAM 예전 기본값)' });
      }
      if (!hasProp(tag, 'logo')) {
        todos.push({ file, line, what: 'NavRail 기본 로고가 AHA로 바뀌었다. logo로 IAM 로고(ShieldCheck + "IAM")를 넘긴다' });
      }
      return next;
    });
    // AccountMenu: 관리자 메뉴 이름의 기본값이 "관리자 설정"(AHA)으로 바뀌었다. IAM의 "관리 콘솔"을 넣는다.
    text = editTags(text, 'AccountMenu', (tag) => {
      if (!hasProp(tag, 'onAdminSettings') || hasProp(tag, 'adminLabel')) return tag;
      changes.push({ file, what: 'AccountMenu adminLabel="관리 콘솔" (IAM 예전 기본값)' });
      return addProp(tag, 'AccountMenu', 'adminLabel="관리 콘솔"');
    });
    text = editTags(text, 'AuthLayout', (tag, line) => {
      if (!hasProp(tag, 'logo')) {
        todos.push({ file, line, what: 'AuthLayout 기본 로고가 AHA로 바뀌었다. logo로 IAM 로고(ShieldCheck + "IAM")를 넘긴다' });
      }
      return tag;
    });
  }
  if (text.includes('--iam-')) {
    text = text.replaceAll('--iam-', '--actoz-');
    changes.push({ file, what: 'CSS 변수 --iam-* → --actoz-*' });
  }
  return text === before ? null : text;
}

function transformStyle(text, file) {
  const before = text;
  for (const [from, to] of CSS_MAP) {
    if (text.includes(from)) {
      text = text.replaceAll(from, to);
      changes.push({ file, what: `CSS ${from} → ${to}` });
    }
  }
  if (text.includes('--iam-')) {
    text = text.replaceAll('--iam-', '--actoz-');
    changes.push({ file, what: 'CSS 변수 --iam-* → --actoz-*' });
  }
  return text === before ? null : text;
}

function transformHtml(text, file) {
  if (!/<html[\s>]/.test(text) || /<html[^>]*\sdata-brand=/.test(text)) return null;
  changes.push({ file, what: '<html data-brand="iam"> 추가 (IAM 색)' });
  return text.replace(/<html(?=[\s>])/, '<html data-brand="iam"');
}

function transformPackageJson(text, file) {
  const pkg = JSON.parse(text);
  let changed = false;
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
    const deps = pkg[field];
    if (!deps) continue;
    const next = {};
    for (const [name, range] of Object.entries(deps)) {
      const to = PACKAGE_MAP[name];
      if (!to) {
        next[name] = range;
        continue;
      }
      next[to] = `^${versions[to]}`;
      changes.push({ file, what: `${field}: ${name}@${range} → ${to}@^${versions[to]}` });
      if (name === '@iam/ui' && usesAuthKit) {
        next['@actoz/kit-auth'] = `^${versions['@actoz/kit-auth']}`;
        changes.push({ file, what: `${field}: @actoz/kit-auth@^${versions['@actoz/kit-auth']} 추가 (AuthLayout·OtpInput)` });
      }
      changed = true;
    }
    pkg[field] = next;
  }
  return changed ? JSON.stringify(pkg, null, 2) + '\n' : null;
}

function transformNpmrc(text, file) {
  if (!text.includes('packages/iam/npm') && !text.includes('@iam:registry')) return null;
  changes.push({ file, what: '.npmrc: @iam 레지스트리 → @actoz 레지스트리 (actoz 조직)' });
  return text
    .replace(/^@iam:registry=.*$/m, `@actoz:registry=${REGISTRY}`)
    .replaceAll('packages/iam/npm', 'packages/actoz/npm');
}

// 1차: 코드와 스타일 (AuthLayout·OtpInput을 쓰는지 먼저 알아야 package.json과 CSS에 인증 키트를 넣을 수 있다)
const files = [];
for await (const path of walk(root)) files.push(path);
const pending = new Map();
for (const path of files) {
  const file = relative(root, path) || path;
  if (!CODE.test(path)) continue;
  const next = transformCode(await readFile(path, 'utf8'), file);
  if (next !== null) pending.set(path, next);
}
for (const path of files) {
  const file = relative(root, path) || path;
  const text = await readFile(path, 'utf8');
  let next = null;
  if (STYLE.test(path)) {
    next = transformStyle(text, file);
    // 인증 키트를 쓰면 공통 CSS 다음 줄에 키트 CSS를 넣는다.
    const css = next ?? text;
    if (usesAuthKit && css.includes('@actoz/ui/styles.css') && !css.includes('@actoz/kit-auth/styles.css')) {
      next = css.replace(/(@import\s+["']@actoz\/ui\/styles\.css["'];?)/, '$1\n@import "@actoz/kit-auth/styles.css";');
      changes.push({ file, what: 'CSS @actoz/kit-auth/styles.css 추가' });
    }
  } else if (path.endsWith('.html')) next = transformHtml(text, file);
  else if (path.endsWith('package.json') && !path.includes('node_modules')) next = transformPackageJson(text, file);
  else if (path.endsWith('.npmrc')) next = transformNpmrc(text, file);
  if (next !== null) pending.set(path, next);
}

if (!files.some((p) => p.endsWith('.html') && /index\.html$/.test(p))) {
  todos.push({ file: '(앱 루트)', line: 0, what: '<html>에 data-brand="iam"을 단다. 없으면 AHA 색(검정 primary)으로 보인다' });
}

if (write) for (const [path, text] of pending) await writeFile(path, text);

const byFile = Map.groupBy ? Map.groupBy(changes, (c) => c.file) : changes.reduce((m, c) => m.set(c.file, [...(m.get(c.file) ?? []), c]), new Map());
console.log(`${write ? '고친' : '고칠'} 파일 ${pending.size}개${write ? '' : ' (미리보기. --write를 주면 고친다)'}`);
for (const [file, list] of byFile) {
  console.log(`\n${file}`);
  for (const what of new Set(list.map((c) => c.what))) console.log(`  - ${what}`);
}
if (todos.length > 0) {
  console.log(`\n확인할 것 ${todos.length}개`);
  for (const t of todos) console.log(`  ${t.file}${t.line ? `:${t.line}` : ''}  ${t.what}`);
}
console.log('\n다음: pnpm install → 타입 검사·빌드 → 화면 확인 (docs/migration/iam-to-actoz.md)');
