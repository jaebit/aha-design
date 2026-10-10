import { Badge, Button, Card, Chip, cn } from '@aha/ui';
import { ChevronRight, Code, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useState } from 'react';

import { type CatalogTemplate, type Density, inKit } from '../catalog-types';
import { catalog, storyFrameUrl } from '../lib/catalog';
import { kitById, useKit } from '../lib/kit';
import { templatePrompt } from '../lib/prompt';
import { Link, navigate, useLocation } from '../lib/router';
import { useTheme } from '../lib/theme';
import { CodeBlock } from '../site/code-block';
import { CopyButton } from '../site/copy-button';
import { DensityToggle } from '../site/density-toggle';
import { KitScopeNotice } from '../site/kit-scope';
import { ScaledFrame } from '../site/scaled-frame';
import { NotFoundPage } from './not-found';

export function TemplateCard({ template }: { template: CatalogTemplate }) {
  const { resolved } = useTheme();
  const storyId = template.stories[0]?.storyId;
  return (
    <Link href={`/templates/${template.slug}`} className="group">
      <Card padding="none" className="flex h-full flex-col overflow-hidden transition-shadow group-hover:shadow-popover">
        <div className="border-b border-border">
          {storyId ? <ScaledFrame src={storyFrameUrl(storyId, resolved)} title={`${template.label} 미리보기`} /> : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-heading font-semibold group-hover:underline group-hover:underline-offset-4">{template.label}</span>
            <Badge variant="soft">{kitById(template.kit)?.label ?? template.group}</Badge>
          </div>
          <p className="text-body-sm text-muted-foreground">{template.summary}</p>
          {template.stories.length > 1 ? (
            <span className="text-caption text-muted-foreground">화면 상태 {template.stories.length}가지</span>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}

export function TemplatesIndexPage() {
  const { search } = useLocation();
  const group = search.get('group') ?? '';
  const { kit } = useKit();
  const scoped = catalog.templates.filter((t) => inKit(t, kit));
  const groups = [...new Set(scoped.map((t) => t.group))];
  const visible = scoped.filter((t) => !group || t.group === group);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-4">
        <h1 className="text-display font-bold tracking-tight">화면 템플릿</h1>
        <p className="max-w-2xl text-body text-muted-foreground">
          컴포넌트를 조합한 완성 화면입니다. 만들려는 서비스와 가장 비슷한 화면을 골라 에이전트에게 바꿀 부분만 알려 주세요.
        </p>
        <KitScopeNotice hidden={catalog.templates.length - scoped.length} />
        <div className="flex flex-wrap gap-2 pt-2" role="group" aria-label="분류">
          <Chip selected={!group} onClick={() => navigate('/templates', { replace: true, scroll: false })}>
            전체 {scoped.length}
          </Chip>
          {groups.map((g) => (
            <Chip key={g} selected={group === g} onClick={() => navigate(`/templates?group=${encodeURIComponent(g)}`, { replace: true, scroll: false })}>
              {g}
            </Chip>
          ))}
        </div>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {visible.map((template) => (
          <TemplateCard key={template.slug} template={template} />
        ))}
      </div>
    </div>
  );
}

const viewports = [
  { id: 'desktop', label: '데스크톱', width: 1280, icon: <Monitor aria-hidden /> },
  { id: 'tablet', label: '태블릿', width: 820, icon: <Tablet aria-hidden /> },
  { id: 'mobile', label: '모바일', width: 390, icon: <Smartphone aria-hidden /> },
] as const;

export function TemplateDetailPage({ slug }: { slug: string }) {
  const template = catalog.templates.find((t) => t.slug === slug);
  const { resolved } = useTheme();
  const [storyIndex, setStoryIndex] = useState(0);
  const [viewport, setViewport] = useState<(typeof viewports)[number]['id']>('desktop');
  const [showSource, setShowSource] = useState(false);
  const recommended: Density = kitById(template?.kit)?.density ?? 'default';
  const [density, setDensity] = useState<Density>(recommended);
  if (!template) return <NotFoundPage />;

  const story = template.stories[storyIndex] ?? template.stories[0];
  const width = viewports.find((v) => v.id === viewport)!.width;
  const src = story?.storyId ? storyFrameUrl(story.storyId, resolved, density) : '';

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-5">
        <nav aria-label="위치" className="flex items-center gap-1 text-body-sm text-muted-foreground">
          <Link href="/templates" className="hover:text-foreground">
            화면 템플릿
          </Link>
          <ChevronRight aria-hidden className="size-4" />
          <span>{template.group}</span>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-display font-bold tracking-tight">{template.label}</h1>
        </div>
        <p className="max-w-3xl text-body text-muted-foreground">{template.summary}</p>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={() => templatePrompt(template)} label="에이전트용 프롬프트 복사" copiedLabel="복사됨 · 에이전트에 붙여넣으세요" variant="primary" size="md" />
          <Button variant="secondary" onClick={() => setShowSource((v) => !v)} aria-expanded={showSource}>
            <Code aria-hidden />
            {showSource ? '소스 숨기기' : '소스 보기'}
          </Button>
          {src ? (
            <Button variant="ghost" asChild>
              <a href={src} target="_blank" rel="noreferrer">
                새 창에서 열기
                <ExternalLink aria-hidden />
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      {showSource ? <CodeBlock code={template.source} label={template.storyFile} maxHeight={560} /> : null}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {template.stories.length > 1 ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label="화면 상태">
              {template.stories.map((s, i) => (
                <Chip key={s.exportName} selected={i === storyIndex} onClick={() => setStoryIndex(i)}>
                  {s.name}
                </Chip>
              ))}
            </div>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap items-center gap-3">
          <DensityToggle value={density} onChange={setDensity} recommended={recommended} />
          <div className="flex gap-1" role="group" aria-label="화면 크기">
            {viewports.map((v) => (
              <Button
                key={v.id}
                variant={viewport === v.id ? 'secondary' : 'ghost'}
                size="icon"
                aria-label={v.label}
                aria-pressed={viewport === v.id}
                onClick={() => setViewport(v.id)}
              >
                {v.icon}
              </Button>
            ))}
          </div>
          </div>
        </div>
        {story?.description ? <p className="text-body-sm text-muted-foreground">{story.description}</p> : null}
        <div className="flex justify-center overflow-hidden rounded-lg border border-border bg-subtle p-2 sm:p-4">
          <div className={cn('w-full overflow-hidden rounded-md border border-border shadow-popover')} style={{ maxWidth: width }}>
            {src ? <ScaledFrame key={`${src}-${width}`} src={src} title={`${template.label} 미리보기`} width={width} height={viewport === 'mobile' ? 844 : 800} interactive /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
