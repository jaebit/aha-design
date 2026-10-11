import {
  Badge,
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@actoz/ui';
import { BookOpen, Boxes, ChevronDown, Menu, Monitor, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';

import { site } from '../../site.config';
import { catalog } from '../lib/catalog';
import { domainKits, kitById, useKit } from '../lib/kit';
import { Link, navigate, useLocation } from '../lib/router';
import { type ThemeChoice, useTheme } from '../lib/theme';
import { SiteLogo } from './logo';

// 도메인 키트나 템플릿이 없는 디자인 시스템이면 그 메뉴를 감춘다.
const nav = [
  { href: '/start', label: '시작하기' },
  ...(domainKits.length > 0 ? [{ href: '/kits', label: '키트' }] : []),
  { href: '/components', label: '컴포넌트' },
  ...(catalog.templates.length > 0 ? [{ href: '/templates', label: '화면 템플릿' }] : []),
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

/** 키트 고르기. 컴포넌트·템플릿 목록을 "공통 + 고른 키트"로 좁힌다. */
function KitMenu() {
  const { kit, setKit } = useKit();
  const current = kitById(kit);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" aria-label={`키트 고르기. 지금 ${current ? current.label : '전체'}`}>
          <Boxes aria-hidden />
          <span className="max-w-28 truncate">{current ? current.label : '전체 키트'}</span>
          <ChevronDown aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <span className="block text-body-sm font-semibold">어떤 화면을 만드나요?</span>
          <span className="block text-caption text-muted-foreground">공통 부품과 고른 키트만 보여줘요.</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setKit(null)} aria-current={!current}>
          전체 키트
          {!current ? <span className="ml-auto text-caption text-muted-foreground">보는 중</span> : null}
        </DropdownMenuItem>
        {domainKits.map((k) => (
          <DropdownMenuItem key={k.id} onSelect={() => setKit(k.id)} aria-current={kit === k.id}>
            {k.label}
            {kit === k.id ? <span className="ml-auto text-caption text-muted-foreground">보는 중</span> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/kits')}>키트 소개 보기</DropdownMenuItem>
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
          <SiteLogo />
          {site.title}
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
          {domainKits.length > 0 ? <KitMenu /> : null}
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
          <SiteLogo className="mr-1 inline align-[-0.2em]" />
          {site.fullName} · {catalog.packages.ui.name} v{catalog.packages.ui.version}
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
          <a href={site.repoUrl} className="hover:text-foreground">
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
