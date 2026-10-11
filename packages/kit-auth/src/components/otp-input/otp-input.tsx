import { type ClipboardEvent, type KeyboardEvent, useRef, useState } from 'react';

import { cn } from '@aha/ui';

export interface OtpInputProps {
  /** 자릿수. 인증 앱(TOTP)·문자 인증은 6, 복구 코드는 쓰지 않는다(Input을 쓴다). 기본 6. */
  length?: number;
  /** 제어 모드 값(숫자 문자열). `onChange`와 함께 쓴다. */
  value?: string;
  /** 비제어 모드 초깃값. */
  defaultValue?: string;
  /** 값이 바뀔 때. 지운 칸은 빠진 채로 앞에서부터 이어 붙인 문자열이 온다. */
  onChange?: (value: string) => void;
  /** 모든 칸이 채워졌을 때 한 번. 자동 제출에 쓴다. */
  onComplete?: (value: string) => void;
  /** 스크린리더용 이름. FormField 안에서는 라벨이 이어지므로 생략한다. 기본 "인증 코드". */
  'aria-label'?: string;
  /** 코드가 틀렸으면 true. 칸 테두리가 destructive 색이 된다. 오류 문구는 FormField `error`로 보여준다. */
  'aria-invalid'?: boolean;
  /** FormField가 넣는 안내·오류 문구 연결. */
  'aria-describedby'?: string;
  /** 필수 입력이면 true. FormField `required`가 넣어 준다. */
  'aria-required'?: boolean;
  /** 첫 칸의 id. FormField가 라벨과 잇는다. */
  id?: string;
  disabled?: boolean;
  /** 화면이 열리면 첫 칸에 포커스. 2단계 인증 화면처럼 이 입력만 있는 화면에서 쓴다. */
  autoFocus?: boolean;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

const onlyDigits = (text: string) => text.replace(/\D/g, '');

/**
 * 2단계 인증 코드 입력. 숫자 칸을 자릿수만큼 나란히 둔다.
 * 입력하면 다음 칸으로, Backspace는 앞 칸으로 옮기고, 붙여넣기와 문자 자동 완성(`one-time-code`)을 받는다.
 */
export function OtpInput({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  disabled = false,
  autoFocus = false,
  id,
  className,
  ...aria
}: OtpInputProps) {
  const [inner, setInner] = useState(onlyDigits(defaultValue).slice(0, length));
  const code = value !== undefined ? onlyDigits(value).slice(0, length) : inner;
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string) => {
    const clean = onlyDigits(next).slice(0, length);
    if (value === undefined) setInner(clean);
    onChange?.(clean);
    if (clean.length === length && code.length !== length) onComplete?.(clean);
    return clean;
  };
  const focusAt = (index: number) => refs.current[Math.max(0, Math.min(index, length - 1))]?.focus();

  const handleInput = (index: number, raw: string) => {
    const digits = onlyDigits(raw);
    if (!digits) return;
    // 한 칸에 여러 자리가 들어오면(자동 완성) 그 칸부터 채운다.
    const next = commit(code.slice(0, index) + digits + code.slice(index + digits.length));
    focusAt(Math.min(index + digits.length, next.length));
  };
  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Delete') {
      event.preventDefault();
      if (code[index]) commit(code.slice(0, index) + code.slice(index + 1));
    } else if (event.key === 'Backspace') {
      event.preventDefault();
      if (code[index]) commit(code.slice(0, index) + code.slice(index + 1));
      else if (index > 0) {
        commit(code.slice(0, index - 1) + code.slice(index));
        focusAt(index - 1);
      }
    } else if (event.key === 'ArrowLeft') focusAt(index - 1);
    else if (event.key === 'ArrowRight') focusAt(index + 1);
  };
  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    // 숫자가 없는 글자를 붙여넣으면 입력해 둔 코드를 지우지 않는다.
    if (!onlyDigits(event.clipboardData.getData('text'))) return;
    const next = commit(event.clipboardData.getData('text'));
    focusAt(next.length);
  };

  return (
    <div
      data-slot="otp-input"
      role="group"
      aria-label={aria['aria-label'] ?? (id ? undefined : '인증 코드')}
      className={cn('flex gap-2', className)}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={index === 0 ? length : 1}
          // 첫 칸은 FormField 라벨(htmlFor)을 이름으로 쓴다.
          aria-label={index === 0 && id ? undefined : `${index + 1}번째 자리`}
          aria-invalid={aria['aria-invalid']}
          aria-required={aria['aria-required']}
          // 안내·오류 문구는 칸마다 잇는다. 어느 칸에 포커스가 가도 읽힌다.
          aria-describedby={aria['aria-describedby']}
          // 비어 있는 칸 중 첫 칸만 Tab으로 들어온다. 다음 칸으로는 입력하면서 옮겨 간다.
          tabIndex={index === Math.min(code.length, length - 1) ? 0 : -1}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          value={code[index] ?? ''}
          onChange={(event) => handleInput(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          // 클릭하면 mouseup에서 선택이 풀려 채워진 칸에 덮어쓰지 못한다. 직접 포커스하고 선택한다.
          onMouseDown={(event) => {
            event.preventDefault();
            event.currentTarget.focus();
            event.currentTarget.select();
          }}
          className="h-12 w-11 min-w-0 rounded-md border border-input bg-background text-center font-mono text-heading text-foreground outline-none transition-colors focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive"
        />
      ))}
    </div>
  );
}
