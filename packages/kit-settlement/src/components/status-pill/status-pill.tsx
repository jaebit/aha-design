import type { ComponentProps } from 'react';

import { Badge, cn } from '@actoz/ui';

/** 정산 건 상태. 이 열 개만 쓴다. 「완료」처럼 줄여 쓰지 않는다. */
export const SETTLEMENT_STATUSES = [
  '자료 대기',
  '추정 검토',
  '추정 확정',
  '정산서 대기',
  '정산 검토',
  '검토 확정',
  '결재 종결',
  '발급',
  '송부',
  '입금 완료',
] as const;

export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

type StatusKind = 'wait' | 'review' | 'step' | 'done';

const kindOf: Record<SettlementStatus, StatusKind> = {
  '자료 대기': 'wait',
  '정산서 대기': 'wait',
  '추정 검토': 'review',
  '정산 검토': 'review',
  '추정 확정': 'step',
  '검토 확정': 'step',
  '결재 종결': 'step',
  발급: 'step',
  송부: 'step',
  '입금 완료': 'done',
};

export interface StatusPillProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** 정산 건 상태 (열 개 중 하나). 모양은 상태에서 정해지므로 따로 고르지 않는다. */
  status: SettlementStatus;
}

/**
 * 정산단위 × 정산월 한 건의 상태 배지. 대기(자료 대기, 정산서 대기)는 점선, 담당자가 확인할 차례(추정 검토, 정산 검토)는 진한 테두리,
 * 중간 단계는 회색 배경이다. 업무가 끝난 「입금 완료」만 완료 표시를 단다. 「검토 확정」은 중간 단계다.
 * 예외 수는 배지에 넣지 않고 옆 열에 ExceptionBadge로 둔다.
 */
export function StatusPill({ className, status, ...props }: StatusPillProps) {
  const kind = kindOf[status];
  return (
    <Badge
      data-slot="status-pill"
      data-kind={kind}
      variant={kind === 'step' ? 'soft' : 'outline'}
      tone={kind === 'done' ? 'good' : undefined}
      className={cn(
        kind === 'wait' && 'border-dashed bg-muted',
        kind === 'review' && 'border-primary font-semibold',
        className,
      )}
      {...props}
    >
      {status}
    </Badge>
  );
}
