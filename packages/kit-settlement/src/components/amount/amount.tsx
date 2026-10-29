import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@actoz/ui';

const amountVariants = cva('inline-flex items-baseline gap-1.5 whitespace-nowrap', {
  variants: {
    size: {
      default: 'text-body',
      lg: 'text-title font-semibold',
    },
  },
  defaultVariants: { size: 'default' },
});

export interface AmountProps extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof amountVariants> {
  /** 통화 코드 (ISO 4217, 예: USD, KRW). 통화 기호는 쓰지 않는다. */
  currency: string;
  /** 금액 문자열. 원문 자릿수를 그대로 둔다 (예: "1,234.50"). 숫자로 바꾸지 않는다. */
  value: string;
  /** 크기. `default`(기본): 표·목록 안, `lg`: 결과 카드의 핵심 금액. */
  size?: VariantProps<typeof amountVariants>['size'];
}

/**
 * 통화 코드와 금액을 함께 보여 주는 표시. 코드는 고정폭 글꼴, 숫자는 자릿수가 맞는 숫자꼴을 쓴다.
 * 값을 모르면 0이나 빈칸 대신 UnknownValue를 쓴다.
 */
export function Amount({ className, currency, value, size, ...props }: AmountProps) {
  return (
    <span data-slot="amount" className={cn(amountVariants({ size }), className)} {...props}>
      <span className="font-mono text-muted-foreground">{currency}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  );
}
