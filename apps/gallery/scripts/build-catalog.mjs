// Storybook manifest + 토큰 manifest → generated/catalog.json.
// 갤러리 화면과 MCP 서버가 같은 파일을 읽는다. Storybook을 먼저 빌드해야 한다 (pnpm build-storybook).
// 사이트(환경변수 SITE, site.config.ts)마다 그 사이트의 키트와 브랜드 템플릿만 담고, 토큰 값은 사이트 브랜드의 값으로 쓴다.
// id 중복·누락 검사는 사이트와 상관없이 모든 패키지에 대해 한다.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { site } from '../site.config.ts';

const root = new URL('../../../', import.meta.url);
const ui = new URL('packages/ui/', root);
const tokens = new URL('packages/tokens/', root);
const out = new URL('../generated/catalog.json', import.meta.url);

const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));
/** 빌드 결과물을 읽는다. 없으면 무엇을 먼저 실행할지 알려 주고 끝낸다. */
const readBuilt = (url, hint) =>
  readJson(url).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
    console.error(`${fileURLToPath(url)}가 없습니다. 먼저 \`${hint}\`을 실행하세요.`);
    process.exit(1);
  });

const manifest = await readBuilt(new URL('storybook-static/manifests/components.json', ui), 'pnpm build-storybook');
const index = await readBuilt(new URL('storybook-static/index.json', ui), 'pnpm build-storybook');
const tokenManifest = await readBuilt(new URL('dist/tokens.manifest.json', tokens), 'pnpm --filter ./packages/tokens build');
const uiPkg = await readJson(new URL('package.json', ui));
const tokensPkg = await readJson(new URL('package.json', tokens));

// 각 패키지의 catalog.config.json: 키트, 분류(Storybook 제목의 첫 단계 → 갤러리 분류), 템플릿 설명.
// ui(공통)를 먼저, 나머지 패키지는 이름순으로 합친다. 분류와 키트의 순서가 화면 순서다.
const packagesDir = new URL('packages/', root);
const dirs = (await readdir(packagesDir, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => Number(b === 'ui') - Number(a === 'ui') || a.localeCompare(b));
const configs = [];
for (const dir of dirs) {
  const base = new URL(`${dir}/`, packagesDir);
  // 파일이 없는 패키지만 건너뛴다. JSON이 잘못됐으면 조용히 빠지지 않도록 빌드를 실패시킨다.
  const config = await readJson(new URL('catalog.config.json', base)).catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw new Error(`packages/${dir}/catalog.config.json: ${error.message}`);
  });
  if (config) configs.push({ ...config, dir: base, pkg: await readJson(new URL('package.json', base)) });
}
// 키트마다 설치할 패키지를 붙인다 (core → @actoz/ui, ai → @actoz/kit-ai).
const kits = configs.flatMap((c) => (c.kits ?? []).map((kit) => ({ ...kit, package: { name: c.pkg.name, version: c.pkg.version } })));
const categories = configs.flatMap((c) => c.categories ?? []);
const templateMeta = Object.assign({}, ...configs.map((c) => c.templates ?? {}));

/** 여러 catalog.config.json에 걸쳐 id가 겹치면 빌드를 실패시킨다. 겹치면 갤러리 경로와 MCP 이름 찾기가 먼저 나온 것만 고른다. */
function assertUnique(label, ids) {
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`catalog.config.json: ${label} "${id}"가 두 번 나옵니다`);
    seen.add(id);
  }
}
assertUnique('키트 id', kits.map((k) => k.id));
assertUnique('분류 id', categories.map((c) => c.id));
assertUnique('분류 storybook', categories.map((c) => c.storybook));
assertUnique('템플릿 id', configs.flatMap((c) => Object.keys(c.templates ?? {})));
// 키트 id → 그 키트 템플릿이 쓰는 예시 데이터 파일 내용.
const templateFixtures = {};
for (const config of configs.filter((c) => c.templateFixtures)) {
  const source = await readFile(new URL(config.templateFixtures, config.dir), 'utf8');
  for (const kit of config.kits ?? []) templateFixtures[kit.id] = source;
}

const storiesByTitle = new Map();
for (const entry of Object.values(index.entries)) {
  if (entry.type !== 'story') continue;
  const list = storiesByTitle.get(entry.title) ?? [];
  list.push(entry);
  storiesByTitle.set(entry.title, list);
}

/** 스토리 meta의 tags('kit:<id>')로 키트를 정한다. 태그가 없으면 core. */
function kitOf(title) {
  const tag = (storiesByTitle.get(title) ?? []).flatMap((e) => e.tags ?? []).find((t) => t.startsWith('kit:'));
  const kit = tag ? tag.slice('kit:'.length) : 'core';
  if (!kits.some((k) => k.id === kit)) throw new Error(`${title}: catalog.config.json에 없는 키트 "${kit}"`);
  return kit;
}

/** Storybook manifest의 경로(packages/ui 기준) → 저장소 루트 기준 경로. 예: ../kit-ai/src/... → packages/kit-ai/src/... */
const repoPath = (path) => fileURLToPath(new URL(path, ui)).slice(fileURLToPath(root).length);

const slugify = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const firstSentence = (text = '') => text.split('\n')[0].trim();

function props(component) {
  const docgen = component.reactDocgenTypescript?.props ?? {};
  return Object.values(docgen)
    .map((p) => ({
      name: p.name,
      type: p.type?.raw ?? p.type?.name ?? '',
      required: Boolean(p.required),
      defaultValue: p.defaultValue?.value ?? null,
      description: p.description ?? '',
    }))
    .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
}

function stories(component, title) {
  const entries = storiesByTitle.get(title) ?? [];
  return (component.stories ?? []).map((story) => {
    const entry = entries.find((e) => e.name === story.name);
    return {
      name: story.name,
      exportName: entry?.exportName ?? story.name.replace(/\s+/g, ''),
      storyId: entry?.id ?? null,
      description: story.description ?? '',
      snippet: story.snippet ?? '',
    };
  });
}

const components = [];
const templates = [];

for (const component of Object.values(manifest.components)) {
  const title = Object.values(index.entries).find((e) => e.importPath === component.path)?.title;
  if (!title) continue;
  const [group, ...rest] = title.split('/');
  const displayName = rest.join('/');
  const base = {
    id: component.id,
    name: displayName,
    component: component.name,
    slug: slugify(displayName),
    title,
    kit: kitOf(title),
    description: component.description ?? '',
    summary: firstSentence(component.description),
    import: component.import ?? '',
    storyFile: repoPath(component.path),
    props: props(component),
    stories: stories(component, title),
  };

  if (group === 'Templates') {
    const meta = templateMeta[component.id];
    if (!meta) throw new Error(`${title}: 키트의 catalog.config.json templates에 "${component.id}"가 없습니다 (label, group, description)`);
    const source = await readFile(new URL(component.path, ui), 'utf8');
    templates.push({
      ...base,
      label: meta.label,
      group: meta.group,
      summary: meta.description,
      ...(meta.density ? { density: meta.density } : {}),
      brand: meta.brand ?? 'aha',
      source,
    });
    continue;
  }
  if (group === 'Foundations') continue; // 토큰 데이터로 따로 보여준다.
  const category = categories.find((c) => c.storybook === group);
  if (!category) throw new Error(`${title}: catalog.config.json categories에 storybook "${group}"인 분류가 없습니다`);
  components.push({ ...base, category: category.id });
}

const missingTemplates = Object.keys(templateMeta).filter((id) => !templates.some((t) => t.id === id));
if (missingTemplates.length > 0) throw new Error(`catalog.config.json templates에 스토리가 없는 id: ${missingTemplates.join(', ')}`);
assertUnique('slug (컴포넌트·템플릿)', [...components, ...templates].map((c) => c.slug));

components.sort((a, b) => a.name.localeCompare(b.name));
templates.sort((a, b) => Object.keys(templateMeta).indexOf(a.id) - Object.keys(templateMeta).indexOf(b.id));

// ── 사이트별로 거른다 ──
const unknownKits = site.kits.filter((id) => !kits.some((k) => k.id === id));
if (unknownKits.length > 0) throw new Error(`site.config.ts(${site.id}) kits에 없는 키트: ${unknownKits.join(', ')}`);
const siteKitIds = new Set(['core', ...site.kits]);
const siteComponents = components.filter((c) => siteKitIds.has(c.kit));
const siteTemplates = templates.filter((t) => siteKitIds.has(t.kit) && t.brand === site.brand);
// 사이트에 보이는 컴포넌트가 하나도 없는 분류는 뺀다 (예: IAM 사이트의 AI·대시보드 분류).
const usedCategories = new Set(siteComponents.map((c) => c.category));

/**
 * 토큰 값을 사이트 브랜드의 값으로 바꾼다. 갤러리 디자인 기초와 MCP get_tokens가 value(라이트)·dark를 그대로 보여주기 때문이다.
 * 브랜드 테마(brand-<브랜드>)와 그 다크 조합(fallbacks에서 brand-<브랜드>와 dark를 함께 쓰는 테마)이 덮어쓴 값만 바뀐다.
 */
function brandTokens(manifest) {
  if (site.brand === 'aha') return manifest.tokens;
  const light = `brand-${site.brand}`;
  const dark = Object.entries(manifest.fallbacks ?? {}).find(([, chain]) => chain.includes('dark') && chain.includes(light))?.[0];
  if (!manifest.themes.includes(light)) throw new Error(`토큰 manifest에 ${light} 테마가 없습니다 (packages/tokens/tokens/themes)`);
  return manifest.tokens.map((token) => {
    const darkValue = (dark && token[dark]) ?? token.dark;
    if (!token[light]) return darkValue === token.dark ? token : { ...token, dark: darkValue };
    return {
      ...token,
      value: token[light].value,
      reference: token[light].reference,
      description: token[light].description ?? token.description,
      ...(darkValue ? { dark: darkValue } : {}),
    };
  });
}

const catalog = {
  generatedAt: new Date().toISOString(),
  site: { id: site.id, brand: site.brand },
  packages: { ui: { name: uiPkg.name, version: uiPkg.version }, tokens: { name: tokensPkg.name, version: tokensPkg.version } },
  kits: kits.filter((k) => siteKitIds.has(k.id)),
  categories: categories.filter((c) => usedCategories.has(c.id)).map(({ storybook, ...c }) => c),
  components: siteComponents,
  templates: siteTemplates,
  // 템플릿 스토리가 쓰는 예시 데이터. 에이전트가 템플릿을 옮겨 쓸 때 함께 본다.
  templateFixtures: Object.fromEntries(Object.entries(templateFixtures).filter(([kit]) => siteKitIds.has(kit))),
  tokens: brandTokens(tokenManifest),
};

await mkdir(new URL('.', out), { recursive: true });
await writeFile(out, JSON.stringify(catalog, null, 2));
console.log(
  `catalog(${site.id}): 컴포넌트 ${catalog.components.length}개, 템플릿 ${catalog.templates.length}개, 토큰 ${catalog.tokens.length}개 → ${fileURLToPath(out)}`,
);
