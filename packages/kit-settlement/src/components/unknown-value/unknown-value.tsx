import type { ComponentProps } from 'react';

import { cn } from '@actoz/ui';

export type UnknownValueKind = 'unknown' | 'undecided';

const kindLabels: Record<UnknownValueKind, string> = {
  unknown: '미확인',
  undecided: '미확정',
};

export interface UnknownValueProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** 종류. `unknown`: 아직 확인하지 못한 값 (「미확인」), `undecided`: 정책이나 답이 정해지지 않은 값 (「미확정」). */
  kind: UnknownValueKind;
  /** 미확정일 때 근거가 되는 질문 ID (예: "Q-01", "완전일치 적용 · Q-02"). */
  reference?: string;
}

/**
 * 값을 모를 때 0이나 빈칸 대신 쓰는 표시. 점선 테두리와 주의 색 글자로 확정된 값과 구분한다.
 * 미확정이면 reference로 질문 ID를 함께 보인다.
 */
export function UnknownValue({ className, kind, reference, ...props }: UnknownValueProps) {
  return (
    <span
      data-slot="unknown-value"
      data-kind={kind}
      className={cn(
        'inline-flex items-baseline gap-1.5 whitespace-nowrap rounded-sm border border-dashed border-status-warning px-1.5 text-body-sm text-status-warning-foreground',
        className,
      )}
      {...props}
    >
      <span>{kindLabels[kind]}</span>
      {kind === 'undecided' && reference ? <span className="font-mono text-caption">{reference}</span> : null}
    </span>
  );
}
