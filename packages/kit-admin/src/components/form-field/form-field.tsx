import { cloneElement, isValidElement, type ReactElement, type ReactNode, useId } from 'react';

import { cn } from '@aha/ui';

interface ControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

export interface FormFieldProps {
  /** 항목 이름. 입력 위에 보인다. 예: "이메일". */
  label: string;
  /** 필수 항목이면 true. 라벨 옆에 "필수"가 붙고 입력에 `aria-required`가 걸린다. */
  required?: boolean;
  /** 라벨 아래 도움말. 형식이나 제약을 적는다. 예: "사내 메일 주소만 쓸 수 있어요". */
  description?: ReactNode;
  /** 오류 문구. 주면 입력이 `aria-invalid`가 되고 문구가 도움말 대신 보인다. 무엇을 고치면 되는지 적는다. */
  error?: string;
  /**
   * 입력 요소 하나: `Input`, `Textarea`, `NativeSelect`.
   * 라벨·도움말·오류와 자동으로 연결된다 (id, aria-describedby, aria-invalid를 넣어 준다).
   */
  children: ReactElement<ControlProps>;
  className?: string;
}

/**
 * 폼 항목 하나: 라벨 + 입력 + 도움말/오류.
 * 관리자 화면의 편집 폼에서 FormSection 안에 세로로 쌓는다. 필터 바의 조건은 FilterField를 쓴다.
 */
export function FormField({ label, required = false, description, error, children, className }: FormFieldProps) {
  const autoId = useId();
  const controlId = (isValidElement(children) && children.props.id) || autoId;
  const hintId = `${controlId}-hint`;
  const hint = error ?? description;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id: controlId,
        'aria-describedby': hint ? hintId : undefined,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })
    : children;

  return (
    <div data-slot="form-field" className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={controlId} className="flex items-center gap-2 text-body font-semibold text-foreground">
        {label}
        {required ? <span className="text-caption font-normal text-muted-foreground">필수</span> : null}
      </label>
      {control}
      {hint ? (
        <p id={hintId} className={cn('text-body-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
