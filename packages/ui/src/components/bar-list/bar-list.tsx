import { cn } from '../../lib/cn';

export interface BarListItem {
  label: string;
  value: number;
}

export interface BarListProps {
  /** 스크린리더용 목록 이름. 예: "서비스별 이용 건수". */
  label: string;
  items: BarListItem[];
  /** 값 표시 형식. 기본은 "1,234건". */
  formatValue?: (value: number) => string;
  /** 막대 길이의 기준. 생략하면 가장 큰 값이 꽉 찬다. */
  max?: number;
  className?: string;
}

const defaultFormat = (value: number) => `${value.toLocaleString('ko-KR')}건`;

/**
 * 항목별 크기 비교용 가로 막대 목록 (20쪽 서비스별 이용).
 * 시리즈가 하나라 색은 chart-1 하나만 쓰고, 값은 막대 위에 글자로 함께 적는다 (색만으로 읽게 하지 않는다).
 * 항목이 많으면 큰 값 순으로 정렬하고 7개를 넘으면 나머지를 "기타"로 묶어 넘긴다.
 */
export function BarList({ label, items, formatValue = defaultFormat, max, className }: BarListProps) {
  const top = max ?? Math.max(1, ...items.map((item) => item.value));
  return (
    <ul data-slot="bar-list" aria-label={label} className={cn('flex flex-col gap-4', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-4 text-body-sm">
            <span className="text-foreground">{item.label}</span>
            <span className="text-muted-foreground tabular-nums">{formatValue(item.value)}</span>
          </div>
          <div aria-hidden className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-chart-1"
              style={{ width: `${Math.min(100, (item.value / top) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
