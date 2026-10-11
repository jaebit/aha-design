import { Check, Copy, ThumbsDown, ThumbsUp } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from '@actoz/ui';

export type MessageFeedback = 'up' | 'down' | null;

export interface MessageActionsProps {
  /** 복사 버튼을 누르면 호출된다. 생략하면 복사 버튼을 숨긴다. 실패하면 오류를 던지거나 reject한다 ("복사됨"을 띄우지 않는다). */
  onCopy?: () => void | Promise<void>;
  /** 현재 피드백. 같은 버튼을 다시 누르면 `null`로 취소된다. */
  feedback?: MessageFeedback;
  /** 피드백 변경. 생략하면 좋아요·싫어요 버튼을 숨긴다. '도움이 안 됐어요'는 관리자 화면에 집계된다 (20쪽). */
  onFeedbackChange?: (feedback: MessageFeedback) => void;
  className?: string;
}

/** AI 응답 아래 액션 바: 복사, 좋아요, 싫어요 (5쪽). AHA 화면에서는 TooltipProvider 안에서 쓴다. */
export function MessageActions({ onCopy, feedback = null, onFeedbackChange, className }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const toggle = (value: Exclude<MessageFeedback, null>) => onFeedbackChange?.(feedback === value ? null : value);

  return (
    <div data-slot="message-actions" className={cn('flex items-center gap-1', className)}>
      {onCopy ? (
        <ActionButton
          label={copied ? '복사됨' : '복사'}
          onClick={async () => {
            try {
              await onCopy();
              setCopied(true);
            } catch (error) {
              console.error('복사하지 못했습니다', error);
            }
          }}
        >
          {copied ? <Check /> : <Copy />}
        </ActionButton>
      ) : null}
      {onFeedbackChange ? (
        <>
          <ActionButton label="도움이 됐어요" pressed={feedback === 'up'} onClick={() => toggle('up')}>
            <ThumbsUp className={cn(feedback === 'up' && 'fill-current')} />
          </ActionButton>
          <ActionButton label="도움이 안 됐어요" pressed={feedback === 'down'} onClick={() => toggle('down')}>
            <ThumbsDown className={cn(feedback === 'down' && 'fill-current')} />
          </ActionButton>
        </>
      ) : null}
    </div>
  );
}

function ActionButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          aria-pressed={pressed}
          onClick={onClick}
          className="size-8 text-muted-foreground hover:text-foreground aria-pressed:text-foreground [&_svg]:size-4"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
