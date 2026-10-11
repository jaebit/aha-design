import { Badge, Button, Card } from '@aha/ui';
import { ArrowRight, ChevronRight } from 'lucide-react';

import type { CatalogKit } from '../catalog-types';
import { site } from '../../site.config';
import { catalog, registryUrl } from '../lib/catalog';
import { kitById, useKit } from '../lib/kit';
import { Link, navigate } from '../lib/router';
import { CodeBlock } from '../site/code-block';
import { ComponentCard } from './components-index';
import { NotFoundPage } from './not-found';
import { TemplateCard } from './templates';

const countsOf = (kit: CatalogKit) => ({
  components: catalog.components.filter((c) => c.kit === kit.id).length,
  templates: catalog.templates.filter((t) => t.kit === kit.id).length,
});

/** @param level 카드 제목 수준. 다른 h2 구역 안에 둘 때는 3. */
export function KitCard({ kit, level = 2 }: { kit: CatalogKit; level?: 2 | 3 }) {
  const { components, templates } = countsOf(kit);
  const Heading = level === 3 ? 'h3' : 'h2';
  return (
    <Link href={`/kits/${kit.id}`} className="group">
      <Card className="flex h-full flex-col gap-4 transition-shadow group-hover:shadow-popover">
        <div className="flex flex-wrap items-center gap-2">
          <Heading className="text-title font-bold group-hover:underline group-hover:underline-offset-4">{kit.label}</Heading>
          {kit.id === 'core' ? <Badge variant="soft">항상 함께 설치</Badge> : null}
          {kit.density === 'compact' ? <Badge variant="outline">촘촘한 밀도</Badge> : null}
        </div>
        <p className="flex-1 text-body text-muted-foreground">{kit.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-muted-foreground">
          <code className="font-mono text-foreground">{kit.package.name}</code>
          <span>컴포넌트 {components}개</span>
          {templates > 0 ? <span>화면 템플릿 {templates}개</span> : null}
        </div>
      </Card>
    </Link>
  );
}

export function KitsIndexPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="flex max-w-3xl flex-col gap-4">
        <h1 className="text-display font-bold tracking-tight">키트</h1>
        <p className="text-body text-muted-foreground">
          모든 사내 시스템은 같은 <strong className="text-foreground">공통 부품</strong>을 쓰고, 화면 종류에 맞는{' '}
          <strong className="text-foreground">키트</strong>를 하나 더 얹습니다. {site.kitsIntro} 색과 버튼 모양은 어느 키트에서나
          같습니다.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {catalog.kits.map((kit) => (
          <KitCard key={kit.id} kit={kit} />
        ))}
      </div>
    </div>
  );
}

function installCode(kit: CatalogKit) {
  const { ui, tokens } = catalog.packages;
  const base = `pnpm add ${ui.name}@^${ui.version} ${tokens.name}@^${tokens.version} lucide-react`;
  return kit.id === 'core' ? base : `${base}\npnpm add ${kit.package.name}@^${kit.package.version}`;
}

function cssCode(kit: CatalogKit) {
  const base = `@import "${catalog.packages.ui.name}/styles.css";`;
  return kit.id === 'core' ? base : `${base}\n@import "${kit.package.name}/styles.css";`;
}

export function KitDetailPage({ id }: { id: string }) {
  const kit = kitById(id);
  const { setKit } = useKit();
  if (!kit) return <NotFoundPage />;
  const components = catalog.components.filter((c) => c.kit === kit.id);
  const templates = catalog.templates.filter((t) => t.kit === kit.id);
  const showOnly = () => {
    setKit(kit.id === 'core' ? null : kit.id);
    navigate(templates.length > 0 ? '/templates' : '/components');
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-5">
        <nav aria-label="위치" className="flex items-center gap-1 text-body-sm text-muted-foreground">
          <Link href="/kits" className="hover:text-foreground">
            키트
          </Link>
          <ChevronRight aria-hidden className="size-4" />
          <span>{kit.label}</span>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-display font-bold tracking-tight">{kit.label}</h1>
          <Badge variant="soft" size="md">
            {kit.package.name} v{kit.package.version}
          </Badge>
        </div>
        <p className="max-w-3xl text-body text-muted-foreground">{kit.description}</p>
        {kit.id !== 'core' ? (
          <div>
            <Button onClick={showOnly}>
              공통 + {kit.label} 키트만 보기
              <ArrowRight aria-hidden />
            </Button>
          </div>
        ) : null}
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="install">
        <h2 id="install" className="text-title font-bold">
          설치
        </h2>
        <p className="text-body text-muted-foreground">
          프로젝트 루트의 <code className="font-mono">.npmrc</code>에 <code className="font-mono">{site.scope}:registry={registryUrl}</code>를
          두고 설치합니다. 에이전트에게 맡기면 {site.mcpName} MCP의 설치 안내를 보고 대신 합니다.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={installCode(kit)} label="터미널" />
          <CodeBlock code={cssCode(kit)} label="src/index.css" />
        </div>
        {kit.density === 'compact' ? (
          <p className="text-body-sm text-muted-foreground">
            이 키트 화면은 촘촘한 밀도가 기본입니다. <code className="font-mono">{'<html data-density="compact">'}</code>를 적어 주세요.
            간격만 줄고 글자 크기와 색은 그대로입니다.
          </p>
        ) : null}
      </section>

      {templates.length > 0 ? (
        <section className="flex flex-col gap-4" aria-labelledby="kit-templates">
          <h2 id="kit-templates" className="text-title font-bold">
            화면 템플릿 {templates.length}개
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {templates.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-4" aria-labelledby="kit-components">
        <h2 id="kit-components" className="text-title font-bold">
          컴포넌트 {components.length}개
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {components.map((component) => (
            <ComponentCard key={component.slug} component={component} />
          ))}
        </div>
      </section>
    </div>
  );
}
