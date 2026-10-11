import { cloneElement, isValidElement, type ReactElement, type ReactNode, useId } from 'react';

import { cn } from '../../lib/cn';

interface ControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

export interface FormFieldProps {
  /** 항목 이름. 입력 위에 보인다. 예: "이메일", "비밀번호". */
  label: ReactNode;
  /** 필수 항목이면 true. 라벨 옆에 "필수"가 붙고 입력에 `aria-required`가 걸린다. 빈 값 검사와 오류 문구는 앱이 `error`로 보여준다. */
  required?: boolean;
  /** 라벨 아래 도움말. 형식이나 제약을 적는다. 예: "사내 메일 주소만 쓸 수 있어요", "12자 이상, 영문·숫자·기호를 섞어 주세요". */
  description?: ReactNode;
  /** 오류 문구. 주면 입력이 `aria-invalid`가 되고 문구가 도움말 대신 보인다. 무엇을 고치면 되는지 적는다. */
  error?: ReactNode;
  /** 라벨 오른쪽 끝 보조 요소. 예: 비밀번호 칸의 "비밀번호 찾기" 링크(`Button variant="link" size="sm"`). */
  labelAction?: ReactNode;
  /**
   * 입력 요소 하나: `Input`, `Textarea`, `NativeSelect`.
   * 라벨·도움말·오류와 자동으로 연결된다 (id, aria-describedby, aria-invalid, aria-required를 넣어 준다).
   */
  children: ReactElement<ControlProps>;
  /** 입력 요소의 id. 생략하면 자식의 id를 쓰고, 그것도 없으면 자동으로 만든다. */
  id?: string;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

/**
 * 폼 항목 하나: 라벨 + 입력 + 도움말/오류.
 * 관리 화면의 편집 폼(관리자 키트의 FormSection 안에 세로로 쌓는다), 로그인·계정 설정 폼에 쓴다. 필터 바의 조건은 FilterField를 쓴다.
 * 오류는 색만으로 알리지 않고 문구로 쓴다.
 */
export function FormField({ label, required = false, description, error, labelAction, children, id, className }: FormFieldProps) {
  const autoId = useId();
  const controlId = id ?? ((isValidElement(children) && children.props.id) || autoId);
  const hintId = `${controlId}-hint`;
  const hint = error ?? description;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id: controlId,
        // 자식이 따로 잇는 문구(예: 폼 위 로그인 오류)를 지우지 않고 함께 잇는다.
        'aria-describedby':
          [children.props['aria-describedby'], hint ? hintId : undefined].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? true : children.props['aria-invalid'],
        'aria-required': required || children.props['aria-required'] || undefined,
      })
    : children;

  return (
    <div data-slot="form-field" className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={controlId} className="flex items-center gap-2 text-body font-semibold text-foreground">
          {label}
          {required ? <span className="text-caption font-normal text-muted-foreground">필수</span> : null}
        </label>
        {labelAction ? <div className="text-body-sm">{labelAction}</div> : null}
      </div>
      {control}
      {hint ? (
        <p id={hintId} className={cn('text-body-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
