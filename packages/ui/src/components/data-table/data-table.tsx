import type { ReactNode } from 'react';

import { Checkbox } from '../checkbox/checkbox';
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
  /**
   * 체크박스로 고른 행 id. `onSelectedIdsChange`와 함께 주면 맨 앞에 선택 열이 생긴다.
   * 일괄 작업(삭제, 권한 변경)이 있는 목록에 쓴다. 고른 행이 있으면 관리자 키트의 BulkActionBar를 표 위에 둔다.
   */
  selectedIds?: string[];
  /** 선택이 바뀔 때. 머리글 체크박스는 현재 `rows` 전체를 고르거나 푼다. */
  onSelectedIdsChange?: (ids: string[]) => void;
  /** 행 선택 체크박스의 스크린리더용 이름에 쓸 행 이름. 예: `(row) => row.name` → "김하마 선택". 생략하면 행 id. */
  getRowLabel?: (row: Row) => string;
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
  selectedIds,
  onSelectedIdsChange,
  getRowLabel,
  compact = false,
  emptyMessage = '조건에 맞는 데이터가 없어요.',
  footer,
  className,
}: DataTableProps<Row>) {
  const visible = compact ? columns.filter((column) => !column.secondary) : columns;
  const selectable = Boolean(onSelectedIdsChange);
  const chosen = new Set(selectedIds ?? []);
  const rowIds = rows.map(getRowId);
  const chosenCount = rowIds.filter((id) => chosen.has(id)).length;
  const toggleAll = (checked: boolean) => {
    const others = (selectedIds ?? []).filter((id) => !rowIds.includes(id));
    onSelectedIdsChange?.(checked ? [...others, ...rowIds] : others);
  };
  const toggleRow = (id: string, checked: boolean) =>
    onSelectedIdsChange?.(checked ? [...(selectedIds ?? []), id] : (selectedIds ?? []).filter((v) => v !== id));
  const colSpan = visible.length + (selectable ? 1 : 0);
  return (
    <div data-slot="data-table" className={cn('flex flex-col', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-y border-border bg-subtle">
              {selectable ? (
                <th scope="col" className="w-12 pl-6">
                  <Checkbox
                    aria-label="이 페이지 전체 선택"
                    checked={rows.length > 0 && chosenCount === rows.length}
                    indeterminate={chosenCount > 0 && chosenCount < rows.length}
                    onCheckedChange={toggleAll}
                    disabled={rows.length === 0}
                  />
                </th>
              ) : null}
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
                <td colSpan={colSpan} className="px-6 py-12 text-center text-body text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const id = getRowId(row);
                const selected = id === selectedRowId;
                const checked = chosen.has(id);
                return (
                  <tr
                    key={id}
                    aria-current={selected ? 'true' : undefined}
                    aria-selected={selectable ? checked : undefined}
                    className={cn('border-b border-border', checked && 'bg-subtle', selected && 'bg-muted')}
                  >
                    {selectable ? (
                      <td className="w-12 pl-6 align-middle">
                        <Checkbox
                          aria-label={`${getRowLabel ? getRowLabel(row) : id} 선택`}
                          checked={checked}
                          onCheckedChange={(next) => toggleRow(id, next)}
                        />
                      </td>
                    ) : null}
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
