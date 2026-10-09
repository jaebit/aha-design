import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full font-medium [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        outline: 'border border-border-strong bg-background text-foreground',
        solid: 'bg-primary text-primary-foreground',
        soft: 'bg-muted text-muted-foreground',
      },
      size: {
        sm: 'h-6 px-2.5 text-caption',
        md: 'h-7 px-3 text-body-sm',
      },
    },
    defaultVariants: { variant: 'outline', size: 'sm' },
  },
);

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

/**
 * 짧은 라벨. 클릭할 수 없다 (클릭이 필요하면 Chip을 쓴다).
 *
 * - `outline`: 서비스 태그(사내 가이드 챗, ITH), 상태(일부 품질 저하), 심각도(높음/보통), 단계(1/3 음성 원문).
 * - `solid`: 개수 강조. 관리자 메뉴의 대기 건수 (20쪽).
 * - `soft`: 키워드와 제약 정보. 뉴스레터 키워드(14쪽), 파일 형식·용량 안내(10, 12쪽).
 */
export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { badgeVariants };
