import { Check } from 'lucide-react';

import { cn } from '@/lib/cn';

export interface StepperProps {
  /** 단계 이름. 예: ["음성 원문", "회의록", "메일 발송"] (11쪽), ["문서 읽기", "검토 결과"] (13쪽). */
  steps: string[];
  /** 현재 단계의 0부터 시작하는 번호. 앞 단계는 완료, 뒤 단계는 대기로 표시된다. `steps.length`면 모두 완료. */
  current: number;
  className?: string;
}

/**
 * 여러 단계로 진행되는 AI 작업의 진행 표시. 대화 머리말 오른쪽(ConversationHeader `trailing`)에 둔다.
 * 완료는 체크 원, 현재는 번호가 있는 외곽선 원과 굵은 이름, 대기는 흐린 번호로 표시한다.
 */
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol data-slot="stepper" aria-label="진행 단계" className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'todo';
        return (
          <li
            key={step}
            aria-current={state === 'current' ? 'step' : undefined}
            className={cn(
              'flex items-center gap-1.5 text-body-sm',
              // 단계 사이 연결선. 별도 <li>로 두면 스크린리더가 단계 수를 잘못 센다.
              index > 0 && 'before:mr-0.5 before:h-px before:w-6 before:bg-border',
              state === 'current' ? 'font-semibold text-foreground' : 'text-muted-foreground',
              state === 'done' && 'text-foreground',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full text-caption',
                state === 'done' && 'bg-primary text-primary-foreground',
                state === 'current' && 'border border-border-strong text-foreground',
                state === 'todo' && 'border border-border text-muted-foreground',
              )}
            >
              {state === 'done' ? <Check className="size-3" aria-label="완료" /> : index + 1}
            </span>
            {step}
          </li>
        );
      })}
    </ol>
  );
}
