import { Badge, Button, Card } from '@aha/ui';
import { ArrowRight, Bot, ClipboardCopy, LayoutTemplate, MousePointerClick } from 'lucide-react';

import { catalog, storyFrameUrl } from '../lib/catalog';
import { Link } from '../lib/router';
import { StoryPreview } from '../lib/story-preview';
import { useTheme } from '../lib/theme';
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

/** 홈에 보여줄 컴포넌트 미리보기. 분류마다 대표 하나씩. */
const featured = [
  { slug: 'badge', story: 'StatusTones' },
  { slug: 'composer', story: undefined },
  { slug: 'stat-card', story: undefined },
  { slug: 'result-card', story: undefined },
];

function Showcase() {
  const { resolved } = useTheme();
  const shots = ['guide-chat', 'admin-dashboard', 'ith-report']
    .map((slug) => catalog.templates.find((t) => t.slug === slug))
    .filter((t) => t !== undefined);
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
  const componentCount = catalog.components.length;
  const templateCount = catalog.templates.length;

  return (
    <div className="flex flex-col gap-24 pb-24">
      <section className="bg-subtle">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="flex max-w-3xl flex-col gap-6">
            <Badge variant="outline" size="md" className="self-start">
              사내 AI 서비스 디자인 시스템
            </Badge>
            <h1 className="text-display font-bold tracking-tight">
              고르고, 복사하고,
              <br />
              에이전트에게 맡기세요
            </h1>
            <p className="text-heading text-muted-foreground">
              AHA의 모든 AI 서비스는 같은 버튼, 같은 입력창, 같은 색을 씁니다. 마음에 드는 화면을 고르면 에이전트가 똑같은
              디자인으로 만들어 줍니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/templates">
                  <LayoutTemplate aria-hidden />
                  화면 템플릿 보기
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
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

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6" aria-labelledby="components">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h2 id="components" className="text-title font-bold">
              컴포넌트 {componentCount}개
            </h2>
            <p className="text-body text-muted-foreground">실제로 동작하는 미리보기로 확인하세요. 화면 템플릿 {templateCount}개도 같은 부품으로 만들었습니다.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/components">
              전체 보기
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map(({ slug, story }) => {
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
              Pretendard 서체, 검정 기본색, 접근성 대비 4.5:1 이상. 다크 모드는 자동으로 따라옵니다.
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
