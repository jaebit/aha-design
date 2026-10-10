// generated/catalog.json의 형태. 갤러리 화면(src)과 MCP 서버(server)가 함께 쓴다.

export interface CatalogProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
}

export interface CatalogStory {
  name: string;
  exportName: string;
  /** Storybook 스토리 id. iframe 미리보기 주소에 쓴다. */
  storyId: string | null;
  description: string;
  /** 이 스토리를 그대로 옮긴 사용 예제 코드. */
  snippet: string;
}

export interface CatalogComponent {
  id: string;
  /** 화면에 보이는 이름 (Storybook 제목의 마지막 단계). */
  name: string;
  /** manifest의 대표 컴포넌트 이름. DropdownMenu처럼 여러 부품으로 된 경우 다를 수 있다. */
  component: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  summary: string;
  import: string;
  storyFile: string;
  props: CatalogProp[];
  stories: CatalogStory[];
}

export interface CatalogTemplate extends Omit<CatalogComponent, 'category'> {
  label: string;
  group: string;
  /** 템플릿 스토리 파일 전체 소스. */
  source: string;
}

export interface CatalogCategory {
  id: string;
  label: string;
  description: string;
}

export interface CatalogToken {
  name: string;
  cssVar: string;
  type: string;
  value: string;
  reference?: string;
  description?: string;
  layer: 'primitive' | 'semantic';
  dark?: { value: string; reference?: string };
}

export interface Catalog {
  generatedAt: string;
  packages: Record<'ui' | 'tokens', { name: string; version: string }>;
  categories: CatalogCategory[];
  components: CatalogComponent[];
  templates: CatalogTemplate[];
  templateFixtures: string;
  tokens: CatalogToken[];
}

/** 토큰 이름 → 컴포넌트에서 쓰는 Tailwind 클래스 예시. 해당 없으면 null. */
export function tokenClass(token: CatalogToken): string | null {
  const [group, ...rest] = token.name.split('.');
  const key = rest.join('-');
  if (token.layer !== 'semantic' && group !== 'radius' && !token.name.startsWith('font.size')) return null;
  if (group === 'color') {
    if (key.startsWith('chart-')) return `fill-${key} / bg-${key}`;
    if (key.endsWith('foreground') || key === 'destructive') return `text-${key}`;
    if (key.startsWith('border') || key === 'input' || key === 'ring') return `border-${key}`;
    if (key.startsWith('status-')) return `text-${key}`;
    return `bg-${key}`;
  }
  if (group === 'radius') return `rounded-${key}`;
  if (token.name.startsWith('font.size.')) return `text-${token.name.slice('font.size.'.length)}`;
  return null;
}
