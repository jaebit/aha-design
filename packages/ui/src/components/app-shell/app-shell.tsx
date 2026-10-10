import type { ReactNode } from 'react';

import { TooltipProvider } from '../tooltip/tooltip';
import { cn } from '../../lib/cn';

export interface AppShellProps {
  /** 왼쪽 글로벌 내비게이션. `NavRail`. */
  rail: ReactNode;
  /** 서비스 사이드바. `ServiceSidebar`. 홈·전체 기록·뉴스레터처럼 사이드바가 없는 화면은 생략한다. */
  sidebar?: ReactNode;
  /** 본문. */
  children: ReactNode;
  className?: string;
}

/**
 * AHA 모든 화면의 뼈대: 내비 레일 | 서비스 사이드바 | 본문 (3단).
 * TooltipProvider를 포함하므로 앱에서 따로 감싸지 않아도 된다.
 */
export function AppShell({ rail, sidebar, children, className }: AppShellProps) {
  return (
    <TooltipProvider>
      <div data-slot="app-shell" className={cn('flex h-dvh w-full overflow-hidden bg-background text-foreground', className)}>
        {rail}
        {sidebar}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </TooltipProvider>
  );
}
