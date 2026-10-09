import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

const cardVariants = cva('rounded-lg bg-card text-card-foreground', {
  variants: {
    variant: {
      /** 기본 카드. 연한 테두리. */
      default: 'border border-border',
      /** 강조 카드. 진한 테두리. 사용자가 지금 행동해야 하는 카드 (11쪽 메일 발송, 20쪽 확인할 일). */
      emphasis: 'border border-border-strong',
    },
    padding: {
      none: '',
      md: 'p-5',
      lg: 'p-6',
    },
  },
  defaultVariants: { variant: 'default', padding: 'md' },
});

export interface CardProps extends ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

/**
 * 테두리 카드. 그림자 없이 테두리로 구분한다.
 * AI 결과는 ResultCard, 서비스 바로가기는 ServiceCard를 쓰고, 그 밖의 묶음에 이 카드를 쓴다.
 */
export function Card({ className, variant, padding, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}

export { cardVariants };
