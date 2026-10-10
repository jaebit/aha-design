import { useId, useState } from 'react';

import { cn } from '@aha/ui';

import { ChartHeader, defaultFormat, SERIES_COLORS } from '../../lib/chart';

export interface HeatmapProps {
  /** 스크린리더와 표 보기의 제목. 예: "요일·시간대별 요청". */
  title: string;
  /** 행 라벨 (세로축). 예: ["월", "화", …]. */
  rows: string[];
  /** 열 라벨 (가로축). 예: ["0시", "1시", … "23시"]. */
  columns: string[];
  /** `values[행][열]`. 행·열 개수가 rows·columns와 같아야 한다. */
  values: number[][];
  /** 표 보기 첫 열 제목. 기본 "구분". */
  rowHeader?: string;
  /** 가로축 라벨을 몇 칸마다 보여줄지. 기본은 칸이 좁으면 자동으로 건너뛴다. */
  columnLabelEvery?: number;
  /** 값 표시 형식. 기본은 "1,234건". */
  formatValue?: (value: number) => string;
  className?: string;
}

/** 0을 뺀 값의 진하기 단계. chart-1 색의 불투명도로 나타낸다. */
const LEVELS = [0.15, 0.35, 0.55, 0.75, 1] as const;

/**
 * 두 기준(요일 × 시간대 등)에 따른 양을 색 진하기로 보여주는 히트맵.
 * 언제 사용이 몰리는지 한눈에 볼 때 쓴다.
 *
 * - 한 가지 색(chart-1)의 진하기 5단계로만 표현하고, 0은 빈 칸(muted)으로 둔다. 범례에 단계별 범위를 적는다.
 * - 칸이 많아 칸마다 포커스를 두지 않는다. 마우스는 툴팁, 키보드·스크린리더는 "표로 보기"로 모든 값을 읽는다.
 */
export function Heatmap({
  title,
  rows,
  columns,
  values,
  rowHeader = '구분',
  columnLabelEvery,
  formatValue = defaultFormat,
  className,
}: HeatmapProps) {
  const titleId = useId();
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const [active, setActive] = useState<{ row: number; column: number } | null>(null);
  const max = Math.max(0, ...values.flat());
  const level = (value: number) => (value <= 0 || max <= 0 ? -1 : Math.min(LEVELS.length - 1, Math.floor((value / max) * LEVELS.length)));
  const every = columnLabelEvery ?? (columns.length > 12 ? Math.ceil(columns.length / 6) : 1);
  const bound = (index: number) => Math.round((max * (index + 1)) / LEVELS.length);
  const activeValue = active ? values[active.row]?.[active.column] ?? 0 : 0;

  return (
    <figure data-slot="heatmap" aria-labelledby={titleId} className={cn('flex flex-col gap-4', className)}>
      <figcaption id={titleId} className="sr-only">
        {title}
      </figcaption>
      <ChartHeader items={[]} view={view} onViewChange={setView} />

      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="py-2 pr-3 text-left font-normal">
                  {rowHeader}
                </th>
                {columns.map((column) => (
                  <th key={column} scope="col" className="px-1.5 py-2 text-right font-normal whitespace-nowrap">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((row, r) => (
                <tr key={row} className="border-b border-border">
                  <th scope="row" className="py-2 pr-3 text-left font-normal">
                    {row}
                  </th>
                  {columns.map((column, c) => (
                    <td key={column} className="px-1.5 py-2 text-right">
                      {(values[r]?.[c] ?? 0).toLocaleString('ko-KR')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative flex w-fit max-w-full flex-col gap-3" onPointerLeave={() => setActive(null)}>
          <div
            role="img"
            aria-label={`${title}. 가장 많은 칸 ${formatValue(max)}. 칸별 값은 표로 보기에서 읽을 수 있습니다.`}
            className="grid gap-1"
            // 칸은 2rem까지만 커진다. 넓은 화면에서 칸이 지나치게 커지지 않게 한다.
            style={{ gridTemplateColumns: `auto repeat(${columns.length}, minmax(0, 2rem))` }}
          >
            {rows.map((row, r) => (
              <div key={row} className="contents">
                <span className="pr-2 text-right text-caption text-muted-foreground">{row}</span>
                {columns.map((column, c) => {
                  const value = values[r]?.[c] ?? 0;
                  const l = level(value);
                  const isActive = active?.row === r && active.column === c;
                  return (
                    <span
                      key={column}
                      aria-hidden
                      onPointerEnter={() => setActive({ row: r, column: c })}
                      className={cn('aspect-square min-h-3 rounded-sm', l < 0 && 'bg-muted', isActive && 'ring-2 ring-foreground')}
                      style={l < 0 ? undefined : { background: SERIES_COLORS[0], opacity: LEVELS[l] }}
                    />
                  );
                })}
              </div>
            ))}
            <span />
            {columns.map((column, c) => (
              <span key={column} aria-hidden className="overflow-visible text-left text-caption whitespace-nowrap text-muted-foreground">
                {c % every === 0 ? column : ''}
              </span>
            ))}
          </div>

          <div aria-hidden className="flex items-center justify-end gap-1.5 text-caption text-muted-foreground">
            <span>적음</span>
            <span className="size-3 rounded-sm bg-muted" title="0" />
            {LEVELS.map((opacity, index) => (
              <span
                key={opacity}
                className="size-3 rounded-sm"
                style={{ background: SERIES_COLORS[0], opacity }}
                title={`${index === 0 ? 1 : bound(index - 1) + 1} ~ ${bound(index)}`}
              />
            ))}
            <span>많음</span>
          </div>

          {active ? (
            <div
              role="presentation"
              className="pointer-events-none absolute right-0 top-0 z-10 rounded-md border border-border bg-popover px-3 py-2 shadow-popover"
            >
              <p className="text-body-sm font-semibold text-foreground">
                {rows[active.row]} · {columns[active.column]}
              </p>
              <p className="text-caption text-muted-foreground tabular-nums">{formatValue(activeValue)}</p>
            </div>
          ) : null}
        </div>
      )}
    </figure>
  );
}
