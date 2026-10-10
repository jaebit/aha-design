import type { ComponentProps, ReactNode } from 'react';

import { Badge, cn } from '@aha/ui';

export interface MessageProps extends ComponentProps<'div'> {
  /** 보낸 쪽. `user`는 오른쪽 회색 말풍선, `assistant`는 왼쪽 정렬 본문. */
  from: 'user' | 'assistant';
  /** AI 이름. `assistant`에서만 쓴다. */
  name?: string;
  /** AI 아이콘. `assistant`에서만 쓴다. 기본은 AHA 전구. */
  avatar?: ReactNode;
  /** 여러 단계로 진행되는 작업의 현재 단계. 예: "1/3 음성 원문" (11쪽), "2/2 검토 결과" (13쪽). */
  step?: string;
}

/**
 * 대화 메시지 한 개 (5쪽).
 *
 * AI 응답 아래에 붙는 요소는 이 순서로 `children`에 넣는다:
 * 본문(`MessageContent`) → 근거(`Citation`) → 담당 부서 연결(`Callout`) → 액션 바(`MessageActions`) → 후속 질문(`Suggestions`).
 */
export function Message({ from, name = 'AHA', avatar, step, className, children, ...props }: MessageProps) {
  if (from === 'user') {
    return (
      <div data-slot="message" data-from="user" className={cn('flex flex-col items-end gap-2', className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div data-slot="message" data-from="assistant" className={cn('flex flex-col gap-3', className)} {...props}>
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-body">
          {avatar ?? '💡'}
        </span>
        <span className="text-body-sm font-semibold text-foreground">{name}</span>
        {step ? <Badge>{step}</Badge> : null}
      </div>
      {children}
    </div>
  );
}

/**
 * 메시지 본문.
 * 사용자 메시지에서는 말풍선이 되고, AI 메시지에서는 문단·목록 스타일을 입힌다.
 * 마크다운은 앱에서 HTML로 렌더링한 결과를 children으로 넘긴다.
 */
export function MessageContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        'text-body text-foreground',
        'in-data-[from=user]:max-w-[80%] in-data-[from=user]:whitespace-pre-wrap in-data-[from=user]:rounded-xl in-data-[from=user]:bg-muted in-data-[from=user]:px-4 in-data-[from=user]:py-2.5',
        'in-data-[from=assistant]:flex in-data-[from=assistant]:flex-col in-data-[from=assistant]:gap-2',
        '[&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6',
        className,
      )}
      {...props}
    />
  );
}
