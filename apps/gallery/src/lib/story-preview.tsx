// 스토리 파일을 갤러리에서 직접 렌더링한다. Storybook과 같은 스토리가 곧 갤러리 예제다.
// 전체 화면 레이아웃(layout: 'fullscreen') 스토리는 Storybook iframe으로 보여준다.
import { Component, type ComponentType, type ReactNode, createElement, useEffect, useMemo, useState } from 'react';

import { site } from '../../site.config';
import { storyFrameUrl } from './catalog';
import { useTheme } from './theme';

type Args = Record<string, unknown>;
interface StoryContext {
  args: Args;
  globals: { theme: string };
  parameters: Record<string, unknown>;
}
type Decorator = (Story: ComponentType, context: StoryContext) => ReactNode;
interface StoryAnnotations {
  args?: Args;
  parameters?: Record<string, unknown>;
  decorators?: Decorator[];
  render?: (args: Args, context: StoryContext) => ReactNode;
}
interface StoryModule {
  default: StoryAnnotations & { component?: ComponentType<Args> };
  [exportName: string]: unknown;
}

const modules = import.meta.glob<StoryModule>([
  '../../../../packages/ui/src/**/*.stories.tsx',
  '../../../../packages/kit-*/src/**/*.stories.tsx',
]);
const cache = new Map<string, StoryModule>();

/** catalog의 storyFile(packages/ui/... 또는 키트 패키지 경로)로 스토리 모듈을 불러온다. */
function useStoryModule(storyFile: string) {
  const [module, setModule] = useState(() => cache.get(storyFile));
  useEffect(() => {
    if (cache.has(storyFile)) return setModule(cache.get(storyFile));
    const load = modules[`../../../../${storyFile}`];
    if (!load) return;
    let active = true;
    void load().then((m) => {
      cache.set(storyFile, m);
      if (active) setModule(m);
    });
    return () => {
      active = false;
    };
  }, [storyFile]);
  return module;
}

function compose(meta: StoryModule['default'], story: StoryAnnotations, theme: string): ComponentType {
  const args = { ...meta.args, ...story.args };
  const context: StoryContext = { args, globals: { theme }, parameters: { ...meta.parameters, ...story.parameters } };
  const render =
    story.render ?? meta.render ?? ((a: Args) => (meta.component ? createElement(meta.component, a) : null));
  // Storybook과 같은 순서: 스토리 데코레이터가 안쪽, 컴포넌트 데코레이터가 바깥쪽.
  const decorators = [...(story.decorators ?? []), ...(meta.decorators ?? [])];
  return decorators.reduce<ComponentType>(
    (Inner, decorator) => {
      const Wrapped = () => decorator(Inner, context);
      return Wrapped;
    },
    () => render(args, context),
  );
}

/**
 * 스토리를 그릴 브랜드. 스토리·meta의 parameters.brand가 있으면 그것, 없으면 사이트 브랜드.
 * 예: AHA 사이트의 Button IamBrand 스토리는 iam, IAM 사이트의 일반 스토리는 iam.
 */
function storyBrand(module: StoryModule, exportName: string) {
  const story = module[exportName] as StoryAnnotations | undefined;
  const brand = story?.parameters?.brand ?? module.default.parameters?.brand;
  return typeof brand === 'string' ? brand : site.brand;
}

export function isFullscreen(module: StoryModule | undefined, exportName: string) {
  const story = module?.[exportName] as StoryAnnotations | undefined;
  const layout = story?.parameters?.layout ?? module?.default.parameters?.layout;
  return layout === 'fullscreen';
}

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <p className="text-body-sm text-muted-foreground">미리보기를 그리지 못했습니다.</p>;
    return this.props.children;
  }
}

interface StoryPreviewProps {
  storyFile: string;
  exportName: string;
  storyId: string | null;
  /** iframe으로 그릴 때의 높이. */
  frameHeight?: number;
  /**
   * 열린 메뉴·툴팁(defaultOpen)처럼 화면 위에 뜨는 요소가 있는 스토리. 갤러리에 바로 그리면 미리보기 칸 밖으로 넘치므로
   * iframe 안에 가둔다.
   */
  isolate?: boolean;
  /** iframe으로 그릴 때의 밀도. 바로 그릴 때는 감싸는 요소의 data-density를 따른다. */
  density?: 'default' | 'compact';
  title: string;
}

/** 스토리 하나를 그린다. 카드 썸네일과 상세 페이지 예제가 함께 쓴다. */
export function StoryPreview({ storyFile, exportName, storyId, frameHeight = 420, title, isolate = false, density }: StoryPreviewProps) {
  const { resolved } = useTheme();
  const module = useStoryModule(storyFile);
  const Story = useMemo(() => {
    const story = module?.[exportName] as StoryAnnotations | undefined;
    return module && story ? compose(module.default, story, resolved) : null;
  }, [module, exportName, resolved]);

  if (!module) return <div className="h-24 animate-pulse rounded-md bg-muted" aria-hidden />;

  const brand = storyBrand(module, exportName);
  // aha는 속성이 없는 기본값이라, 다른 브랜드 페이지 안의 일부 요소만 aha로 되돌릴 수 없다. 이때는 iframe에 가둔다.
  const needsFrame = brand !== site.brand && brand === 'aha';
  if ((isolate || needsFrame || isFullscreen(module, exportName)) && storyId) {
    return (
      <iframe
        title={`${title} 미리보기`}
        src={storyFrameUrl(storyId, resolved, density, brand)}
        loading="lazy"
        className="block w-full rounded-md border border-border bg-background"
        style={{ height: frameHeight }}
      />
    );
  }

  if (!Story) return null;
  const preview = (
    <PreviewBoundary>
      <Story />
    </PreviewBoundary>
  );
  // 사이트와 다른 브랜드의 스토리(예: AHA 사이트의 IAM 예시)는 감싸는 요소에 브랜드를 건다. 레이아웃에는 끼어들지 않는다.
  return brand === site.brand ? preview : <div data-brand={brand} className="contents">{preview}</div>;
}
