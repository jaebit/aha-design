import type { ReactNode } from 'react';

import { Badge, type BadgeTone, cn } from '@actoz/ui';
import { Citation } from '../citation/citation';

export interface RiskItemProps {
  /** 심각도 라벨. 예: "높음", "보통", "낮음". 화면에 글자로 보인다. */
  severity: string;
  /** 심각도의 상태색. 높음 → `critical`, 보통 → `serious`, 낮음 → `warning`. 배지 앞에 상태 아이콘이 붙는다. */
  tone?: BadgeTone;
  /** 리스크 제목. 예: "손해배상 한도 없음". */
  title: string;
  /** 내용과 수정 제안. */
  children: ReactNode;
  /** 근거 조항. 예: { name: "제12조 (해지)", href: "#clause-12" }. */
  source?: { name: string; href?: string };
  className?: string;
}

/** 문서 검토 결과의 리스크 한 건 (13쪽). ResultCard의 "리스크 항목" 섹션 안에 쌓는다. */
export function RiskItem({ severity, tone, title, children, source, className }: RiskItemProps) {
  return (
    <article data-slot="risk-item" className={cn('flex flex-col gap-2 rounded-lg border border-border p-4', className)}>
      <header className="flex items-center gap-2">
        <Badge tone={tone}>
          <span className="sr-only">심각도 </span>
          {severity}
        </Badge>
        <h5 className="text-body font-semibold text-foreground">{title}</h5>
      </header>
      <div className="text-body text-foreground">{children}</div>
      {source ? <Citation variant="inline" source={source.name} href={source.href} /> : null}
    </article>
  );
}
