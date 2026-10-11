import { FileText } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@actoz/ui';

export interface CitationProps extends Omit<ComponentProps<'a'>, 'children'> {
  /** 근거 문서 이름. 예: "인사 규정 · 연차휴가 조항". 앞에 "근거:"가 자동으로 붙는다. */
  source: string;
  /**
   * - `chip`: 응답 본문 아래의 외곽선 칩 (5, 16쪽).
   * - `inline`: 카드 안의 밑줄 링크 (13쪽 리스크 항목).
   */
  variant?: 'chip' | 'inline';
  /** 근거 문서 주소. 주면 링크가 되고, 없으면 텍스트로만 표시된다. */
  href?: string;
}

/**
 * AI 답변의 근거 문서 표시.
 * AHA는 등록된 문서 안에서만 답하므로, 근거가 있는 답변에는 반드시 붙인다.
 * `href`를 주면 링크가 되고, 없으면 텍스트로만 표시된다.
 */
export function Citation({ source, variant = 'chip', href, className, ...props }: CitationProps) {
  const label = `근거: ${source}`;

  if (variant === 'inline') {
    return (
      <a
        data-slot="citation"
        href={href}
        className={cn('text-body-sm text-muted-foreground underline underline-offset-4 hover:text-foreground', className)}
        {...props}
      >
        {label}
      </a>
    );
  }

  return (
    <a
      data-slot="citation"
      href={href}
      className={cn(
        'inline-flex w-fit max-w-full items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-body-sm text-muted-foreground [&[href]]:hover:bg-accent [&[href]]:hover:text-foreground',
        className,
      )}
      {...props}
    >
      <FileText className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </a>
  );
}
