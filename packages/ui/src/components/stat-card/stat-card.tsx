import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card } from '../card/card';
import { cn } from '../../lib/cn';

export interface StatDelta {
  /** 부호가 붙은 변화량. 예: "+12%", "−3명". */
  value: string;
  direction: 'up' | 'down' | 'flat';
  /** 비교 기간. 예: "지난달 대비". */
  period: string;
  /**
   * 변화가 좋은지 나쁜지. 방향(up/down)과 별개다 — 이용자 수 증가는 `good`, 실패 건수 증가는 `bad`.
   * `good`/`bad`면 변화량 글자에 상태색을 입힌다. 생략하면 중립.
   */
  tone?: 'good' | 'bad' | 'neutral';
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
 * 변화 방향은 화살표 아이콘과 부호로, 좋고 나쁨은 `delta.tone`의 상태색으로 표시한다 (색만으로 전달하지 않도록 부호와 아이콘을 함께 둔다).
 */
export function StatCard({ label, value, delta, hint, className }: StatCardProps) {
  const Icon = delta ? deltaIcon[delta.direction] : null;
  return (
    <Card data-slot="stat-card" className={cn('flex flex-col gap-2', className)}>
      <span className="text-body-sm text-muted-foreground">{label}</span>
      <span className="text-title font-bold text-foreground">{value}</span>
      {delta && Icon ? (
        <span
          className={cn(
            'flex items-center gap-1 text-body-sm text-muted-foreground',
            delta.tone === 'good' && 'text-status-good-foreground',
            delta.tone === 'bad' && 'text-status-critical-foreground',
          )}
        >
          <Icon aria-hidden className="size-4" />
          <span className="text-muted-foreground">{delta.period}</span>
          <span className={cn('font-semibold', (!delta.tone || delta.tone === 'neutral') && 'text-foreground')}>
            {delta.value}
          </span>
        </span>
      ) : hint ? (
        <span className="text-body-sm text-muted-foreground">{hint}</span>
      ) : null}
    </Card>
  );
}
