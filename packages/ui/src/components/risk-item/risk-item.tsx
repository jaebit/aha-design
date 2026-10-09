import type { ReactNode } from 'react';

import { Badge } from '@/components/badge/badge';
import { Citation } from '@/components/citation/citation';
import { cn } from '@/lib/cn';

export interface RiskItemProps {
  /** 심각도 라벨. 예: "높음", "보통", "낮음". 상태색은 아직 정해지지 않아 외곽선 배지로 표시한다. */
  severity: string;
  title: string;
  /** 내용과 수정 제안. */
  children: ReactNode;
  /** 근거 조항. 예: { name: "제12조 (해지)", href: "#clause-12" }. */
  source?: { name: string; href?: string };
  className?: string;
}

/** 문서 검토 결과의 리스크 한 건 (13쪽). ResultCard의 "리스크 항목" 섹션 안에 쌓는다. */
export function RiskItem({ severity, title, children, source, className }: RiskItemProps) {
  return (
    <article data-slot="risk-item" className={cn('flex flex-col gap-2 rounded-lg border border-border p-4', className)}>
      <header className="flex items-center gap-2">
        <Badge aria-label={`심각도 ${severity}`}>{severity}</Badge>
        <h5 className="text-body font-semibold text-foreground">{title}</h5>
      </header>
      <div className="text-body text-foreground">{children}</div>
      {source ? <Citation variant="inline" source={source.name} href={source.href} /> : null}
    </article>
  );
}
