import { Check, Minus } from 'lucide-react';
import { type ReactNode, useEffect, useId, useRef } from 'react';

import { cn } from '../../lib/cn';

export interface CheckboxProps {
  /** 제어 모드 체크 상태. `onCheckedChange`와 함께 쓴다. */
  checked?: boolean;
  /** 비제어 모드 초깃값. */
  defaultChecked?: boolean;
  /** 체크 상태가 바뀔 때. */
  onCheckedChange?: (checked: boolean) => void;
  /** 일부만 선택된 상태(−). 표 머리글의 "전체 선택"에서 일부 행만 골랐을 때 쓴다. */
  indeterminate?: boolean;
  /** 옆에 보이는 라벨. 누르면 체크박스가 바뀐다. 생략하면 `aria-label`을 준다. */
  label?: ReactNode;
  /** 라벨 아래 보조 설명. `label`과 함께 쓴다. */
  description?: ReactNode;
  /** 라벨이 없을 때 스크린리더용 이름. 예: "김하마 선택". */
  'aria-label'?: string;
  /** true면 누를 수 없다. 지금 바꿀 수 없는 항목. */
  disabled?: boolean;
  /** 폼 전송용 이름. */
  name?: string;
  /** 폼 전송용 값. 생략하면 브라우저 기본값 "on". */
  value?: string;
  /** input의 id. 생략하면 자동으로 만든다. */
  id?: string;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

/**
 * 체크박스. 저장 버튼을 눌러야 적용되는 폼 항목, 여러 개 고르기, 표의 행 선택에 쓴다.
 * 누르는 즉시 적용되는 설정은 Switch를 쓴다.
 */
export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  indeterminate = false,
  label,
  description,
  disabled = false,
  name,
  value,
  id,
  className,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = `${inputId}-description`;
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const box = (
    <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
        disabled={disabled}
        name={name}
        value={value}
        aria-label={props['aria-label']}
        // 설명 요소는 label이 있을 때만 그린다.
        aria-describedby={label && description ? descriptionId : undefined}
        className="peer size-5 cursor-pointer appearance-none rounded-sm border border-border-strong bg-background transition-colors checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
      />
      <Check
        aria-hidden
        strokeWidth={3}
        className="pointer-events-none absolute hidden size-3.5 text-primary-foreground peer-checked:block peer-indeterminate:hidden"
      />
      <Minus
        aria-hidden
        strokeWidth={3}
        className="pointer-events-none absolute hidden size-3.5 text-primary-foreground peer-indeterminate:block"
      />
    </span>
  );

  if (!label) {
    return (
      <span data-slot="checkbox" className={cn('inline-flex', className)}>
        {box}
      </span>
    );
  }
  return (
    <div data-slot="checkbox" className={cn('flex items-start gap-3', className)}>
      {box}
      <div className="flex min-w-0 flex-col gap-0.5">
        <label
          htmlFor={inputId}
          className={cn('cursor-pointer text-body text-foreground', disabled && 'cursor-not-allowed opacity-40')}
        >
          {label}
        </label>
        {description ? (
          <span id={descriptionId} className="text-body-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
}
