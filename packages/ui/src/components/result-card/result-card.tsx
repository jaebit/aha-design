import type { ComponentProps, ReactNode } from 'react';

import { Card } from '@/components/card/card';
import { cn } from '@/lib/cn';

export interface ResultCardProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** 결과 제목. 예: "[주간 회의] 회의록". 생략 가능. */
  title?: ReactNode;
  /** 제목 아래 보조 정보. 예: "2026-10-08 · 참석자 5명". */
  meta?: ReactNode;
  /** 하단 버튼 줄. 예: 복사, 다운로드, 다시 만들기. 버튼은 `variant="secondary"` `size="sm"`을 쓴다. */
  actions?: ReactNode;
}

/**
 * AI가 만든 구조화된 결과물 (11쪽 회의록, 13쪽 검토 결과).
 * 본문은 `ResultSection`으로 나눈다. 대화 응답(Message) 안에 넣는다.
 */
export function ResultCard({ title, meta, actions, className, children, ...props }: ResultCardProps) {
  return (
    <Card data-slot="result-card" padding="none" className={cn('flex flex-col', className)} {...props}>
      <div className="flex flex-col gap-5 p-5">
        {title || meta ? (
          <div className="flex flex-col gap-1">
            {title ? <h3 className="text-heading font-semibold">{title}</h3> : null}
            {meta ? <p className="text-body-sm text-muted-foreground">{meta}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">{actions}</div> : null}
    </Card>
  );
}

export interface ResultSectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  /** 소제목. 예: "논의 내용", "결정 사항", "리스크 항목". */
  title: string;
}

/** 결과 카드 안의 소제목 + 내용 묶음. */
export function ResultSection({ title, className, children, ...props }: ResultSectionProps) {
  return (
    <section data-slot="result-section" className={cn('flex flex-col gap-2', className)} {...props}>
      <h4 className="text-body font-semibold text-foreground">{title}</h4>
      <div className="flex flex-col gap-2 text-body text-foreground [&_li]:my-0.5 [&_ul]:list-disc [&_ul]:pl-6">{children}</div>
    </section>
  );
}
