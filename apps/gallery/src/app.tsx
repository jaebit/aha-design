import { TooltipProvider } from '@aha/ui';
import { useEffect } from 'react';

import { useLocation } from './lib/router';
import { KitProvider } from './lib/kit';
import { ThemeProvider } from './lib/theme';
import { ComponentDetailPage } from './pages/component-detail';
import { ComponentsIndexPage } from './pages/components-index';
import { FoundationsPage } from './pages/foundations';
import { HomePage } from './pages/home';
import { KitDetailPage, KitsIndexPage } from './pages/kits';
import { NotFoundPage } from './pages/not-found';
import { StartPage } from './pages/start';
import { TemplateDetailPage, TemplatesIndexPage } from './pages/templates';
import { SiteLayout } from './site/layout';
import { catalog } from './lib/catalog';
import { site } from '../site.config';

function route(pathname: string) {
  const path = pathname.replace(/\/$/, '') || '/';
  const [, section, slug] = path.split('/');
  if (path === '/') return { page: <HomePage />, title: '' };
  if (section === 'start' && !slug) return { page: <StartPage />, title: '시작하기' };
  if (section === 'kits') {
    if (!slug) return { page: <KitsIndexPage />, title: '키트' };
    const label = catalog.kits.find((k) => k.id === slug)?.label;
    return { page: <KitDetailPage key={slug} id={slug} />, title: label ? `${label} 키트` : '' };
  }
  if (section === 'foundations' && !slug) return { page: <FoundationsPage />, title: '디자인 기초' };
  if (section === 'components') {
    if (!slug) return { page: <ComponentsIndexPage />, title: '컴포넌트' };
    const name = catalog.components.find((c) => c.slug === slug)?.name;
    return { page: <ComponentDetailPage key={slug} slug={slug} />, title: name ?? '' };
  }
  if (section === 'templates') {
    if (!slug) return { page: <TemplatesIndexPage />, title: '화면 템플릿' };
    const label = catalog.templates.find((t) => t.slug === slug)?.label;
    return { page: <TemplateDetailPage key={slug} slug={slug} />, title: label ?? '' };
  }
  return { page: <NotFoundPage />, title: '페이지 없음' };
}

export function App() {
  const { pathname } = useLocation();
  const { page, title } = route(pathname);
  useEffect(() => {
    document.title = title ? `${title} · ${site.title}` : site.title;
  }, [title]);

  return (
    <ThemeProvider>
      <KitProvider>
        <TooltipProvider>
          <SiteLayout>{page}</SiteLayout>
        </TooltipProvider>
      </KitProvider>
    </ThemeProvider>
  );
}
