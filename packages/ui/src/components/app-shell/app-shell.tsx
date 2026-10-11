import type { ReactNode } from 'react';

import { TooltipProvider } from '../tooltip/tooltip';
import { cn } from '../../lib/cn';

export interface AppShellProps {
  /** 왼쪽 글로벌 내비게이션. `NavRail`. */
  rail: ReactNode;
  /**
   * 레일 오른쪽의 보조 내비게이션. AHA는 서비스 사이드바(`ServiceSidebar`), IAM은 관리 콘솔 하위 메뉴·계정 설정 메뉴.
   * 홈·전체 기록·뉴스레터처럼 사이드바가 없는 화면은 생략한다.
   */
  sidebar?: ReactNode;
  /** 본문. */
  children: ReactNode;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

/**
 * 로그인 이후 화면의 뼈대: 내비 레일 | 보조 내비게이션(서비스 사이드바) | 본문 (3단).
 * 로그인·MFA·동의처럼 인증 전 화면에는 쓰지 않는다.
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
