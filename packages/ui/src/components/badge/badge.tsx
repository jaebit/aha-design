import { cva, type VariantProps } from 'class-variance-authority';
import { CircleCheck, CircleX, OctagonAlert, TriangleAlert } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/cn';

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

const toneIcons = {
  good: { Icon: CircleCheck, className: 'text-status-good' },
  warning: { Icon: TriangleAlert, className: 'text-status-warning' },
  serious: { Icon: OctagonAlert, className: 'text-status-serious' },
  critical: { Icon: CircleX, className: 'text-status-critical' },
} as const;

export type BadgeTone = keyof typeof toneIcons;

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  /**
   * 상태 배지. 라벨 앞에 상태색 아이콘을 붙인다. 글자색은 바꾸지 않는다 (색만으로 상태를 전달하지 않는다).
   * - `good`: 정상, 완료 · `warning`: 주의 (예: 일부 품질 저하, 15쪽)
   * - `serious`: 심각 (예: 리스크 보통, 13쪽) · `critical`: 위험, 실패 (예: 리스크 높음, 13쪽)
   * 라벨은 상태를 글로 말해야 한다 (예: "높음", "실패").
   */
  tone?: BadgeTone;
}

/**
 * 짧은 라벨. 클릭할 수 없다 (클릭이 필요하면 Chip을 쓴다).
 *
 * - `outline`: 서비스 태그(사내 가이드 챗, ITH), 상태(일부 품질 저하), 심각도(높음/보통), 단계(1/3 음성 원문).
 * - `solid`: 개수 강조. 관리자 메뉴의 대기 건수 (20쪽).
 * - `soft`: 키워드와 제약 정보. 뉴스레터 키워드(14쪽), 파일 형식·용량 안내(10, 12쪽).
 * 상태를 나타낼 때는 `tone`을 함께 준다.
 */
export function Badge({ className, variant, size, tone, children, ...props }: BadgeProps) {
  const toneIcon = tone ? toneIcons[tone] : undefined;
  return (
    <span data-slot="badge" data-tone={tone} className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {toneIcon ? <toneIcon.Icon aria-hidden className={toneIcon.className} /> : null}
      {children}
    </span>
  );
}

export { badgeVariants };
