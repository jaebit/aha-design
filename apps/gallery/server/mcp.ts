// 에이전트용 MCP 도구. 갤러리와 같은 catalog.json을 마크다운으로 풀어서 돌려준다.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { site } from '../site.config.ts';
import { type Catalog, type CatalogComponent, type CatalogTemplate, type CatalogToken, inKit, kitOf, tokenClass } from '../src/catalog-types.ts';

export interface McpContext {
  catalog: Catalog;
  /** 갤러리 주소. 결과에 사람이 볼 링크를 붙인다. */
  publicUrl: string;
  /** 디자인 시스템 패키지를 받는 npm 레지스트리 주소. */
  registry: string;
}

/** 도메인 키트(공통 제외). 없으면 MCP 안내와 도구에서 키트 이야기를 뺀다. */
const domainKitsOf = (catalog: Catalog) => catalog.kits.filter((k) => k.id !== 'core');

function instructions(catalog: Catalog) {
  const { ui, tokens } = catalog.packages;
  const kits = domainKitsOf(catalog);
  const example = kits[0];
  const kitLines = example
    ? [
        `- 먼저 프로젝트를 정한다: 프로젝트의 package.json에 설치된 ${site.scope}/kit-* 가 그 프로젝트의 키트다 (${example.package.name} → kit "${example.id}"). 없으면 list_kits로 고르거나 사용자에게 묻는다.`,
        '- list_components, search, list_templates에 kit을 넘기면 공통 + 그 키트만 나온다. 다른 키트 부품을 가져다 쓰지 않는다. 꼭 필요하면 사용자에게 그 키트 설치를 먼저 묻는다.',
      ]
    : [];
  return [
    `${site.fullName}. 공통 부품은 ${ui.name}${kits.length > 0 ? `, 도메인 부품은 키트 패키지(${kits.map((k) => k.package.name).join(', ')})` : ''}, 토큰은 ${tokens.name}.`,
    `- 다른 디자인 시스템의 부품(이름이 ${site.scope}/로 시작하지 않는 디자인 패키지)과 섞지 않는다.`,
    ...kitLines,
    `- 컴포넌트는 get_component가 알려 주는 import 문 그대로 가져온다. 그 패키지가 프로젝트에 없으면 get_setup_guide${kits.length > 0 ? '(kit)' : ''}를 보고 설치한다.`,
    '- 화면을 만들기 전에 list_components 또는 search로 이미 있는 컴포넌트를 찾고, get_component로 props와 예제를 읽은 뒤 그대로 쓴다. 있는 것을 새로 만들지 않는다.',
    ...(catalog.templates.length > 0 ? ['- 화면 전체가 필요하면 list_templates와 get_template으로 비슷한 화면부터 가져온다.'] : []),
    '- 새 프로젝트에 설치하거나 규칙이 궁금하면 get_setup_guide를 읽는다.',
    '- 색·글자 크기·모서리는 get_tokens의 시맨틱 토큰 클래스만 쓴다 (hex, rgb(), 임의값 금지).',
  ].join('\n');
}

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
  if (!key) return '';
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
    : `패키지: \`${kit.package.name}\` (${kit.label} 키트). 공통 부품은 \`${catalog.packages.ui.name}\`에서 가져온다.`;
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
  const fixtures = ctx.catalog.templateFixtures[template.kit];
  return [
    `# ${template.label} (${template.name})`,
    template.summary,
    `갤러리: ${ctx.publicUrl}/templates/${template.slug}`,
    packageLine(ctx.catalog, template),
    (template.density ?? kitOf(ctx.catalog, template)?.density) === 'compact'
      ? '이 화면은 촘촘한 밀도로 쓴다: `<html data-density="compact">`.'
      : '',
    '## 전체 소스',
    `Storybook 스토리 파일이다. 옮겨 쓸 때 \`Meta\`/\`StoryObj\`/\`withLinkActions\` 같은 Storybook 전용 코드는 빼고, 페이지 함수만 가져간다.${fixtures ? ' `./fixtures`의 예시 데이터는 아래에 있다.' : ''}`,
    `\`\`\`tsx\n${template.source}\n\`\`\``,
    fixtures ? `## fixtures.tsx (예시 데이터)\n\n\`\`\`tsx\n${fixtures}\n\`\`\`` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

const tokenGroups = {
  color: (t: CatalogToken) => t.type === 'color' && !/chart|status/.test(t.name),
  chart: (t: CatalogToken) => t.name.startsWith('color.chart'),
  status: (t: CatalogToken) => t.name.startsWith('color.status'),
  typography: (t: CatalogToken) => t.name.startsWith('font.'),
  radius: (t: CatalogToken) => t.name.startsWith('radius.'),
  space: (t: CatalogToken) => t.name.startsWith('space.'),
} as const;

function tokensDoc(catalog: Catalog, group: keyof typeof tokenGroups | 'all') {
  const groups = group === 'all' ? (Object.keys(tokenGroups) as (keyof typeof tokenGroups)[]) : [group];
  const sections = groups.map((g) => {
    // 간격은 테마가 아니라 밀도(compact)에 따라 바뀐다. 클래스로 쓰지 않고 모든 간격·크기 클래스의 단위가 된다.
    if (g === 'space') {
      const rows = catalog.tokens
        .filter(tokenGroups.space)
        .map((t) => `| \`${t.name}\` | \`${t.value}\` | ${t.compact ? `\`${t.compact.value}\`` : ''} | ${escapeCell(t.description ?? '')} |`);
      return [`## space`, '', '| 토큰 | 기본 | 촘촘함 (compact) | 용도 |', '| --- | --- | --- | --- |', ...rows].join('\n');
    }
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
    `# ${site.name} 디자인 토큰`,
    '컴포넌트와 화면에서는 클래스 열의 Tailwind 클래스만 쓴다. 다크 값은 테마가 자동으로 바꾸므로 분기하지 않는다.',
    ...sections,
  ].join('\n\n');
}

function setupGuide(ctx: McpContext, kit?: string) {
  const { ui, tokens } = ctx.catalog.packages;
  const kits = ctx.catalog.kits.filter((k) => k.id !== 'core' && (!kit || k.id === kit));
  const kitList = kits
    .map((k) => `   - **${k.label}** — ${k.description}\n     설치 \`pnpm add ${k.package.name}@^${k.package.version}\`, CSS \`@import "${k.package.name}/styles.css";\``)
    .join('\n');
  const extra = site.extraRules
    .map((rule) => [`## ${rule.title}`, '', ...rule.items.map((item, i) => `${i + 1}. ${item}`)].join('\n'))
    .join('\n\n');
  return `# ${site.name} 디자인 시스템 설치와 규칙

## 새 React 프로젝트에 설치 (Vite + Tailwind v4)

1. 프로젝트 루트에 \`.npmrc\`를 만든다.
   \`\`\`
   ${site.scope}:registry=${ctx.registry}
   \`\`\`
2. 패키지를 설치한다.
   \`\`\`sh
   pnpm add ${ui.name}@^${ui.version} ${tokens.name}@^${tokens.version} lucide-react
   pnpm add -D tailwindcss @tailwindcss/vite
   \`\`\`
${
  kits.length > 0
    ? `   화면에 도메인 키트 부품이 필요하면 그 키트만 설치한다. get_component 결과의 "패키지" 줄로 어느 키트인지 안다.\n${kitList}\n`
    : ''
}3. \`vite.config.ts\`의 plugins에 \`tailwindcss()\` (from \`@tailwindcss/vite\`)를 추가한다.
4. 앱의 메인 CSS(예: \`src/index.css\`)를 아래 한 줄로 시작한다. Tailwind, 토큰, ${site.fontName} 서체가 함께 들어온다. \`@import "tailwindcss"\`를 따로 쓰지 않는다.
   \`\`\`css
   @import "${ui.name}/styles.css";
   \`\`\`
${
  kits.length > 0
    ? `   설치한 키트마다 바로 다음 줄에 키트 CSS를 추가한다 (키트 컴포넌트의 클래스를 생성 대상에 넣는다). 예:
   \`\`\`css
   @import "${ui.name}/styles.css";
   @import "${kits[0]?.package.name}/styles.css";
   \`\`\`
`
    : ''
}5. Tooltip을 쓰는 화면은 앱 루트를 \`<TooltipProvider>\`로 감싼다 (AppShell은 이미 포함).
6. 다크 모드는 OS 설정을 자동으로 따른다. 고정하려면 \`<html data-theme="light">\` 또는 \`"dark"\`.
7. ${site.densityGuide}

## UI 규칙

1. 컴포넌트를 만들기 전에 list_components / search로 있는 것을 찾고 get_component의 예제를 따른다.
2. 색은 시맨틱 토큰 클래스만 쓴다 (\`bg-primary\`, \`text-muted-foreground\`, \`border-border\`). hex, \`rgb()\`, \`bg-[#...]\` 금지.
3. 글자 크기는 \`text-caption | text-body-sm | text-body | text-heading | text-title | text-display\`. \`text-sm\`, \`text-lg\` 같은 Tailwind 기본 크기는 쓰지 않는다.
4. 모서리는 \`rounded-sm | md | lg | xl | full\`만 쓴다.
5. 상태는 \`tone\`으로 표시한다 (${site.statusExample}). 상태를 색만으로 전달하지 않는다.
6. 차트 색은 \`chart-1\`부터 순서대로, 6개까지. 범례와 표 보기를 함께 둔다.
7. 아이콘은 \`lucide-react\`. 아이콘만 있는 버튼에는 \`aria-label\`을 준다.
8. 텍스트 입력에서 한글 조합 중 Enter(\`event.nativeEvent.isComposing\`, Safari는 \`event.keyCode === 229\`)를 제출로 처리하지 않는다.

${extra ? `${extra}\n\n` : ''}갤러리: ${ctx.publicUrl}`;
}

function kitsDoc(catalog: Catalog) {
  const rows = catalog.kits.map((kit) => {
    const components = catalog.components.filter((c) => c.kit === kit.id).length;
    const templates = catalog.templates.filter((t) => t.kit === kit.id).length;
    return [
      `## ${kit.label} (\`${kit.id}\`)`,
      kit.description,
      `- 패키지: \`${kit.package.name}@${kit.package.version}\`${kit.id === 'core' ? ' (모든 프로젝트에 설치)' : ''}`,
      `- 컴포넌트 ${components}개${templates > 0 ? `, 화면 템플릿 ${templates}개` : ''}`,
      kit.density === 'compact' ? '- 기본 밀도: 촘촘함 (`<html data-density="compact">`)' : '',
    ]
      .filter(Boolean)
      .join('\n');
  });
  return [
    `# ${site.name} 키트`,
    domainKitsOf(catalog).length > 0
      ? `모든 프로젝트는 공통(core, ${catalog.packages.ui.name})을 쓰고, 화면 종류에 맞는 키트를 하나 더 설치한다. 프로젝트의 package.json에 설치된 ${site.scope}/kit-*가 그 프로젝트의 키트다.`
      : `아직 도메인 키트가 없다. 모든 프로젝트는 공통(core, ${catalog.packages.ui.name})만 설치한다.`,
    ...rows,
    domainKitsOf(catalog).length > 0
      ? 'list_components, search, list_templates에 kit id를 넘기면 공통 + 그 키트만 본다. 설치 방법은 get_setup_guide(kit).'
      : '설치 방법은 get_setup_guide.',
  ].join('\n\n');
}

function search(catalog: Catalog, query: string, kit?: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const score = (fields: string[]) => {
    const haystack = fields.join('\n').toLowerCase();
    return terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
  };
  const results = [
    ...catalog.components.filter((c) => inKit(c, kit)).map((c) => ({
      kind: '컴포넌트',
      name: c.name,
      summary: c.summary,
      score: score([c.name, c.description, ...c.props.map((p) => `${p.name} ${p.description}`), ...c.stories.map((s) => `${s.name} ${s.description}`)]) + (terms.some((t) => c.name.toLowerCase().includes(t)) ? 2 : 0),
    })),
    ...catalog.templates.filter((t) => inKit(t, kit)).map((t) => ({
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
    { name: site.mcpName, title: `${site.name} 디자인 시스템`, version: catalog.packages.ui.version },
    { instructions: instructions(catalog) },
  );
  const readOnly = { readOnlyHint: true, openWorldHint: false };
  // 도구 설명의 예시 이름. site.config의 대표 컴포넌트·템플릿에서 고른다.
  const featured = site.featuredComponents
    .map((f) => catalog.components.find((c) => c.slug === f.slug))
    .filter((c) => c !== undefined);
  const componentExamples = [...featured.slice(0, 2).map((c) => c.name), featured[0]?.slug].filter(Boolean).join(', ');
  const templateExample =
    catalog.templates.find((t) => t.slug === site.featuredTemplates[0]) ?? catalog.templates[0];
  const kitIds = domainKitsOf(catalog).map((k) => k.id);
  const kitArg = z
    .enum(['core', ...kitIds] as [string, ...string[]])
    .optional()
    .describe(`키트 id. 주면 공통 + 그 키트만 본다 (core는 공통만). 프로젝트 package.json의 ${site.scope}/kit-*로 정한다. 생략하면 전체`);
  // 도메인 키트가 없으면 도구가 kit 인자를 받지 않는다. 타입은 같게 두고 실행 시에만 뺀다 (값은 늘 undefined).
  const kitShape = (kitIds.length > 0 ? { kit: kitArg } : {}) as { kit: typeof kitArg };

  server.registerTool(
    'list_kits',
    {
      title: '키트 목록',
      description: `공통(core)${kitIds.length > 0 ? `과 도메인 키트(${domainKitsOf(catalog).map((k) => k.label).join(', ')})` : ''}의 패키지, 설명, 부품 수, 기본 밀도. 어떤 키트로 만들지 정할 때 먼저 본다.`,
      annotations: readOnly,
    },
    () => text(kitsDoc(catalog)),
  );

  server.registerTool(
    'list_components',
    {
      title: '컴포넌트 목록',
      description: `${site.name} 디자인 시스템의 컴포넌트를 분류별로 나열한다. 화면을 만들기 전에 먼저 호출한다.`,
      inputSchema: {
        category: z.enum(catalog.categories.map((c) => c.id) as [string, ...string[]]).optional().describe('분류 id. 생략하면 전체'),
        ...kitShape,
      },
      annotations: readOnly,
    },
    ({ category, kit }) => {
      const sections = catalog.categories
        .filter((c) => !category || c.id === category)
        .map((c) => ({ c, items: catalog.components.filter((comp) => comp.category === c.id && inKit(comp, kit)) }))
        .filter(({ items }) => items.length > 0)
        .map(({ c, items }) => {
          const pkg = items[0] ? kitOf(catalog, items[0])?.package.name : undefined;
          return [`## ${c.label} (${c.id})${pkg ? ` · ${pkg}` : ''}`, c.description, ...items.map((comp) => `- **${comp.name}** — ${comp.summary}`)].join('\n');
        });
      if (sections.length === 0) return text(`조건에 맞는 컴포넌트가 없습니다.${kit ? ' kit 없이 부르거나 다른 category를 고른다.' : ''}`);
      return text(`${sections.join('\n\n')}\n\n자세한 props와 예제는 get_component(name)으로 본다.`);
    },
  );

  server.registerTool(
    'get_component',
    {
      title: '컴포넌트 상세',
      description: '컴포넌트 하나의 설명, import 문, props 표, 사용 예제 코드를 돌려준다.',
      inputSchema: { name: z.string().describe(`컴포넌트 이름 또는 slug. 예: ${componentExamples}`) },
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
      inputSchema: { query: z.string().describe('찾을 내용 (한국어 또는 영어)'), ...kitShape },
      annotations: readOnly,
    },
    ({ query, kit }) => text(search(catalog, query, kit)),
  );

  server.registerTool(
    'list_templates',
    {
      title: '화면 템플릿 목록',
      description: '컴포넌트를 조합한 완성 화면 예시를 나열한다. 새 화면을 만들 때 가장 비슷한 것부터 고른다.',
      inputSchema: { ...kitShape },
      annotations: readOnly,
    },
    ({ kit }) => {
      const templates = catalog.templates.filter((t) => inKit(t, kit));
      if (templates.length === 0) {
        return text(
          `${kit ? `"${kit}"에는` : '아직'} 화면 템플릿이 없습니다.${kit ? ' kit 없이 부르면 다른 키트의 템플릿을 볼 수 있다.' : ''} list_components와 get_component의 예제로 화면을 만든다.`,
        );
      }
      return text(
        templates.map((t) => `- **${t.label}** (\`${t.name}\`, ${kitOf(catalog, t)?.label ?? t.group}) — ${t.summary}`).join('\n') +
          '\n\n전체 소스는 get_template(name)으로 본다.',
      );
    },
  );

  server.registerTool(
    'get_template',
    {
      title: '화면 템플릿 소스',
      description: '템플릿 화면의 전체 소스 코드와 예시 데이터를 돌려준다.',
      inputSchema: { name: z.string().describe(`템플릿 이름 또는 라벨.${templateExample ? ` 예: ${templateExample.name}, ${templateExample.label}` : ''}`) },
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
      inputSchema: { group: z.enum(['all', 'color', 'chart', 'status', 'typography', 'radius', 'space']).default('all') },
      annotations: readOnly,
    },
    ({ group }) => text(tokensDoc(catalog, group)),
  );

  server.registerTool(
    'get_setup_guide',
    {
      title: '설치와 규칙',
      description: `새 React 프로젝트에 ${site.name} 디자인 시스템을 설치하는 방법과 UI 작성 규칙.${kitIds.length > 0 ? ' kit을 주면 그 키트 설치만 안내한다.' : ''}`,
      inputSchema: { ...kitShape },
      annotations: readOnly,
    },
    ({ kit }) => text(setupGuide(ctx, kit)),
  );

  return server;
}
