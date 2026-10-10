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
  /** 키트 id. 스토리 meta의 tags('kit:<id>')에서 오고, 없으면 core. */
  kit: string;
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
  /** 이 템플릿의 권장 밀도. catalog.config.json의 templates에 적는다. 없으면 키트의 밀도를 따른다. */
  density?: Density;
}

/** 공통(core) 또는 도메인 키트. 각 패키지의 catalog.config.json에 정의한다. */
export interface CatalogKit {
  id: string;
  label: string;
  description: string;
  /** 이 키트를 쓰려면 설치하는 패키지. core는 공통 ui 패키지. */
  package: { name: string; version: string };
  /** 이 키트 화면의 기본 밀도. 관리자 키트는 compact. 없으면 기본 밀도. */
  density?: Density;
}

export type Density = 'default' | 'compact';

/** 선택한 키트에서 보이는 항목인지. 공통(core)은 항상 보인다. kit이 없으면(전체) 모두 보인다. */
export function inKit(item: { kit: string }, kit: string | null | undefined) {
  return !kit || item.kit === 'core' || item.kit === kit;
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
  kits: CatalogKit[];
  categories: CatalogCategory[];
  components: CatalogComponent[];
  templates: CatalogTemplate[];
  /** 키트 id → 그 키트의 템플릿 스토리가 쓰는 예시 데이터(fixtures.tsx) 소스. */
  templateFixtures: Record<string, string>;
  tokens: CatalogToken[];
}

/** 컴포넌트·템플릿이 속한 키트 (설치할 패키지 포함). */
export function kitOf(catalog: Catalog, item: { kit: string }): CatalogKit | undefined {
  return catalog.kits.find((k) => k.id === item.kit);
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
