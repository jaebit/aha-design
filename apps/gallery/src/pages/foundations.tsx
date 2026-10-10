import { Badge, Card, cn } from '@aha/ui';

import { type CatalogToken, tokenClass } from '../catalog-types';
import { catalog } from '../lib/catalog';
import { CopyButton } from '../site/copy-button';

const semantic = catalog.tokens.filter((t) => t.layer === 'semantic');
const byName = (name: string) => catalog.tokens.find((t) => t.name === name);
const shortName = (token: CatalogToken) => token.name.replace(/^color\./, '');

const colorGroups = [
  {
    title: '바탕과 글자',
    description: '화면 대부분은 이 색으로 만듭니다. 글자색은 어떤 바탕 위에서도 대비 4.5:1 이상입니다.',
    names: ['background', 'foreground', 'subtle', 'muted', 'muted-foreground', 'card', 'border', 'border-strong'],
  },
  {
    title: '행동',
    description: '주요 버튼은 검정(다크 모드에서는 흰색) 하나만 씁니다. 따로 브랜드 강조색을 두지 않습니다.',
    names: ['primary', 'primary-foreground', 'secondary', 'accent', 'destructive', 'ring'],
  },
];

function Swatch({ token }: { token: CatalogToken }) {
  const cls = tokenClass(token);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-20 overflow-hidden rounded-lg border border-border">
        <div className="flex-1" style={{ background: token.value }} title={`라이트 ${token.value}`} />
        <div className="flex-1" style={{ background: token.dark?.value ?? token.value }} title={`다크 ${token.dark?.value ?? token.value}`} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-body-sm font-semibold">{shortName(token)}</span>
        {cls ? <code className="font-mono text-caption text-muted-foreground">{cls.split(' / ')[0]}</code> : null}
        <span className="font-mono text-caption text-muted-foreground">
          {token.value} · {token.dark?.value ?? token.value}
        </span>
        {token.description ? <span className="text-caption text-muted-foreground">{token.description}</span> : null}
      </div>
    </div>
  );
}

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-6" aria-labelledby={`${id}-title`}>
      <div className="flex flex-col gap-2">
        <h2 id={`${id}-title`} className="text-title font-bold">
          {title}
        </h2>
        <p className="max-w-3xl text-body text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

const typeScale = ['display', 'title', 'heading', 'body', 'body-sm', 'caption'] as const;
const typeClass: Record<(typeof typeScale)[number], string> = {
  display: 'text-display',
  title: 'text-title',
  heading: 'text-heading',
  body: 'text-body',
  'body-sm': 'text-body-sm',
  caption: 'text-caption',
};
const radii = ['sm', 'md', 'lg', 'xl', 'full'] as const;
const radiusClass: Record<(typeof radii)[number], string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};
const statusIcons = { good: '완료', warning: '일부 품질 저하', serious: '보통', critical: '높음' } as const;

export function FoundationsPage() {
  const chart = semantic.filter((t) => /^color\.chart-\d$/.test(t.name));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-4">
        <h1 className="text-display font-bold tracking-tight">디자인 기초</h1>
        <p className="max-w-2xl text-body text-muted-foreground">
          색, 글자, 모서리는 모두 이름이 붙은 토큰으로 정해져 있습니다. 컴포넌트와 에이전트는 이 이름만 씁니다. 각 견본의 왼쪽은
          라이트, 오른쪽은 다크 모드 값입니다.
        </p>
        <nav aria-label="이 페이지 목차" className="flex flex-wrap gap-2 pt-2">
          {[
            ['color', '색'],
            ['status', '상태색'],
            ['chart', '차트 색'],
            ['type', '글자'],
            ['radius', '모서리'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-border px-4 py-1.5 text-body-sm hover:bg-accent">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <Section id="color" title="색" description="hex 값을 직접 쓰지 않습니다. 이름으로 쓰면 다크 모드에서 알맞은 색으로 자동으로 바뀝니다.">
        {colorGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-4">
            <div>
              <h3 className="text-heading font-semibold">{group.title}</h3>
              <p className="text-body-sm text-muted-foreground">{group.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {group.names.map((name) => {
                const token = byName(`color.${name}`);
                return token ? <Swatch key={name} token={token} /> : null;
              })}
            </div>
          </div>
        ))}
      </Section>

      <Section
        id="status"
        title="상태색"
        description="정상·주의·심각·위험 네 가지만 씁니다. 색만으로 상태를 알리지 않고, 항상 아이콘과 글(라벨)을 함께 붙입니다."
      >
        <Card className="flex flex-wrap gap-3">
          {(Object.keys(statusIcons) as (keyof typeof statusIcons)[]).map((tone) => (
            <Badge key={tone} tone={tone} size="md">
              {statusIcons[tone]}
            </Badge>
          ))}
        </Card>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {(Object.keys(statusIcons) as (keyof typeof statusIcons)[]).map((tone) => {
            const token = byName(`color.status-${tone}`);
            return token ? <Swatch key={tone} token={token} /> : null;
          })}
        </div>
      </Section>

      <Section
        id="chart"
        title="차트 색"
        description="여러 계열을 구분할 때 1번부터 순서대로 씁니다. 최대 6개이고, 색약인 사람도 구분할 수 있게 검증했습니다. 차트에는 범례와 표 보기를 함께 둡니다."
      >
        <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
          {chart.map((token) => (
            <Swatch key={token.name} token={token} />
          ))}
        </div>
      </Section>

      <Section id="type" title="글자" description="서체는 Pretendard입니다. 글자 크기는 숫자 대신 쓰임새 이름으로 고릅니다.">
        <Card padding="none" className="divide-y divide-border">
          {typeScale.map((size) => {
            const token = byName(`font.size.${size}`);
            return (
              <div key={size} className="flex flex-col gap-2 p-5 md:flex-row md:items-baseline md:gap-8">
                <div className="flex w-48 shrink-0 items-center gap-2">
                  <code className="font-mono text-body-sm font-semibold">{typeClass[size]}</code>
                  <span className="font-mono text-caption text-muted-foreground">{token?.value}</span>
                </div>
                <p className={cn(typeClass[size], size === 'display' || size === 'title' ? 'font-bold' : '')}>
                  사내 가이드에서 찾아드려요
                </p>
              </div>
            );
          })}
        </Card>
      </Section>

      <Section id="radius" title="모서리" description="모서리 둥글기는 다섯 단계만 씁니다. 큰 요소일수록 더 둥글게 합니다.">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {radii.map((r) => {
            const token = byName(`radius.${r}`);
            return (
              <div key={r} className="flex flex-col gap-2">
                <div className={cn('flex h-24 items-center justify-center border-2 border-border-strong bg-subtle', radiusClass[r])} />
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono text-body-sm font-semibold">{radiusClass[r]}</code>
                  <CopyButton value={radiusClass[r]} variant="ghost" label="" aria-label={`${radiusClass[r]} 복사`} size="icon" />
                </div>
                <span className="text-caption text-muted-foreground">
                  {token?.value} · {token?.description}
                </span>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
