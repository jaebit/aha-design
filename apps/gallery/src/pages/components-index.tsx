import { Card, Chip, cn, SearchInput } from '@actoz/ui';

import { type CatalogComponent, inKit } from '../catalog-types';
import { site } from '../../site.config';
import { catalog } from '../lib/catalog';
import { useKit } from '../lib/kit';
import { Link, navigate, useLocation } from '../lib/router';
import { StoryPreview } from '../lib/story-preview';
import { KitScopeNotice } from '../site/kit-scope';

/** 카드에 보여줄 스토리. "Gallery"처럼 여러 변형을 모은 스토리가 있으면 그것을 쓴다. */
function thumbnailStory(component: CatalogComponent) {
  return component.stories.find((s) => s.exportName === 'Gallery') ?? component.stories[0];
}

function matches(component: CatalogComponent, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return [component.name, component.description, ...component.stories.map((s) => `${s.name} ${s.description}`)]
    .join('\n')
    .toLowerCase()
    .includes(q);
}

export function ComponentCard({ component }: { component: CatalogComponent }) {
  const story = thumbnailStory(component);
  return (
    <Link href={`/components/${component.slug}`} className="group">
      <Card padding="none" className="flex h-full flex-col overflow-hidden transition-shadow group-hover:shadow-popover">
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-subtle p-4" inert>
          {story ? (
            <div className="w-full" style={{ zoom: 0.75 }}>
              <StoryPreview
                storyFile={component.storyFile}
                exportName={story.exportName}
                storyId={story.storyId}
                title={component.name}
                frameHeight={300}
                isolate={story.snippet.includes('defaultOpen')}
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-1 border-t border-border p-4">
          <span className="text-body font-semibold group-hover:underline group-hover:underline-offset-4">{component.name}</span>
          <span className="line-clamp-2 text-body-sm text-muted-foreground">{component.summary}</span>
        </div>
      </Card>
    </Link>
  );
}

export function ComponentsIndexPage() {
  const { search } = useLocation();
  const query = search.get('q') ?? '';
  const category = search.get('category') ?? '';

  const setParam = (key: 'q' | 'category', value: string) => {
    const params = new URLSearchParams(search);
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    navigate(`/components${qs ? `?${qs}` : ''}`, { replace: true, scroll: false });
  };

  const { kit } = useKit();
  const scoped = catalog.components.filter((c) => inKit(c, kit));
  const categories = catalog.categories.filter((cat) => scoped.some((c) => c.category === cat.id));
  const visible = scoped.filter((c) => matches(c, query) && (!category || c.category === category));
  const sections = categories
    .map((cat) => ({ ...cat, items: visible.filter((c) => c.category === cat.id) }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 py-12 sm:px-6">
      <aside className="sticky top-24 hidden h-[calc(100dvh-8rem)] w-56 shrink-0 flex-col gap-6 overflow-y-auto lg:flex" aria-label="컴포넌트 목록">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-1">
            <span className="px-2 text-caption font-semibold text-muted-foreground">{cat.label}</span>
            {scoped
              .filter((c) => c.category === cat.id)
              .map((c) => (
                <Link key={c.slug} href={`/components/${c.slug}`} className="rounded-md px-2 py-1.5 text-body-sm hover:bg-accent">
                  {c.name}
                </Link>
              ))}
          </div>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <header className="flex flex-col gap-4">
          <h1 className="text-display font-bold tracking-tight">컴포넌트</h1>
          <p className="max-w-2xl text-body text-muted-foreground">
            {site.componentsIntro}
          </p>
          <KitScopeNotice hidden={catalog.components.length - scoped.length} />
          <div className="flex flex-col gap-3 pt-2">
            <SearchInput
              aria-label="컴포넌트 검색"
              placeholder="이름이나 쓰임새로 검색 (예: 배지, 파일, 표)"
              value={query}
              onChange={(event) => setParam('q', event.target.value)}
              className="max-w-md"
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label="분류">
              <Chip selected={!category} onClick={() => setParam('category', '')}>
                전체 {scoped.length}
              </Chip>
              {categories.map((cat) => (
                <Chip key={cat.id} selected={category === cat.id} onClick={() => setParam('category', cat.id)}>
                  {cat.label} {scoped.filter((c) => c.category === cat.id).length}
                </Chip>
              ))}
            </div>
          </div>
        </header>

        {sections.length === 0 ? (
          <p className="py-16 text-center text-body text-muted-foreground">"{query}"에 맞는 컴포넌트가 없습니다.</p>
        ) : null}

        {sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-4" aria-labelledby={`cat-${section.id}`}>
            <div className="flex flex-col gap-1">
              <h2 id={`cat-${section.id}`} className="text-heading font-semibold">
                {section.label}
              </h2>
              <p className="text-body-sm text-muted-foreground">{section.description}</p>
            </div>
            <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-3')}>
              {section.items.map((component) => (
                <ComponentCard key={component.slug} component={component} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
