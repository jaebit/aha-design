import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/cn';

export interface CalloutProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** 굵은 제목 한 줄. 생략 가능. */
  title?: ReactNode;
  /** 오른쪽 버튼. 예: 담당 부서에 문의 (5쪽), 인증 앱 등록. 버튼은 `variant="secondary"`를 쓴다. */
  action?: ReactNode;
}

/**
 * 회색 안내 상자.
 *
 * - 사용 팁 (10쪽 "더 좋은 회의록을 위한 팁"), 원칙 안내 (12쪽 "문서 근거 검토"): `title` + 본문.
 * - 사람에게 넘기기·행동 유도 (5쪽 "담당 부서에 문의", MFA 미등록 안내의 "인증 앱 등록"): 본문 + `action`.
 *
 * 입력 오류나 로그인 실패처럼 상태를 알리는 문구는 Callout 대신 오류 문구(FormField `error`, 폼 위 `role="alert"`)나 tone 배지를 쓴다.
 */
export function Callout({ title, action, className, children, ...props }: CalloutProps) {
  return (
    <div
      data-slot="callout"
      className={cn('flex items-center gap-4 rounded-lg border border-border bg-subtle px-5 py-4', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? <p className="text-body-sm font-semibold text-foreground">{title}</p> : null}
        <div className="text-body-sm text-muted-foreground">{children}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
