import type { ComponentProps } from 'react';

import { cn } from '../../lib/cn';

export interface ChipProps extends ComponentProps<'button'> {
  /**
   * 필터처럼 켜고 끄는 칩이면 지정한다. 지정하면 `aria-pressed`가 붙고, true일 때 검정으로 채워진다.
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
