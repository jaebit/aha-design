import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@actoz/ui';

export type ExceptionKind = 'attend' | 'block' | 'supply' | 'policy' | 'wait';

/** 예외 종류 이름. 색만으로 알리지 않도록 항상 이 글자를 함께 보인다. */
export const EXCEPTION_KIND_LABELS: Record<ExceptionKind, string> = {
  attend: '확인 후 진행',
  block: '진행 불가',
  supply: '보완 입력',
  policy: '정책 미정',
  wait: '대기',
};

/** 예외 코드 → 종류. */
export const EXCEPTION_KIND_BY_CODE: Record<string, ExceptionKind> = {
  E01: 'attend',
  E02: 'attend',
  E04: 'attend',
  E05: 'attend',
  E12: 'attend',
  E06: 'block',
  E08: 'block',
  E10: 'block',
  E07: 'supply',
  E09: 'supply',
  E11: 'supply',
  E14: 'supply',
  E03: 'policy',
  E13: 'wait',
};

/** 코드의 예외 종류를 돌려준다. 표에 없는 코드는 확인 후 진행으로 본다. */
export function exceptionKindOf(code: string): ExceptionKind {
  return EXCEPTION_KIND_BY_CODE[code] ?? 'attend';
}

const kindStyles: Record<ExceptionKind, { box: string; text: string }> = {
  attend: { box: 'border-status-warning', text: 'text-status-warning-foreground' },
  block: { box: 'border-status-critical', text: 'text-status-critical-foreground' },
  supply: { box: 'border-status-serious', text: 'text-status-serious-foreground' },
  policy: { box: 'border-dashed border-border-strong', text: 'text-muted-foreground' },
  wait: { box: 'border-dashed border-border-strong', text: 'text-muted-foreground' },
};

export interface ExceptionBadgeProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** 예외 코드 (E01~E14). */
  code: string;
  /** 상황 문장 (예: "재계산 로열티 ≠ 정산서 로열티"). 코드 배지 뒤에 보인다. */
  children?: ReactNode;
  /** 종류. 생략하면 코드에서 정한다. attend(확인 후 진행), block(진행 불가), supply(보완 입력), policy(정책 미정), wait(대기). */
  kind?: ExceptionKind;
}

/**
 * 예외 코드와 종류를 함께 보이는 배지. 코드 배지, 상황 문장, 종류 이름 순서로 놓는다.
 * 빨강 계열은 진행 불가에만 쓴다. 정책 미정과 대기는 점선으로 구분한다.
 */
export function ExceptionBadge({ className, code, children, kind, ...props }: ExceptionBadgeProps) {
  const resolved = kind ?? exceptionKindOf(code);
  const style = kindStyles[resolved];
  return (
    <span
      data-slot="exception-badge"
      data-kind={resolved}
      className={cn('inline-flex items-baseline gap-2 text-body-sm', className)}
      {...props}
    >
      <span className={cn('rounded-sm border px-1.5 font-mono text-caption text-foreground', style.box)}>{code}</span>
      {children ? <span className="text-foreground">{children}</span> : null}
      <span className={cn('whitespace-nowrap text-caption font-medium', style.text)}>{EXCEPTION_KIND_LABELS[resolved]}</span>
    </span>
  );
}
