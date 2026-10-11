import type { ReactNode } from 'react';

import { cn } from '@actoz/ui';

export interface AuthLayoutProps {
  /** 화면 제목. 예: "로그인", "2단계 인증", "앱 접근 허용". */
  title: ReactNode;
  /** 제목 아래 한두 줄 안내. 예: "인증 앱에 표시된 6자리 코드를 입력하세요." */
  description?: ReactNode;
  /** 카드 위 로고 영역. 기본은 "AHA 💡". IAM은 방패 아이콘(`ShieldCheck`) + "IAM"을 넘긴다. 이미지 로고는 `alt`를 준다. */
  logo?: ReactNode;
  /** 카드 아래 보조 링크. 예: 비밀번호 찾기, 다른 방법으로 인증, 도움말. */
  footer?: ReactNode;
  /** 카드 본문. 보통 FormField와 Button으로 된 `<form>`. */
  children: ReactNode;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

/**
 * 로그인·2단계 인증·동의처럼 앱 밖에서 보이는 인증 화면의 틀.
 * 화면 가운데에 폭 400px 카드 하나를 두고, 위에 로고, 아래에 보조 링크를 둔다.
 * 화면 하나에는 주요 버튼(`variant="primary"`)을 하나만 둔다.
 */
export function AuthLayout({ title, description, logo, footer, children, className }: AuthLayoutProps) {
  return (
    <div
      data-slot="auth-layout"
      className={cn('flex min-h-dvh w-full flex-col items-center justify-center gap-6 bg-subtle px-4 py-12', className)}
    >
      <div className="flex items-center gap-2 text-heading font-semibold text-foreground">
        {logo ?? (
          <>
            AHA <span aria-hidden>💡</span>
          </>
        )}
      </div>
      <main className="w-full max-w-100 rounded-lg border border-border bg-card p-8 text-card-foreground">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-title font-semibold">{title}</h1>
          {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </main>
      {footer ? (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-body-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
