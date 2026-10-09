import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary: 'border border-border-strong bg-secondary text-secondary-foreground hover:bg-accent',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'h-auto px-0 text-foreground underline underline-offset-4 hover:text-muted-foreground',
        destructive: 'text-destructive hover:bg-accent',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-body-sm [&_svg]:size-4',
        md: 'h-10 rounded-md px-4 text-body [&_svg]:size-4',
        lg: 'h-12 rounded-lg px-5 text-body [&_svg]:size-5',
        icon: 'size-9 rounded-md [&_svg]:size-5',
        'icon-round': 'size-10 rounded-full [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** true면 자식 요소(예: `<a>`)에 버튼 스타일을 입힌다. 링크를 버튼처럼 보이게 할 때 쓴다. */
  asChild?: boolean;
}

/**
 * AHA 기본 버튼.
 *
 * - `primary`: 화면의 주요 액션 하나 (보고서 조회, 메일 보내기). 화면당 하나만 둔다.
 * - `secondary`: 외곽선 보조 액션 (담당 부서에 문의, 나중에 보내기, 복사).
 * - `ghost`: 툴바·응답 액션 바 같은 낮은 강조.
 * - `link`: 밑줄 텍스트 링크 (전체 기록 보기).
 * - `destructive`: 삭제처럼 되돌릴 수 없는 액션.
 *
 * 아이콘만 있는 버튼(`icon`, `icon-round`)에는 반드시 `aria-label`을 준다.
 */
export function Button({ className, variant, size, asChild = false, type = 'button', ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...(asChild ? {} : { type })}
      {...props}
    />
  );
}

export { buttonVariants };
