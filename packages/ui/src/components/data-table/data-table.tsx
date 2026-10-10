import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';

export interface DataTableColumn<Row> {
  /** 열 식별자. */
  key: string;
  /** 열 제목. */
  header: string;
  /** 셀 내용. 두 줄 셀은 `CellText`, 상태는 `Badge`, 상세 이동은 밑줄 링크를 쓴다. */
  cell: (row: Row) => ReactNode;
  /** 숫자 열은 `end`. */
  align?: 'start' | 'end';
  /** 좁은 화면에서 숨길 열이면 true. 옆 대화 패널이 열려 폭이 좁을 때 생성 시각 같은 보조 열을 숨긴다 (16쪽). */
  secondary?: boolean;
}

export interface DataTableProps<Row> {
  /** 스크린리더용 표 제목. 예: "일일 오류 보고서 목록". */
  caption: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  /** 강조할 행. 옆 대화 패널에서 이야기하는 행 (16쪽 10/03). */
  selectedRowId?: string;
  /** true면 `secondary` 열을 숨긴다. */
  compact?: boolean;
  /** 행이 없을 때 문구. */
  emptyMessage?: string;
  /** 표 아래 영역. 안내 문구와 Pagination. */
  footer?: ReactNode;
  className?: string;
}

/**
 * 데이터 표 (15, 16쪽). 회색 머리글, 행 구분선, 선택 행 강조.
 * 정렬·필터 같은 상호작용이 필요해지면 TanStack Table로 확장한다 (현재 와이어프레임에는 없음).
 */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowId,
  selectedRowId,
  compact = false,
  emptyMessage = '조건에 맞는 데이터가 없어요.',
  footer,
  className,
}: DataTableProps<Row>) {
  const visible = compact ? columns.filter((column) => !column.secondary) : columns;
  return (
    <div data-slot="data-table" className={cn('flex flex-col', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-y border-border bg-subtle">
              {visible.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'h-13 px-6 text-body font-normal whitespace-nowrap text-muted-foreground',
                    column.align === 'end' && 'text-right',
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={visible.length} className="px-6 py-12 text-center text-body text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const id = getRowId(row);
                const selected = id === selectedRowId;
                return (
                  <tr
                    key={id}
                    aria-current={selected ? 'true' : undefined}
                    className={cn('border-b border-border', selected && 'bg-muted')}
                  >
                    {visible.map((column) => (
                      <td
                        key={column.key}
                        className={cn('px-6 py-4 align-middle text-body text-foreground', column.align === 'end' && 'text-right')}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {footer ? <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">{footer}</div> : null}
    </div>
  );
}

export interface CellTextProps {
  /** 첫 줄. 링크가 필요하면 `<a>`를 넘긴다. */
  primary: ReactNode;
  /** 둘째 줄 보조 정보. 예: "일일 · 1차 생성", "Korea Standard Time". */
  secondary?: ReactNode;
  /** 첫 줄을 굵게. 건수처럼 눈에 띄어야 하는 값. */
  strong?: boolean;
}

/** 두 줄 셀 (15쪽 대상 날짜 · 생성 시각). */
export function CellText({ primary, secondary, strong = false }: CellTextProps) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className={cn('text-body text-foreground', strong && 'font-semibold')}>{primary}</span>
      {secondary ? <span className="text-body-sm text-muted-foreground">{secondary}</span> : null}
    </span>
  );
}
