import type { ChangeEventHandler, ComponentProps } from 'react';

import { cn } from '../../lib/cn';

// 네이티브 textarea 속성은 모두 그대로 받는다. 자주 쓰는 속성은 문서(Storybook MCP)에 보이도록 다시 선언한다.
export interface TextareaProps extends ComponentProps<'textarea'> {
  /** 제어 모드 값. `onChange`와 함께 쓴다. */
  value?: string;
  /** 비제어 모드 초깃값. */
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  /** 입력 전 안내 문구. 라벨을 대신하지 않는다. */
  placeholder?: string;
  /** 보이는 줄 수. 기본 4. 내용이 길어지면 스크롤된다. */
  rows?: number;
  /** 최대 글자 수. */
  maxLength?: number;
  /** 화면에 라벨이 없을 때 스크린리더용 이름. */
  'aria-label'?: string;
  /** 값이 잘못됐으면 true. 테두리가 destructive 색으로 바뀐다. */
  'aria-invalid'?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * 여러 줄 텍스트 입력. 설명, 메모, 사유처럼 긴 값을 받는 폼 항목에 쓴다.
 * AI에게 묻는 입력창은 AI 키트의 Composer를 쓴다.
 */
export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(
        'w-full min-w-0 resize-y rounded-md border border-input bg-background px-3 py-2 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}
