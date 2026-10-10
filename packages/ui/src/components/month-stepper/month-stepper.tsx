import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../button/button';
import { cn } from '../../lib/cn';

export interface YearMonth {
  year: number;
  /** 1–12 */
  month: number;
}

export interface MonthStepperProps {
  value: YearMonth;
  onValueChange: (value: YearMonth) => void;
  /** 이 달보다 앞으로는 갈 수 없다. */
  min?: YearMonth;
  /** 이 달보다 뒤로는 갈 수 없다. 보통 이번 달. */
  max?: YearMonth;
  className?: string;
}

const toIndex = ({ year, month }: YearMonth) => year * 12 + (month - 1);
const fromIndex = (index: number): YearMonth => ({ year: Math.floor(index / 12), month: (index % 12) + 1 });

/** 이전 달 · "2026년 10월" · 다음 달 (20쪽 관리자 사용 현황). 화면 전체의 조회 기간을 바꾼다. */
export function MonthStepper({ value, onValueChange, min, max, className }: MonthStepperProps) {
  const current = toIndex(value);
  const atMin = min ? current <= toIndex(min) : false;
  const atMax = max ? current >= toIndex(max) : false;
  return (
    <div data-slot="month-stepper" role="group" aria-label="조회 월" className={cn('flex items-center gap-2', className)}>
      <Button
        variant="secondary"
        size="icon"
        className="size-11 border-border"
        aria-label="이전 달"
        disabled={atMin}
        onClick={() => onValueChange(fromIndex(current - 1))}
      >
        <ChevronLeft />
      </Button>
      <span aria-live="polite" className="flex h-11 min-w-34 items-center justify-center rounded-md border border-border px-4 text-body font-semibold">
        {value.year}년 {value.month}월
      </span>
      <Button
        variant="secondary"
        size="icon"
        className="size-11 border-border"
        aria-label="다음 달"
        disabled={atMax}
        onClick={() => onValueChange(fromIndex(current + 1))}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
