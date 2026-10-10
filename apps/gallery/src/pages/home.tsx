import { Badge, Button, Card } from '@aha/ui';
import { ArrowRight, Bot, ClipboardCopy, LayoutTemplate, MousePointerClick } from 'lucide-react';

import { catalog, storyFrameUrl } from '../lib/catalog';
import { site } from '../../site.config';
import { Link } from '../lib/router';
import { StoryPreview } from '../lib/story-preview';
import { inKit } from '../catalog-types';
import { domainKits, kitById, useKit } from '../lib/kit';
import { useTheme } from '../lib/theme';
import { KitCard } from './kits';
import { ScaledFrame } from '../site/scaled-frame';

const steps = [
  {
    icon: <MousePointerClick aria-hidden />,
    title: '고르기',
    body: '화면 템플릿이나 컴포넌트를 둘러보고 만들고 싶은 것과 가장 비슷한 것을 고릅니다.',
  },
  {
    icon: <ClipboardCopy aria-hidden />,
    title: '프롬프트 복사',
    body: '각 페이지의 "에이전트용 프롬프트 복사"를 누르면 필요한 코드와 규칙이 담긴 요청문이 복사됩니다.',
  },
  {
    icon: <Bot aria-hidden />,
    title: '에이전트에게 맡기기',
    body: 'Claude Code, Cursor 같은 에이전트에 붙여넣고 원하는 내용만 적으면 같은 디자인으로 만들어 줍니다.',
  },
];

/** 홈에 보여줄 컴포넌트 미리보기와, 키트를 고르지 않았을 때 보여줄 대표 템플릿 (site.config). */
const featured = site.featuredComponents;
const defaultShots = site.featuredTemplates;

function Showcase() {
  const { resolved } = useTheme();
  const { kit } = useKit();
  // 키트를 고르면 그 키트의 템플릿을 먼저 보여준다.
  const shots = (
    kit
      ? [...catalog.templates.filter((t) => t.kit === kit), ...catalog.templates.filter((t) => t.kit !== kit && inKit(t, kit))]
      : defaultShots.map((slug) => catalog.templates.find((t) => t.slug === slug))
  )
    .filter((t) => t !== undefined)
    .slice(0, 3);
  const [main, ...rest] = shots;
  if (!main) return null;
  const storyId = (t: (typeof shots)[number]) =>
    (t.stories.find((s) => s.name === 'Conversation') ?? t.stories[0])?.storyId ?? '';

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Link href={`/templates/${main.slug}`} className="group lg:col-span-2 lg:row-span-2" aria-label={`${main.label} 템플릿 보기`}>
        <Card padding="none" className="overflow-hidden transition-shadow group-hover:shadow-popover">
          <ScaledFrame src={storyFrameUrl(storyId(main), resolved)} title={`${main.label} 미리보기`} />
        </Card>
      </Link>
      {rest.map((t) => (
        <Link key={t.slug} href={`/templates/${t.slug}`} className="group" aria-label={`${t.label} 템플릿 보기`}>
          <Card padding="none" className="overflow-hidden transition-shadow group-hover:shadow-popover">
            <ScaledFrame src={storyFrameUrl(storyId(t), resolved)} title={`${t.label} 미리보기`} />
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function HomePage() {
  const { kit } = useKit();
  const current = kitById(kit);
  const componentCount = catalog.components.filter((c) => inKit(c, kit)).length;
  const templateCount = catalog.templates.filter((t) => inKit(t, kit)).length;
  // 키트를 고르면 그 키트의 부품을, 아니면 분류별 대표 부품을 보여준다.
  const shown = kit
    ? catalog.components
        .filter((c) => c.kit === kit)
        .slice(0, 4)
        .map((c) => ({ slug: c.slug, story: undefined as string | undefined }))
    : featured;

  return (
    <div className="flex flex-col gap-24 pb-24">
      <section className="bg-subtle">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="flex max-w-3xl flex-col gap-6">
            <Badge variant="outline" size="md" className="self-start">
              {current ? `사내 디자인 시스템 · ${current.label} 키트` : '사내 디자인 시스템'}
            </Badge>
            <h1 className="text-display font-bold tracking-tight">
              고르고, 복사하고,
              <br />
              에이전트에게 맡기세요
            </h1>
            <p className="text-heading text-muted-foreground">
              {site.homeIntro}
            </p>
            <div className="flex flex-wrap gap-3">
              {catalog.templates.length > 0 ? (
                <Button size="lg" asChild>
                  <Link href="/templates">
                    <LayoutTemplate aria-hidden />
                    화면 템플릿 보기
                  </Link>
                </Button>
              ) : null}
              <Button size="lg" variant={catalog.templates.length > 0 ? 'secondary' : 'primary'} asChild>
                <Link href="/components">
                  컴포넌트 둘러보기
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
          <Showcase />
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6" aria-labelledby="how">
        <div className="flex flex-col gap-3">
          <h2 id="how" className="text-title font-bold">
            코드를 몰라도 3단계면 됩니다
          </h2>
          <p className="text-body text-muted-foreground">
            디자인을 새로 그리지 않습니다. 이미 검증된 화면을 골라 에이전트에게 맡기면, 버튼 모양부터 다크 모드까지 그대로 따라옵니다.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title}>
              <Card className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground [&_svg]:size-5">
                    {step.icon}
                  </span>
                  <span className="text-caption font-semibold text-muted-foreground">{i + 1}단계</span>
                </div>
                <h3 className="text-heading font-semibold">{step.title}</h3>
                <p className="text-body-sm text-muted-foreground">{step.body}</p>
              </Card>
            </li>
          ))}
        </ol>
        <div>
          <Button variant="secondary" asChild>
            <Link href="/start">
              에이전트 연결 방법 보기
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      {domainKits.length > 0 ? (
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6" aria-labelledby="kits">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h2 id="kits" className="text-title font-bold">
              어떤 화면을 만드나요?
            </h2>
            <p className="text-body text-muted-foreground">
              화면 종류에 맞는 키트를 고르면 그 키트의 부품과 템플릿만 모아 볼 수 있습니다. 공통 부품은 어느 키트에나 들어 있습니다.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/kits">
              키트 소개
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {domainKits.map((kit) => (
            <KitCard key={kit.id} kit={kit} level={3} />
          ))}
        </div>
      </section>
      ) : null}

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6" aria-labelledby="components">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h2 id="components" className="text-title font-bold">
              {current ? `공통 + ${current.label} 컴포넌트 ${componentCount}개` : `컴포넌트 ${componentCount}개`}
            </h2>
            <p className="text-body text-muted-foreground">
              실제로 동작하는 미리보기로 확인하세요.{templateCount > 0 ? ` 화면 템플릿 ${templateCount}개도 같은 부품으로 만들었습니다.` : ''}
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/components">
              전체 보기
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map(({ slug, story }) => {
            const component = catalog.components.find((c) => c.slug === slug);
            if (!component) return null;
            const s = component.stories.find((x) => x.exportName === story) ?? component.stories[0];
            if (!s) return null;
            return (
              <Link key={slug} href={`/components/${slug}`} className="group">
                <Card padding="none" className="flex h-full flex-col overflow-hidden transition-shadow group-hover:shadow-popover">
                  <div className="flex min-h-56 flex-1 items-center justify-center bg-subtle p-6" inert>
                    <div className="w-full max-w-md">
                      <StoryPreview storyFile={component.storyFile} exportName={s.exportName} storyId={s.storyId} title={component.name} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-border p-5">
                    <span className="text-body font-semibold">{component.name}</span>
                    <span className="text-body-sm text-muted-foreground">{component.summary}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <Card padding="lg" className="flex flex-col items-start gap-6 bg-subtle md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-title font-bold">색, 글자, 다크 모드까지 정해져 있습니다</h2>
            <p className="text-body text-muted-foreground">
              {site.foundationsSummary}
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/foundations">
              디자인 기초 보기
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
