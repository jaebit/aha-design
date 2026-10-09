import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

/**
 * 한 줄 텍스트 입력.
 * 대화 이름 변경(8쪽)처럼 짧은 값을 받는다. 긴 글이나 AI 질문은 Composer를 쓴다.
 * 라벨이 화면에 없으면 `aria-label`을 준다.
 */
export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        'h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}
