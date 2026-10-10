// Storybook manifest + 토큰 manifest → generated/catalog.json.
// 갤러리 화면과 MCP 서버가 같은 파일을 읽는다. Storybook을 먼저 빌드해야 한다 (pnpm build-storybook).
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../../../', import.meta.url);
const ui = new URL('packages/ui/', root);
const tokens = new URL('packages/tokens/', root);
const out = new URL('../generated/catalog.json', import.meta.url);

const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));

const manifest = await readJson(new URL('storybook-static/manifests/components.json', ui)).catch(() => {
  console.error('Storybook manifest가 없습니다. 먼저 `pnpm build-storybook`을 실행하세요.');
  process.exit(1);
});
const index = await readJson(new URL('storybook-static/index.json', ui));
const tokenManifest = await readJson(new URL('dist/tokens.manifest.json', tokens));
const uiPkg = await readJson(new URL('package.json', ui));
const tokensPkg = await readJson(new URL('package.json', tokens));

// 각 패키지의 catalog.config.json: 키트, 분류(Storybook 제목의 첫 단계 → 갤러리 분류), 템플릿 설명.
// 여러 패키지의 설정을 순서대로 합친다. 분류와 키트의 순서가 화면 순서다.
const packagesDir = new URL('packages/', root);
const configs = [];
for (const dir of (await readdir(packagesDir, { withFileTypes: true })).filter((d) => d.isDirectory())) {
  const config = await readJson(new URL(`${dir.name}/catalog.config.json`, packagesDir)).catch(() => null);
  if (config) configs.push(config);
}
const kits = configs.flatMap((c) => c.kits ?? []);
const categories = configs.flatMap((c) => c.categories ?? []);
const templateMeta = Object.assign({}, ...configs.map((c) => c.templates ?? {}));

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
    storyFile: component.path.replace(/^\.\//, 'packages/ui/'),
    props: props(component),
    stories: stories(component, title),
  };

  if (group === 'Templates') {
    const meta = templateMeta[component.id] ?? { label: displayName, group: '기타', description: '' };
    const source = await readFile(new URL(component.path, ui), 'utf8');
    templates.push({ ...base, label: meta.label, group: meta.group, summary: meta.description, source });
    continue;
  }
  const category = categories.find((c) => c.storybook === group);
  if (!category) continue; // Foundations는 토큰 데이터로 따로 보여준다.
  components.push({ ...base, category: category.id });
}

components.sort((a, b) => a.name.localeCompare(b.name));
templates.sort((a, b) => Object.keys(templateMeta).indexOf(a.id) - Object.keys(templateMeta).indexOf(b.id));

const catalog = {
  generatedAt: new Date().toISOString(),
  packages: { ui: { name: uiPkg.name, version: uiPkg.version }, tokens: { name: tokensPkg.name, version: tokensPkg.version } },
  kits,
  categories: categories.map(({ storybook, ...c }) => c),
  components,
  templates,
  // 템플릿 스토리가 쓰는 예시 데이터. 에이전트가 템플릿을 옮겨 쓸 때 함께 본다.
  templateFixtures: await readFile(new URL('src/templates/fixtures.tsx', ui), 'utf8'),
  tokens: tokenManifest.tokens,
};

await mkdir(new URL('.', out), { recursive: true });
await writeFile(out, JSON.stringify(catalog, null, 2));
console.log(
  `catalog: 컴포넌트 ${components.length}개, 템플릿 ${templates.length}개, 토큰 ${catalog.tokens.length}개 → ${fileURLToPath(out)}`,
);
