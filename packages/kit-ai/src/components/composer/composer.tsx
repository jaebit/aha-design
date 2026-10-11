import { cva } from 'class-variance-authority';
import { ArrowUp, Paperclip, Plus } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, type ReactNode, useId, useState } from 'react';

import { Button, cn } from '@aha/ui';

// 입력칸은 테두리 상자 안에 있어 자기 외곽선을 끄고, 상자 전체에 포커스 링을 그린다.
const composerVariants = cva(
  'w-full rounded-xl border border-border-strong bg-background has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:outline-offset-2 has-[textarea:focus-visible]:outline-ring',
  {
  variants: {
    variant: {
      hero: 'flex flex-col gap-3 p-4',
      docked: 'flex items-end gap-2 p-2',
      compact: 'flex items-end gap-2 p-2',
    },
  },
});

export interface ComposerProps {
  /**
   * - `hero`: 빈 상태 화면 가운데의 큰 입력창 (3, 10, 12쪽). 입력 영역 아래에 첨부·전송 버튼이 있다.
   * - `docked`: 대화 화면 하단에 고정된 한 줄 입력창 (5, 15쪽).
   * - `compact`: 우측 대화 패널용 입력창 (16쪽). 첨부 버튼을 두지 않는다.
   */
  variant?: 'hero' | 'docked' | 'compact';
  /** 제어 모드 값. 생략하면 내부 상태를 쓴다. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 보내기(Enter 또는 전송 버튼). 앞뒤 공백을 제거한 텍스트를 넘긴다. 성공하면 입력이 비워진다. */
  onSubmit?: (text: string) => void;
  placeholder?: string;
  /** 첨부 버튼 클릭. 생략하면 첨부 버튼을 표시하지 않는다. */
  onAttach?: () => void;
  /** 지정하면 `+` 아이콘 대신 라벨이 있는 첨부 버튼을 표시한다. 예: "녹음 파일 첨부", "문서 첨부" */
  attachLabel?: string;
  /** 입력창 아래 안내 문구. 예: "등록된 사내 가이드 안에서만 답해요." */
  helper?: ReactNode;
  /** AI가 응답을 만드는 중이면 true. 전송을 막는다. */
  busy?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * AHA의 AI 대화 입력창. 모든 AI 서비스(가이드 챗, 회의록, 문서 검토, ITH)가 같은 입력창을 쓴다.
 *
 * - Enter: 보내기, Shift+Enter: 줄바꿈.
 * - 한글 입력 조합 중의 Enter는 보내기로 처리하지 않는다.
 * - 내용이 비어 있거나 `busy`/`disabled`면 전송 버튼이 비활성화된다.
 */
export function Composer({
  variant = 'docked',
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  onSubmit,
  placeholder = '메시지를 입력하세요',
  onAttach,
  attachLabel,
  helper,
  busy = false,
  disabled = false,
  className,
}: ComposerProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const helperId = useId();
  const canSubmit = value.trim().length > 0 && !busy && !disabled;
  const showAttach = onAttach != null && variant !== 'compact';

  const setValue = (next: string) => {
    if (controlledValue === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  const submit = () => {
    if (!canSubmit) return;
    onSubmit?.(value.trim());
    setValue('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 IME 조합 중 Enter는 글자 확정용이므로 보내지 않는다.
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    submit();
  };

  const attachButton = showAttach ? (
    attachLabel ? (
      <Button
        variant="secondary"
        className="rounded-full"
        onClick={onAttach}
        disabled={disabled}
      >
        <Paperclip /> {attachLabel}
      </Button>
    ) : (
      <Button
        variant="secondary"
        size="icon-round"
        aria-label="파일 첨부"
        onClick={onAttach}
        disabled={disabled}
      >
        <Plus />
      </Button>
    )
  ) : null;

  const sendButton = (
    <Button size="icon-round" type="submit" aria-label="보내기" disabled={!canSubmit} aria-busy={busy}>
      <ArrowUp />
    </Button>
  );

  const textarea = (
    <textarea
      data-slot="composer-input"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      aria-label={placeholder}
      aria-describedby={helper ? helperId : undefined}
      disabled={disabled}
      rows={1}
      className={cn(
        'field-sizing-content w-full resize-none bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
        variant === 'hero' ? 'min-h-16 max-h-60 px-1' : 'max-h-40 min-h-10 self-center py-2',
      )}
    />
  );

  return (
    <div data-slot="composer" className={cn('flex w-full flex-col items-center gap-2', className)}>
      <form onSubmit={handleSubmit} className={composerVariants({ variant })} aria-busy={busy}>
        {variant === 'hero' ? (
          <>
            {textarea}
            <div className="flex items-center justify-between gap-2">
              {attachButton ?? <span />}
              {sendButton}
            </div>
          </>
        ) : (
          <>
            {attachButton}
            {textarea}
            {sendButton}
          </>
        )}
      </form>
      {helper ? (
        <p id={helperId} className="text-center text-body-sm text-muted-foreground">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
