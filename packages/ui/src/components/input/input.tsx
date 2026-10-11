import type { ChangeEventHandler, ComponentProps } from 'react';

import { cn } from '../../lib/cn';

// 네이티브 input 속성은 모두 그대로 받는다. 아래에 다시 적은 속성은 문서(Storybook MCP)에 보이도록 한 것이다.
// docgen은 react 타입에서 온 속성을 문서에서 빼기 때문에, 자주 쓰는 속성은 여기서 직접 선언한다.
export interface InputProps extends ComponentProps<'input'> {
  /**
   * 입력 종류. 기본 `text`.
   * 날짜는 `date`(15쪽 시작일·종료일), 로그인은 `email`·`password`를 쓴다.
   * 검색은 SearchInput, 여러 줄은 Textarea, AI 질문은 AI 키트의 Composer를 쓴다.
   */
  type?: 'text' | 'email' | 'number' | 'date' | 'password' | 'tel' | 'url' | (string & {});
  /** 제어 모드 값. `onChange`와 함께 쓴다. */
  value?: string | number;
  /** 비제어 모드 초깃값. */
  defaultValue?: string | number;
  /** 값이 바뀔 때. 새 값은 `event.target.value`. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** 입력 전 안내 문구. 라벨을 대신하지 않는다. */
  placeholder?: string;
  /** 화면에 라벨이 없을 때 스크린리더용 이름. 라벨이 있으면 FormField나 FilterField로 감싼다. */
  'aria-label'?: string;
  /** 값이 잘못됐으면 true. 테두리가 destructive 색으로 바뀐다. 오류 문구는 따로 보여준다. */
  'aria-invalid'?: boolean;
  /** 브라우저 자동 완성 힌트. 로그인은 `username`·`current-password`, 비밀번호 변경은 `new-password`. */
  autoComplete?: string;
  disabled?: boolean;
  /** 높이·너비 조정용. 예: 필터 바에서는 `h-12 w-44`. 색상 클래스는 넣지 않는다. */
  className?: string;
}

/**
 * 한 줄 텍스트 입력.
 * 대화 이름 변경(8쪽), 필터 바의 날짜(15쪽), 이메일·비밀번호처럼 짧은 값을 받는다. 여러 줄은 Textarea, AI 질문은 Composer를 쓴다.
 * 라벨이 화면에 없으면 `aria-label`을 준다.
 */
export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        'h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}
