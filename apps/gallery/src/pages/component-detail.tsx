import { Badge, Button, Callout } from '@aha/ui';
import { ChevronRight, Code, ExternalLink, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { type CatalogComponent, type CatalogStory, type Density, kitOf } from '../catalog-types';
import { site } from '../../site.config';
import { catalog, categoryLabel } from '../lib/catalog';
import { componentPrompt } from '../lib/prompt';
import { Link } from '../lib/router';
import { StoryPreview } from '../lib/story-preview';
import { CodeBlock } from '../site/code-block';
import { CopyButton } from '../site/copy-button';
import { DensityToggle } from '../site/density-toggle';
import { RichText } from '../site/rich-text';
import { NotFoundPage } from './not-found';

const anchor = (story: CatalogStory) => `example-${story.exportName.toLowerCase()}`;

function Example({ component, story, density }: { component: CatalogComponent; story: CatalogStory; density: Density }) {
  const [showCode, setShowCode] = useState(false);
  return (
    <section id={anchor(story)} className="flex scroll-mt-24 flex-col gap-3" aria-labelledby={`${anchor(story)}-title`}>
      <div className="flex flex-col gap-1">
        <h3 id={`${anchor(story)}-title`} className="text-heading font-semibold">
          {story.name}
        </h3>
        {story.description ? <RichText text={story.description} className="text-body-sm text-muted-foreground" /> : null}
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex min-h-40 items-center justify-center bg-subtle p-6 sm:p-10">
          {/* 이 칸 안에만 밀도 테마를 건다. 토큰 CSS가 [data-density] 요소에도 적용된다. */}
          <div className="w-full" data-density={density === 'compact' ? 'compact' : undefined}>
            <StoryPreview
              storyFile={component.storyFile}
              exportName={story.exportName}
              storyId={story.storyId}
              title={`${component.name} ${story.name}`}
              isolate={story.snippet.includes('defaultOpen')}
              frameHeight={360}
              density={density}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-background px-3 py-2">
          <Button variant="ghost" size="sm" onClick={() => setShowCode((v) => !v)} aria-expanded={showCode}>
            <Code aria-hidden />
            {showCode ? '코드 숨기기' : '코드 보기'}
          </Button>
          <CopyButton value={() => componentPrompt(component, story)} label="이 예제로 프롬프트 복사" variant="ghost" />
          {story.storyId ? (
            <Button variant="ghost" size="sm" asChild className="ml-auto">
              <a href={`/storybook/?path=/story/${story.storyId}`} target="_blank" rel="noreferrer">
                Storybook
                <ExternalLink aria-hidden />
              </a>
            </Button>
          ) : null}
        </div>
        {showCode && story.snippet ? (
          <CodeBlock code={story.snippet} label="tsx" className="rounded-none border-x-0 border-b-0" />
        ) : null}
      </div>
    </section>
  );
}

function PropsTable({ component }: { component: CatalogComponent }) {
  if (component.props.length === 0) return <p className="text-body-sm text-muted-foreground">따로 정의한 속성이 없습니다.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[40rem] text-left text-body-sm">
        <thead className="bg-subtle text-caption text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              이름
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              값
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              설명
            </th>
          </tr>
        </thead>
        <tbody>
          {component.props.map((prop) => (
            <tr key={prop.name} className="border-t border-border align-top">
              <td className="whitespace-nowrap px-4 py-3">
                <code className="font-mono font-semibold">{prop.name}</code>
                {prop.required ? (
                  <Badge variant="soft" className="ml-2">
                    필수
                  </Badge>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <code className="break-words font-mono text-caption text-muted-foreground">{prop.type}</code>
                {prop.defaultValue ? <div className="pt-1 text-caption text-muted-foreground">기본값 {prop.defaultValue}</div> : null}
              </td>
              <td className="px-4 py-3">{prop.description ? <RichText text={prop.description} /> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComponentDetailPage({ slug }: { slug: string }) {
  const component = catalog.components.find((c) => c.slug === slug);
  const kit = component ? kitOf(catalog, component) : undefined;
  const recommended: Density = kit?.density ?? 'default';
  const [density, setDensity] = useState<Density>(recommended);
  if (!component) return <NotFoundPage />;
  const siblings = catalog.components.filter((c) => c.category === component.category && c.slug !== slug).slice(0, 6);

  return (
    <div className="mx-auto flex max-w-7xl gap-12 px-4 py-12 sm:px-6">
      <article className="flex min-w-0 flex-1 flex-col gap-12">
        <header className="flex flex-col gap-5">
          <nav aria-label="위치" className="flex items-center gap-1 text-body-sm text-muted-foreground">
            <Link href="/components" className="hover:text-foreground">
              컴포넌트
            </Link>
            <ChevronRight aria-hidden className="size-4" />
            <Link href={`/components?category=${component.category}`} className="hover:text-foreground">
              {categoryLabel(component.category)}
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-display font-bold tracking-tight">{component.name}</h1>
            {kit && kit.id !== 'core' ? (
              <Badge variant="soft" size="md">
                {kit.label} 키트 · {kit.package.name}
              </Badge>
            ) : null}
          </div>
          <RichText text={component.description} className="max-w-3xl text-body text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            <CopyButton value={() => componentPrompt(component)} label="에이전트용 프롬프트 복사" copiedLabel="복사됨 · 에이전트에 붙여넣으세요" variant="primary" size="md" />
            <CopyButton value={component.import} label="import 복사" size="md" />
          </div>
          <Callout title="에이전트에게 이렇게 맡기세요">
            프롬프트를 복사해 Claude Code나 Cursor에 붙여넣고, 대괄호 안에 만들고 싶은 화면을 적으세요. 에이전트가 {site.mcpName} MCP로 이
            컴포넌트의 사용법을 확인하고 같은 디자인으로 만듭니다. <Link href="/start" className="font-semibold underline underline-offset-4">연결 방법</Link>
          </Callout>
        </header>

        <section className="flex flex-col gap-10" aria-labelledby="examples">
          <h2 id="examples" className="flex items-center gap-2 text-title font-bold">
            <Sparkles aria-hidden className="size-6" />
            예제
          </h2>
          <DensityToggle value={density} onChange={setDensity} recommended={recommended} />
          {component.stories.map((story) => (
            <Example key={story.exportName} component={component} story={story} density={density} />
          ))}
        </section>

        <section className="flex flex-col gap-4" aria-labelledby="props">
          <h2 id="props" className="text-title font-bold">
            속성 (Props)
          </h2>
          <CodeBlock code={component.import} label="import" />
          <PropsTable component={component} />
        </section>

        {siblings.length > 0 ? (
          <section className="flex flex-col gap-4" aria-labelledby="related">
            <h2 id="related" className="text-heading font-semibold">
              같은 분류의 컴포넌트
            </h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((c) => (
                <Button key={c.slug} variant="secondary" size="sm" asChild>
                  <Link href={`/components/${c.slug}`}>{c.name}</Link>
                </Button>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 flex-col gap-2 xl:flex" aria-label="이 페이지 목차">
        <span className="text-caption font-semibold text-muted-foreground">이 페이지</span>
        {component.stories.map((story) => (
          <a key={story.exportName} href={`#${anchor(story)}`} className="text-body-sm text-muted-foreground hover:text-foreground">
            {story.name}
          </a>
        ))}
        <a href="#props" className="text-body-sm text-muted-foreground hover:text-foreground">
          속성 (Props)
        </a>
      </aside>
    </div>
  );
}
