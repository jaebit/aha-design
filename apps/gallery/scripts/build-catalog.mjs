// Storybook manifest + 토큰 manifest → generated/catalog.json.
// 갤러리 화면과 MCP 서버가 같은 파일을 읽는다. Storybook을 먼저 빌드해야 한다 (pnpm build-storybook).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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

// Storybook 제목의 첫 단계 → 갤러리 분류. 순서가 화면 순서다.
const categories = [
  { id: 'components', storybook: 'Components', label: '기본', description: '버튼, 배지, 입력창처럼 어디서나 쓰는 부품' },
  { id: 'ai', storybook: 'AI', label: 'AI 대화', description: '질문 입력, 답변, 근거, 결과 카드 등 AI 서비스 화면 부품' },
  { id: 'shell', storybook: 'Shell', label: '앱 틀', description: '내비게이션, 사이드바, 머리말처럼 화면의 뼈대' },
  { id: 'data', storybook: 'Data', label: '데이터', description: '표, 차트, 통계 카드, 필터' },
];

// 템플릿은 화면 단위라 따로 분류한다.
const templateMeta = {
  'templates-home': { label: '홈', group: '공통', description: '로그인 후 첫 화면. 서비스 카드와 이어서 하기 목록.' },
  'templates-allhistory': { label: '전체 기록', group: '공통', description: '모든 서비스의 대화 기록을 검색하고 거르는 목록 화면.' },
  'templates-guidechat': { label: '사내 가이드 챗', group: 'AI 대화', description: '질문하고 근거와 함께 답을 받는 대화형 서비스 화면.' },
  'templates-taskconversation': { label: '작업형 대화 (회의록·문서 검토)', group: 'AI 대화', description: '파일을 올리고 단계별로 결과를 받는 작업형 AI 화면.' },
  'templates-ithreport': { label: 'ITH 보고서', group: '업무', description: '보고서 목록과 상세, 표와 상태 배지를 쓰는 업무 화면.' },
  'templates-newsletter': { label: '뉴스레터 구독', group: '업무', description: '구독 설정과 요약 정보를 보여주는 설정 화면.' },
  'templates-admindashboard': { label: '관리자 대시보드', group: '관리', description: '통계 카드, 차트, 대기 목록이 있는 관리 화면.' },
};

const storiesByTitle = new Map();
for (const entry of Object.values(index.entries)) {
  if (entry.type !== 'story') continue;
  const list = storiesByTitle.get(entry.title) ?? [];
  list.push(entry);
  storiesByTitle.set(entry.title, list);
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
