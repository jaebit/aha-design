import { Search } from 'lucide-react';
import { type FormEvent, type ReactNode, useId } from 'react';

import { Button } from '@/components/button/button';
import { cn } from '@/lib/cn';

export interface FilterBarProps {
  /** `FilterField` 목록. 접힌 상태에서는 그리지 않는다. */
  children?: ReactNode;
  /** 조회. 폼 제출(Enter 포함)로도 호출된다. */
  onSubmit: () => void;
  /** 초기화. 생략하면 버튼을 숨긴다. */
  onReset?: () => void;
  /** 조회 결과 요약. 예: "7건의 보고서 · 전체 서비스 · 날짜 내림차순". */
  summary?: string;
  /**
   * 접힌 상태 (16쪽). 옆에 대화 패널이 열려 폭이 좁을 때 쓴다.
   * 현재 조건을 요약 버튼으로 보여주고, 누르면 `onExpand`가 호출된다.
   */
  collapsed?: boolean;
  /** 접힌 상태에서 보일 조건 요약. 예: ["시작일 · 종료일", "전체 서비스군", "전체 서비스"]. */
  collapsedLabels?: string[];
  onExpand?: () => void;
  /** 조회 버튼 문구. 기본 "조회". 예: "보고서 조회". */
  submitLabel?: string;
  className?: string;
}

/**
 * 데이터 조회 조건 (15쪽 ITH 일일 오류 보고서).
 * 테두리가 없으므로 DataTable과 함께 하나의 `Card padding="none"` 안에 위아래로 둔다.
 */
export function FilterBar({
  children,
  onSubmit,
  onReset,
  summary,
  collapsed = false,
  collapsedLabels = [],
  onExpand,
  submitLabel = '조회',
  className,
}: FilterBarProps) {
  const summaryId = useId();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  if (collapsed) {
    return (
      <form
        data-slot="filter-bar"
        role="search"
        onSubmit={handleSubmit}
        className={cn('flex flex-wrap items-center gap-2 p-5', className)}
      >
        {collapsedLabels.map((label) => (
          <Button key={label} variant="secondary" size="sm" className="border-border font-normal" onClick={onExpand}>
            {label}
          </Button>
        ))}
        <Button type="submit" size="sm">
          {submitLabel}
        </Button>
      </form>
    );
  }

  return (
    <form
      data-slot="filter-bar"
      role="search"
      aria-describedby={summary ? summaryId : undefined}
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-4 p-6', className)}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">{children}</div>
      <div className="flex items-center gap-2">
        <Button type="submit">
          <Search /> {submitLabel}
        </Button>
        {onReset ? (
          <Button variant="ghost" onClick={onReset}>
            초기화
          </Button>
        ) : null}
      </div>
      {summary ? (
        <p id={summaryId} className="text-body-sm text-muted-foreground">
          {summary}
        </p>
      ) : null}
    </form>
  );
}

export interface FilterFieldProps {
  /** 화면에 보이는 라벨. 예: "시작일", "서비스군". */
  label: string;
  /** 입력 요소 하나. `Input type="date"`, `NativeSelect` 등. 라벨과 자동으로 연결된다. */
  children: ReactNode;
  className?: string;
}

/** 라벨이 왼쪽에 붙은 조건 하나. label 요소로 감싸서 입력과 라벨을 연결한다. */
export function FilterField({ label, children, className }: FilterFieldProps) {
  return (
    <label data-slot="filter-field" className={cn('flex items-center gap-2', className)}>
      <span className="shrink-0 text-body font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
