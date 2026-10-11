import { cn } from '@actoz/ui';

export interface ThinkingIndicatorProps {
  /** 진행 상황 문구. 작업마다 구체적으로 쓴다. 예: "사내 가이드에서 찾고 있어요", "음성 원문을 만들고 있어요". */
  label?: string;
  className?: string;
}

/**
 * AI가 응답을 만드는 중임을 알리는 표시. 와이어프레임에 없어 새로 정의했다 (확인 필요).
 * 응답 본문이 스트리밍되기 시작하면 이 표시를 지운다. 스크린리더에는 `label`을 읽어준다.
 */
export function ThinkingIndicator({ label = '답변을 만들고 있어요', className }: ThinkingIndicatorProps) {
  return (
    <div
      data-slot="thinking-indicator"
      role="status"
      aria-live="polite"
      className={cn('flex items-center gap-2 text-body-sm text-muted-foreground', className)}
    >
      <span aria-hidden className="flex gap-1">
        <span className="size-1.5 animate-pulse rounded-full motion-reduce:animate-none bg-muted-foreground" />
        <span className="size-1.5 animate-pulse rounded-full motion-reduce:animate-none bg-muted-foreground [animation-delay:150ms]" />
        <span className="size-1.5 animate-pulse rounded-full motion-reduce:animate-none bg-muted-foreground [animation-delay:300ms]" />
      </span>
      <span>{label}</span>
    </div>
  );
}
