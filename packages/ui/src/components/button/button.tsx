import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';

import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary: 'border border-border-strong bg-secondary text-secondary-foreground hover:bg-accent',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline underline-offset-4 hover:text-primary-hover',
        destructive: 'text-destructive hover:bg-accent',
        'destructive-solid': 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-body-sm [&_svg]:size-4',
        md: 'h-10 rounded-md px-4 text-body [&_svg]:size-4',
        lg: 'h-12 rounded-lg px-5 text-body [&_svg]:size-5',
        icon: 'size-9 rounded-md [&_svg]:size-5',
        'icon-round': 'size-10 rounded-full [&_svg]:size-5',
      },
    },
    // link는 size의 높이·좌우 여백을 지운다. size 뒤에 붙어야 하므로 compoundVariants에 둔다.
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

// 네이티브 button 속성은 모두 그대로 받는다. 아래에 다시 적은 속성은 문서(Storybook MCP)에 보이도록 한 것이다.
// docgen은 react 타입에서 온 속성을 문서에서 빼기 때문에, 자주 쓰는 속성은 여기서 직접 선언한다.
export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** 버튼 글자와 아이콘. 아이콘만 두면 `aria-label`을 준다. */
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** 누를 수 없게 한다. 흐리게 보인다. 제출 중에는 true로 두어 두 번 보내지 않게 한다. */
  disabled?: boolean;
  /** 기본 `button`. 폼 제출 버튼이면 `submit`. */
  type?: 'button' | 'submit' | 'reset';
  /** 화면에 글자가 없을 때(아이콘만 있는 `icon`, `icon-round`) 스크린리더용 이름. 필수다. 예: "대화 메뉴", "행 메뉴". */
  'aria-label'?: string;
  /** 모양. `primary`(기본, 화면당 하나), `secondary`, `ghost`, `link`, `destructive`, `destructive-solid`. 용도는 컴포넌트 설명을 본다. */
  variant?: VariantProps<typeof buttonVariants>['variant'];
  /** 크기. `sm`·`md`(기본)·`lg`, 아이콘만 있는 버튼은 `icon`·`icon-round` (`aria-label` 필수). 화면의 큰 주요 액션과 인증 화면의 주요 버튼은 `lg`. */
  size?: VariantProps<typeof buttonVariants>['size'];
  /** true면 자식 요소(예: `<a>`)에 버튼 스타일을 입힌다. 링크를 버튼처럼 보이게 할 때 쓴다. */
  asChild?: boolean;
}

/**
 * 기본 버튼.
 *
 * - `primary`: 화면의 주요 액션 하나 (보고서 조회, 메일 보내기, 로그인, 허용). 화면당 하나만 둔다.
 * - `secondary`: 외곽선 보조 액션 (담당 부서에 문의, 나중에 보내기, 복사, 거부, 취소).
 * - `ghost`: 툴바·응답 액션 바 같은 낮은 강조.
 * - `link`: 밑줄 텍스트 링크 (전체 기록 보기, 비밀번호 찾기). primary 색 글자.
 * - `destructive`: 삭제, 세션 종료처럼 되돌릴 수 없는 액션. 목록·툴바 안의 빨간 글자 버튼.
 * - `destructive-solid`: 되돌릴 수 없는 액션의 최종 확인 (확인 대화상자의 "삭제", "비활성화"). 빨간 바탕. 확인 대화상자 밖에서는 쓰지 않는다.
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
