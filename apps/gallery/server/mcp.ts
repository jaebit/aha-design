// 에이전트용 MCP 도구. 갤러리와 같은 catalog.json을 마크다운으로 풀어서 돌려준다.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { type Catalog, type CatalogComponent, type CatalogTemplate, type CatalogToken, kitOf, tokenClass } from '../src/catalog-types.ts';

export interface McpContext {
  catalog: Catalog;
  /** 갤러리 주소. 결과에 사람이 볼 링크를 붙인다. */
  publicUrl: string;
  /** @aha 패키지를 받는 npm 레지스트리 주소. */
  registry: string;
}

const instructions = `AHA 사내 디자인 시스템. 공통 부품은 @aha/ui, 도메인 부품은 키트 패키지(@aha/kit-ai 등), 토큰은 @aha/tokens.
- 컴포넌트는 get_component가 알려 주는 import 문 그대로 가져온다. 그 패키지가 프로젝트에 없으면 get_setup_guide를 보고 설치한다.
- 화면을 만들기 전에 list_components 또는 search로 이미 있는 컴포넌트를 찾고, get_component로 props와 예제를 읽은 뒤 그대로 쓴다. 있는 것을 새로 만들지 않는다.
- 화면 전체가 필요하면 list_templates와 get_template으로 비슷한 화면부터 가져온다.
- 새 프로젝트에 설치하거나 규칙이 궁금하면 get_setup_guide를 읽는다.
- 색·글자 크기·모서리는 get_tokens의 시맨틱 토큰 클래스만 쓴다 (hex, rgb(), 임의값 금지).`;

const text = (value: string) => ({ content: [{ type: 'text' as const, text: value }] });

function normalize(value: string) {
  return value.toLowerCase().replace(/[\s_-]/g, '');
}

function findByName<T extends { name: string; slug: string; component?: string; label?: string }>(items: T[], name: string) {
  const key = normalize(name);
  return items.find((item) => [item.name, item.slug, item.component, item.label].some((v) => v && normalize(v) === key));
}

function suggest(items: { name: string }[], name: string) {
  const key = normalize(name);
  const close = items.filter((item) => normalize(item.name).includes(key) || key.includes(normalize(item.name)));
  return close.length > 0 ? ` 비슷한 이름: ${close.map((c) => c.name).join(', ')}` : '';
}

function escapeCell(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\n+/g, '<br>');
}

function propsTable(component: CatalogComponent | CatalogTemplate) {
  if (component.props.length === 0) return '';
  const rows = component.props.map(
    (p) =>
      `| \`${p.name}\`${p.required ? ' (필수)' : ''} | \`${escapeCell(p.type)}\` | ${p.defaultValue ? `\`${escapeCell(p.defaultValue)}\`` : ''} | ${escapeCell(p.description)} |`,
  );
  return ['## Props', '', '| 이름 | 타입 | 기본값 | 설명 |', '| --- | --- | --- | --- |', ...rows].join('\n');
}

function packageLine(catalog: Catalog, item: CatalogComponent | CatalogTemplate) {
  const kit = kitOf(catalog, item);
  if (!kit) return '';
  return kit.id === 'core'
    ? `패키지: \`${kit.package.name}\` (공통)`
    : `패키지: \`${kit.package.name}\` (${kit.label} 키트). 공통 부품은 \`@aha/ui\`에서 가져온다.`;
}

function componentDoc(component: CatalogComponent, ctx: McpContext) {
  const examples = component.stories.map((story) =>
    [`### ${story.name}`, story.description, story.snippet ? `\`\`\`tsx\n${story.snippet}\n\`\`\`` : '']
      .filter(Boolean)
      .join('\n\n'),
  );
  return [
    `# ${component.name}`,
    component.description,
    `갤러리: ${ctx.publicUrl}/components/${component.slug}`,
    packageLine(ctx.catalog, component),
    '## Import',
    `\`\`\`tsx\n${component.import}\n\`\`\``,
    propsTable(component),
    '## 예제',
    ...examples,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function templateDoc(template: CatalogTemplate, ctx: McpContext) {
  return [
    `# ${template.label} (${template.name})`,
    template.summary,
    `갤러리: ${ctx.publicUrl}/templates/${template.slug}`,
    packageLine(ctx.catalog, template),
    '## 전체 소스',
    'Storybook 스토리 파일이다. 옮겨 쓸 때 `Meta`/`StoryObj`/`withLinkActions` 같은 Storybook 전용 코드는 빼고, 페이지 함수만 가져간다. `./fixtures`의 예시 데이터는 아래에 있다.',
    `\`\`\`tsx\n${template.source}\n\`\`\``,
    '## fixtures.tsx (예시 데이터)',
    `\`\`\`tsx\n${ctx.catalog.templateFixtures[template.kit] ?? ''}\n\`\`\``,
  ].join('\n\n');
}

const tokenGroups = {
  color: (t: CatalogToken) => t.type === 'color' && !/chart|status/.test(t.name),
  chart: (t: CatalogToken) => t.name.startsWith('color.chart'),
  status: (t: CatalogToken) => t.name.startsWith('color.status'),
  typography: (t: CatalogToken) => t.name.startsWith('font.'),
  radius: (t: CatalogToken) => t.name.startsWith('radius.'),
} as const;

function tokensDoc(catalog: Catalog, group: keyof typeof tokenGroups | 'all') {
  const groups = group === 'all' ? (Object.keys(tokenGroups) as (keyof typeof tokenGroups)[]) : [group];
  const sections = groups.map((g) => {
    const rows = catalog.tokens
      .filter((t) => t.layer === 'semantic' || g === 'typography' || g === 'radius')
      .filter(tokenGroups[g])
      .map((t) => {
        const cls = tokenClass(t);
        return `| \`${t.name}\` | ${cls ? `\`${cls}\`` : ''} | \`${t.value}\` | ${t.dark ? `\`${t.dark.value}\`` : ''} | ${escapeCell(t.description ?? '')} |`;
      });
    return [`## ${g}`, '', '| 토큰 | 클래스 | 라이트 | 다크 | 용도 |', '| --- | --- | --- | --- | --- |', ...rows].join('\n');
  });
  return [
    '# AHA 디자인 토큰',
    '컴포넌트와 화면에서는 클래스 열의 Tailwind 클래스만 쓴다. 다크 값은 테마가 자동으로 바꾸므로 분기하지 않는다.',
    ...sections,
  ].join('\n\n');
}

function setupGuide(ctx: McpContext) {
  const { ui, tokens } = ctx.catalog.packages;
  const kits = ctx.catalog.kits.filter((k) => k.id !== 'core');
  const kitList = kits
    .map((k) => `   - **${k.label}** — ${k.description}\n     설치 \`pnpm add ${k.package.name}@^${k.package.version}\`, CSS \`@import "${k.package.name}/styles.css";\``)
    .join('\n');
  return `# AHA 디자인 시스템 설치와 규칙

## 새 React 프로젝트에 설치 (Vite + Tailwind v4)

1. 프로젝트 루트에 \`.npmrc\`를 만든다.
   \`\`\`
   @aha:registry=${ctx.registry}
   \`\`\`
2. 패키지를 설치한다.
   \`\`\`sh
   pnpm add ${ui.name}@^${ui.version} ${tokens.name}@^${tokens.version} lucide-react
   pnpm add -D tailwindcss @tailwindcss/vite
   \`\`\`
   화면에 도메인 키트 부품이 필요하면 그 키트만 설치한다. get_component 결과의 "패키지" 줄로 어느 키트인지 안다.
${kitList}
3. \`vite.config.ts\`의 plugins에 \`tailwindcss()\` (from \`@tailwindcss/vite\`)를 추가한다.
4. 앱의 메인 CSS(예: \`src/index.css\`)를 아래 한 줄로 시작한다. Tailwind, 토큰, Pretendard 서체가 함께 들어온다. \`@import "tailwindcss"\`를 따로 쓰지 않는다.
   \`\`\`css
   @import "@aha/ui/styles.css";
   \`\`\`
   설치한 키트마다 바로 다음 줄에 키트 CSS를 추가한다 (키트 컴포넌트의 클래스를 생성 대상에 넣는다). 예:
   \`\`\`css
   @import "@aha/ui/styles.css";
   @import "${kits[0]?.package.name ?? '@aha/kit-이름'}/styles.css";
   \`\`\`
5. Tooltip을 쓰는 화면은 앱 루트를 \`<TooltipProvider>\`로 감싼다 (AppShell은 이미 포함).
6. 다크 모드는 OS 설정을 자동으로 따른다. 고정하려면 \`<html data-theme="light">\` 또는 \`"dark"\`.
7. 관리자 화면처럼 한 화면에 많은 행과 입력을 보여야 하면 \`<html data-density="compact">\`로 촘촘한 밀도를 켠다. 간격만 줄고 글자 크기와 색은 그대로다. 관리자 키트(@aha/kit-admin) 템플릿은 이 밀도 기준이다. 컴포넌트에 간격을 따로 줄이는 클래스를 넣지 않는다.

## UI 규칙

1. 컴포넌트를 만들기 전에 list_components / search로 있는 것을 찾고 get_component의 예제를 따른다.
2. 색은 시맨틱 토큰 클래스만 쓴다 (\`bg-primary\`, \`text-muted-foreground\`, \`border-border\`). hex, \`rgb()\`, \`bg-[#...]\` 금지.
3. 글자 크기는 \`text-caption | text-body-sm | text-body | text-heading | text-title | text-display\`. \`text-sm\`, \`text-lg\` 같은 Tailwind 기본 크기는 쓰지 않는다.
4. 모서리는 \`rounded-sm | md | lg | xl | full\`만 쓴다.
5. 상태는 \`tone\`으로 표시한다 (\`<Badge tone="warning">일부 품질 저하</Badge>\`, StatCard \`delta.tone\`). 상태를 색만으로 전달하지 않는다.
6. 차트 색은 \`chart-1\`부터 순서대로, 6개까지. 범례와 표 보기를 함께 둔다.
7. 아이콘은 \`lucide-react\`. 아이콘만 있는 버튼에는 \`aria-label\`을 준다.
8. 텍스트 입력에서 한글 조합 중 Enter(\`event.nativeEvent.isComposing\`)를 제출로 처리하지 않는다.

갤러리: ${ctx.publicUrl}`;
}

function search(catalog: Catalog, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const score = (fields: string[]) => {
    const haystack = fields.join('\n').toLowerCase();
    return terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
  };
  const results = [
    ...catalog.components.map((c) => ({
      kind: '컴포넌트',
      name: c.name,
      summary: c.summary,
      score: score([c.name, c.description, ...c.props.map((p) => `${p.name} ${p.description}`), ...c.stories.map((s) => `${s.name} ${s.description}`)]) + (terms.some((t) => c.name.toLowerCase().includes(t)) ? 2 : 0),
    })),
    ...catalog.templates.map((t) => ({
      kind: '템플릿',
      name: t.label,
      summary: t.summary,
      score: score([t.label, t.name, t.summary, ...t.stories.map((s) => `${s.name} ${s.description}`)]),
    })),
  ]
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  if (results.length === 0) return `"${query}"에 맞는 항목이 없습니다. list_components로 전체 목록을 보세요.`;
  return results.map((r) => `- [${r.kind}] **${r.name}** — ${r.summary}`).join('\n');
}

export function createMcpServer(ctx: McpContext) {
  const { catalog } = ctx;
  const server = new McpServer(
    { name: 'aha-design', title: 'AHA 디자인 시스템', version: catalog.packages.ui.version },
    { instructions },
  );
  const readOnly = { readOnlyHint: true, openWorldHint: false };

  server.registerTool(
    'list_components',
    {
      title: '컴포넌트 목록',
      description: 'AHA 디자인 시스템의 컴포넌트를 분류별로 나열한다. 화면을 만들기 전에 먼저 호출한다.',
      inputSchema: { category: z.enum(catalog.categories.map((c) => c.id) as [string, ...string[]]).optional().describe('분류 id. 생략하면 전체') },
      annotations: readOnly,
    },
    ({ category }) => {
      const sections = catalog.categories
        .filter((c) => !category || c.id === category)
        .map((c) => {
          const items = catalog.components.filter((comp) => comp.category === c.id);
          const pkg = items[0] ? kitOf(catalog, items[0])?.package.name : undefined;
          return [`## ${c.label} (${c.id})${pkg ? ` · ${pkg}` : ''}`, c.description, ...items.map((comp) => `- **${comp.name}** — ${comp.summary}`)].join('\n');
        });
      return text(`${sections.join('\n\n')}\n\n자세한 props와 예제는 get_component(name)으로 본다.`);
    },
  );

  server.registerTool(
    'get_component',
    {
      title: '컴포넌트 상세',
      description: '컴포넌트 하나의 설명, import 문, props 표, 사용 예제 코드를 돌려준다.',
      inputSchema: { name: z.string().describe('컴포넌트 이름. 예: Badge, ResultCard, data-table') },
      annotations: readOnly,
    },
    ({ name }) => {
      const component = findByName(catalog.components, name);
      if (!component) return { ...text(`"${name}" 컴포넌트가 없습니다.${suggest(catalog.components, name)}`), isError: true };
      return text(componentDoc(component, ctx));
    },
  );

  server.registerTool(
    'search',
    {
      title: '검색',
      description: '하고 싶은 일이나 화면 요소로 컴포넌트와 템플릿을 찾는다. 예: "파일 업로드", "상태 표시", "표 페이지 이동".',
      inputSchema: { query: z.string().describe('찾을 내용 (한국어 또는 영어)') },
      annotations: readOnly,
    },
    ({ query }) => text(search(catalog, query)),
  );

  server.registerTool(
    'list_templates',
    {
      title: '화면 템플릿 목록',
      description: '컴포넌트를 조합한 완성 화면 예시를 나열한다. 새 화면을 만들 때 가장 비슷한 것부터 고른다.',
      annotations: readOnly,
    },
    () =>
      text(
        catalog.templates.map((t) => `- **${t.label}** (\`${t.name}\`, ${t.group}) — ${t.summary}`).join('\n') +
          '\n\n전체 소스는 get_template(name)으로 본다.',
      ),
  );

  server.registerTool(
    'get_template',
    {
      title: '화면 템플릿 소스',
      description: '템플릿 화면의 전체 소스 코드와 예시 데이터를 돌려준다.',
      inputSchema: { name: z.string().describe('템플릿 이름 또는 라벨. 예: AdminDashboardPage, 관리자 대시보드') },
      annotations: readOnly,
    },
    ({ name }) => {
      const template = findByName(catalog.templates, name);
      if (!template) return { ...text(`"${name}" 템플릿이 없습니다.${suggest(catalog.templates, name)}`), isError: true };
      return text(templateDoc(template, ctx));
    },
  );

  server.registerTool(
    'get_tokens',
    {
      title: '디자인 토큰',
      description: '색, 차트, 상태, 글자, 모서리 토큰과 대응하는 Tailwind 클래스, 라이트·다크 값을 돌려준다.',
      inputSchema: { group: z.enum(['all', 'color', 'chart', 'status', 'typography', 'radius']).default('all') },
      annotations: readOnly,
    },
    ({ group }) => text(tokensDoc(catalog, group)),
  );

  server.registerTool(
    'get_setup_guide',
    {
      title: '설치와 규칙',
      description: '새 React 프로젝트에 AHA 디자인 시스템을 설치하는 방법과 UI 작성 규칙.',
      annotations: readOnly,
    },
    () => text(setupGuide(ctx)),
  );

  return server;
}
