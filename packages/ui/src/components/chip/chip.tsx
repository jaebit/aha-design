import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';

import { cn } from '../../lib/cn';

// 네이티브 button 속성은 모두 그대로 받는다. 아래에 다시 적은 속성은 문서(Storybook MCP)에 보이도록 한 것이다.
// docgen은 react 타입에서 온 속성을 문서에서 빼기 때문에, 자주 쓰는 속성은 여기서 직접 선언한다.
export interface ChipProps extends ComponentProps<'button'> {
  /** 칩 글자. 예: "회의록", "영어". */
  children?: ReactNode;
  /** 누르면 실행할 동작. 필터 칩이면 `selected`를 뒤집는다. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** 누를 수 없게 한다. */
  disabled?: boolean;
  /**
   * 필터처럼 켜고 끄는 칩이면 지정한다. 지정하면 `aria-pressed`가 붙고, true일 때 primary 색으로 채워진다.
   * 추천 질문처럼 누르면 바로 동작하는 칩은 생략한다.
   */
  selected?: boolean;
}

/**
 * 누를 수 있는 알약형 버튼.
 *
 * - 필터 칩 (2쪽 전체 기록의 서비스 필터): `selected` 지정.
 * - 선택지 칩 (11쪽 템플릿 선택, 13쪽 결과 언어): `selected` 지정.
 * - 추천 질문 칩 (3, 5쪽): `selected` 생략. AI 영역에서는 Suggestions를 쓴다.
 * - 관리 화면: 사용자 상태 필터(전체 · 활성 · 잠김), 2단계 인증 방법 선택.
 */
export function Chip({ className, selected, type = 'button', ...props }: ChipProps) {
  return (
    <button
      data-slot="chip"
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-body-sm transition-colors disabled:pointer-events-none disabled:opacity-40',
        selected
          ? 'border-primary bg-primary font-medium text-primary-foreground'
          : 'border-border bg-background text-foreground hover:bg-accent',
        className,
      )}
      {...props}
    />
  );
}
