import {
  Badge,
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@aha/ui';
import { BookOpen, Menu, Monitor, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';

import { catalog } from '../lib/catalog';
import { Link, navigate, useLocation } from '../lib/router';
import { type ThemeChoice, useTheme } from '../lib/theme';

const nav = [
  { href: '/start', label: '시작하기' },
  { href: '/components', label: '컴포넌트' },
  { href: '/templates', label: '화면 템플릿' },
  { href: '/foundations', label: '디자인 기초' },
];

const themeOptions: { value: ThemeChoice; label: string; icon: ReactNode }[] = [
  { value: 'system', label: '시스템 설정', icon: <Monitor aria-hidden /> },
  { value: 'light', label: '라이트', icon: <Sun aria-hidden /> },
  { value: 'dark', label: '다크', icon: <Moon aria-hidden /> },
];

function ThemeMenu() {
  const { choice, resolved, setChoice } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="테마 바꾸기">
          {resolved === 'dark' ? <Moon aria-hidden /> : <Sun aria-hidden />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>테마</DropdownMenuLabel>
        {themeOptions.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => setChoice(option.value)} aria-current={choice === option.value}>
            {option.icon}
            {option.label}
            {choice === option.value ? <span className="ml-auto text-caption text-muted-foreground">사용 중</span> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="메뉴" className="md:hidden">
          <Menu aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {nav.map((item) => (
          <DropdownMenuItem key={item.href} onSelect={() => navigate(item.href)}>
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onSelect={() => window.open('/storybook/', '_blank')}>Storybook (개발자용)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SiteHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-body">
          <span aria-hidden>💡</span>
          AHA 디자인
          <Badge variant="soft">v{catalog.packages.ui.version}</Badge>
        </Link>
        <nav aria-label="주요 메뉴" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-body-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                  active && 'font-semibold text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <a href="/storybook/" target="_blank" rel="noreferrer">
              <BookOpen aria-hidden />
              Storybook
            </a>
          </Button>
          <ThemeMenu />
          <MobileMenu />
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/start">에이전트 연결</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-body-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span aria-hidden>💡 </span>AHA 사내 디자인 시스템 · {catalog.packages.ui.name} v{catalog.packages.ui.version}
        </p>
        <nav aria-label="바닥글" className="flex flex-wrap gap-4">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <a href="/storybook/" className="hover:text-foreground">
            Storybook
          </a>
          <a href="http://localhost:3000/jay/design-hub" className="hover:text-foreground">
            저장소
          </a>
        </nav>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        본문으로 건너뛰기
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
