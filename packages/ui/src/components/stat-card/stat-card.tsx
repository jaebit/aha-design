import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card } from '@/components/card/card';
import { cn } from '@/lib/cn';

export interface StatDelta {
  /** 부호가 붙은 변화량. 예: "+12%", "−3명". */
  value: string;
  direction: 'up' | 'down' | 'flat';
  /** 비교 기간. 예: "지난달 대비". */
  period: string;
}

export interface StatCardProps {
  /** 지표 이름. 문장형, 끝에 콜론 없음. 예: "요청 수". */
  label: string;
  /** 큰 값. 단위를 붙인 문자열로 넘긴다. 예: "1,284", "42명", "98.2%", "약 $12.40". */
  value: string;
  /** 지난 기간 대비 변화. */
  delta?: StatDelta;
  /** 보조 정보 한 줄. 예: "실패 3건", "토큰 1,204,000". `delta`와 함께 쓰지 않는다. */
  hint?: ReactNode;
  className?: string;
}

const deltaIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight };

/**
 * KPI 카드 (20쪽 요청 수 · 이용자 수 · 성공률 · 예상 비용). 4개를 한 줄로 놓는다.
 * 변화 방향은 화살표 아이콘과 부호로 표시한다. 좋음/나쁨 상태색은 아직 정해지지 않아 색으로 구분하지 않는다.
 */
export function StatCard({ label, value, delta, hint, className }: StatCardProps) {
  const Icon = delta ? deltaIcon[delta.direction] : null;
  return (
    <Card data-slot="stat-card" className={cn('flex flex-col gap-2', className)}>
      <span className="text-body-sm text-muted-foreground">{label}</span>
      <span className="text-title font-bold text-foreground">{value}</span>
      {delta && Icon ? (
        <span className="flex items-center gap-1 text-body-sm text-muted-foreground">
          <Icon aria-hidden className="size-4" />
          {delta.period} <span className="font-semibold text-foreground">{delta.value}</span>
        </span>
      ) : hint ? (
        <span className="text-body-sm text-muted-foreground">{hint}</span>
      ) : null}
    </Card>
  );
}
