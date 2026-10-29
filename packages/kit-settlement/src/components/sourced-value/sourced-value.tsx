import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@actoz/ui';

export interface SourcedValueProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 이름표 (예: "최종 로열티"). */
  label: string;
  /** 값. 금액이면 Amount, 모르는 값이면 UnknownValue를 넣는다. `value`보다 우선한다. */
  children?: ReactNode;
  /** 글자로 된 값. children이 없을 때 쓴다. */
  value?: string;
  /** 출처 (예: "정산서 C12"). 앞에 "출처: "를 자동으로 붙인다. */
  source?: string;
  /** true면 핵심 금액으로 값을 크게 보인다. */
  emphasis?: boolean;
}

/**
 * 이름표, 값, 출처를 한 묶음으로 보이는 표시. 값이 어디서 왔는지 항상 함께 적는다.
 * 값이 없으면 children에 UnknownValue를 넣는다.
 */
export function SourcedValue({ className, label, children, value, source, emphasis = false, ...props }: SourcedValueProps) {
  return (
    <div data-slot="sourced-value" className={cn('flex flex-col gap-1', className)} {...props}>
      <span className="text-body-sm text-muted-foreground">{label}</span>
      <div className={cn('tabular-nums text-foreground', emphasis ? 'text-title font-semibold' : 'text-body')}>
        {children ?? value}
      </div>
      {source ? <span className="text-caption text-muted-foreground">출처: {source}</span> : null}
    </div>
  );
}
