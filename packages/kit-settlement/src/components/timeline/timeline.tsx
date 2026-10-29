import type { ComponentProps } from 'react';

import { cn } from '@actoz/ui';

export type TimelineStatus = 'done' | 'current' | 'pending';

export interface TimelineStep {
  /** 단계 이름. */
  name: string;
  /** 보조 정보 (예: "2026.09.20 · 시스템 · 문서 생성은 발행이 아닙니다"). */
  meta?: string;
  /** 상태. `done`: 끝남 (채운 점), `current`: 지금 단계 (속 빈 점), `pending`: 아직 (흐림). */
  status: TimelineStatus;
}

export interface TimelineProps extends ComponentProps<'ol'> {
  /** 단계 목록. 위에서 아래로 순서대로 보인다. */
  steps: TimelineStep[];
}

const dotStyles: Record<TimelineStatus, string> = {
  done: 'border-foreground bg-foreground',
  current: 'border-primary bg-background',
  pending: 'border-border-strong bg-background',
};

/**
 * 순서 있는 단계 목록. 점 사이를 세로선으로 잇고, 지금 단계에 aria-current="step"을 단다.
 */
export function Timeline({ className, steps, ...props }: TimelineProps) {
  return (
    <ol data-slot="timeline" className={cn('flex flex-col', className)} {...props}>
      {steps.map((step, index) => (
        <li
          key={`${index}-${step.name}`}
          data-status={step.status}
          aria-current={step.status === 'current' ? 'step' : undefined}
          className="relative flex gap-3 pb-4 last:pb-0"
        >
          {index < steps.length - 1 ? <span aria-hidden className="absolute top-4 bottom-0 left-[0.4375rem] w-px bg-border" /> : null}
          <span aria-hidden className={cn('relative mt-1 size-3.5 shrink-0 rounded-full border-2', dotStyles[step.status])} />
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                'text-body',
                step.status === 'current' && 'font-semibold text-primary',
                step.status === 'done' && 'text-foreground',
                step.status === 'pending' && 'text-muted-foreground',
              )}
            >
              {step.name}
            </span>
            {step.meta ? <span className="text-caption text-muted-foreground">{step.meta}</span> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
