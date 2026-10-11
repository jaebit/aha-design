import { useEffect, useId, useState } from 'react';

import { type ChartSeries, cn } from '@aha/ui';

import { AXIS_COLOR, ChartHeader, defaultFormat, GRID_COLOR, niceTicks, SERIES_COLORS, useWidth } from '../../lib/chart';

export interface LineChartDatum {
  /** x축 라벨. 예: "10/01", "09시". */
  label: string;
  /** 시리즈 키별 값. 없는 키는 그 점을 건너뛴다 (선이 끊긴다). */
  values: Record<string, number | undefined>;
}

export interface LineChartProps {
  /** 스크린리더와 표 보기의 제목. 예: "일별 활성 사용자". */
  title: string;
  /** 선으로 그릴 시리즈. 순서대로 chart-1~6 색을 받는다. 최대 6개이며, 7번째부터는 그리지 않고 콘솔에 경고한다. 값을 더할 수 있으면 넘기기 전에 "기타"로 묶는다. */
  series: ChartSeries[];
  /** 시간 순서대로 정렬한 값. */
  data: LineChartDatum[];
  /** 값 표시 형식. 기본은 "1,234건". */
  formatValue?: (value: number) => string;
  /** 첫 열(x축) 이름. 표 보기에 쓴다. 기본 "날짜". */
  xLabel?: string;
  /** true면 첫 시리즈 아래를 옅게 칠한다. 시리즈가 하나일 때만 쓴다. */
  area?: boolean;
  /** 그림 영역 높이(px). */
  height?: number;
  className?: string;
}

const AXIS_LEFT = 48;
const AXIS_BOTTOM = 28;
const TOP = 8;
const RIGHT = 8;

/**
 * 시간에 따른 변화를 보여주는 선 차트 (일별 사용자, 시간대별 요청 등).
 *
 * - 색: 시리즈 순서대로 chart-1~6. 텍스트에는 시리즈 색을 쓰지 않는다.
 * - 마우스를 올리거나 포커스하면 그 시점의 모든 시리즈 값을 툴팁으로 보여준다. 키보드는 Tab으로 시점마다 이동한다.
 * - 모든 값은 "표로 보기"에서도 읽을 수 있다. 막대로 비교할 값은 StackedColumnChart(공통)를 쓴다.
 */
export function LineChart({
  title,
  series,
  data,
  formatValue = defaultFormat,
  xLabel = '날짜',
  area = false,
  height = 220,
  className,
}: LineChartProps) {
  const titleId = useId();
  const gradientId = useId();
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const [ref, width] = useWidth<HTMLDivElement>(view);
  const [active, setActive] = useState<number | null>(null);
  const shown = series.slice(0, SERIES_COLORS.length);

  // 비율·평균처럼 더할 수 없는 값도 있어 "기타"로 자동으로 묶지 않는다. 빠진 시리즈를 알 수 있게 경고만 한다.
  const dropped = series.slice(SERIES_COLORS.length).map((s) => s.label).join(', ');
  useEffect(() => {
    if (dropped) console.warn(`LineChart "${title}": 시리즈는 ${SERIES_COLORS.length}개까지 그립니다. 빠진 시리즈: ${dropped}`);
  }, [title, dropped]);

  const values = data.flatMap((d) => shown.map((s) => d.values[s.key] ?? 0));
  const ticks = niceTicks(Math.max(0, ...values));
  const yMax = ticks.at(-1) ?? 1;
  const plotWidth = Math.max(0, width - AXIS_LEFT - RIGHT);
  const plotHeight = height - AXIS_BOTTOM - TOP;
  const step = data.length > 1 ? plotWidth / (data.length - 1) : 0;
  const x = (index: number) => AXIS_LEFT + (data.length > 1 ? step * index : plotWidth / 2);
  const y = (value: number) => TOP + plotHeight - (value / yMax) * plotHeight;
  const labelEvery = step < 44 ? Math.ceil(44 / Math.max(step, 1)) : 1;
  const band = data.length > 1 ? step : plotWidth;

  /** 값이 없는 점에서 끊기는 선 경로. */
  const path = (key: string) => {
    let d = '';
    let pen = false;
    data.forEach((datum, index) => {
      const value = datum.values[key];
      if (value === undefined) {
        pen = false;
        return;
      }
      d += `${pen ? 'L' : 'M'}${x(index)},${y(value)}`;
      pen = true;
    });
    return d;
  };

  const firstKey = shown[0]?.key;
  const areaPath =
    area && firstKey && data.every((d) => d.values[firstKey] !== undefined) && data.length > 1
      ? `${path(firstKey)}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
      : null;
  const activeDatum = active === null ? undefined : data[active];

  return (
    <figure data-slot="line-chart" aria-labelledby={titleId} className={cn('relative flex flex-col gap-4', className)}>
      <figcaption id={titleId} className="sr-only">
        {title}
      </figcaption>
      <ChartHeader
        items={shown.map((s, i) => ({ key: s.key, label: s.label, color: SERIES_COLORS[i]! }))}
        view={view}
        onViewChange={setView}
        shape="line"
      />

      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-normal">
                  {xLabel}
                </th>
                {shown.map((s) => (
                  <th key={s.key} scope="col" className="py-2 pr-4 text-right font-normal">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.map((datum) => (
                <tr key={datum.label} className="border-b border-border">
                  <th scope="row" className="py-2 pr-4 text-left font-normal">
                    {datum.label}
                  </th>
                  {shown.map((s) => {
                    const value = datum.values[s.key];
                    return (
                      <td key={s.key} className="py-2 pr-4 text-right">
                        {value === undefined ? '—' : formatValue(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={ref} className="relative w-full" style={{ height }} onPointerLeave={() => setActive(null)}>
          {width > 0 ? (
            <svg width={width} height={height} role="group" aria-label={title} className="overflow-visible">
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={SERIES_COLORS[0]} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={SERIES_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              {ticks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={AXIS_LEFT}
                    x2={width - RIGHT}
                    y1={y(tick)}
                    y2={y(tick)}
                    stroke={tick === 0 ? AXIS_COLOR : GRID_COLOR}
                    strokeWidth={1}
                    shapeRendering="crispEdges"
                  />
                  <text x={AXIS_LEFT - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-caption tabular-nums">
                    {tick.toLocaleString('ko-KR')}
                  </text>
                </g>
              ))}

              {active !== null ? (
                <line x1={x(active)} x2={x(active)} y1={TOP} y2={TOP + plotHeight} stroke={AXIS_COLOR} strokeWidth={1} />
              ) : null}

              {areaPath ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
              {shown.map((s, i) => (
                <path
                  key={s.key}
                  d={path(s.key)}
                  fill="none"
                  stroke={SERIES_COLORS[i]}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}

              {data.map((datum, index) => {
                const cx = x(index);
                const present = shown.map((s, i) => ({ s, i, value: datum.values[s.key] })).filter((p) => p.value !== undefined);
                return (
                  <g
                    key={datum.label}
                    tabIndex={0}
                    role="img"
                    aria-label={`${datum.label}. ${present.map((p) => `${p.s.label} ${formatValue(p.value!)}`).join(', ')}`}
                    onPointerEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive(null)}
                    className="cursor-default outline-none"
                  >
                    <rect x={cx - band / 2} y={TOP} width={band} height={plotHeight} fill="transparent" />
                    {active === index
                      ? present.map((p) => (
                          <circle key={p.s.key} cx={cx} cy={y(p.value!)} r={4} fill={SERIES_COLORS[p.i]} className="stroke-background" strokeWidth={2} />
                        ))
                      : null}
                    {index % labelEvery === 0 ? (
                      <text x={cx} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-caption">
                        {datum.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          ) : null}

          {active !== null && activeDatum ? (
            <div
              role="presentation"
              className="pointer-events-none absolute top-0 z-10 min-w-40 rounded-md border border-border bg-popover px-3 py-2 shadow-popover"
              style={{ left: Math.min(Math.max(x(active) + 16, 0), Math.max(0, width - 180)) }}
            >
              <p className="text-body-sm font-semibold text-foreground">{activeDatum.label}</p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {shown.map((s, i) => {
                  const value = activeDatum.values[s.key];
                  return (
                    <li key={s.key} className="flex items-center justify-between gap-4 text-caption">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: SERIES_COLORS[i] }} />
                        {s.label}
                      </span>
                      <span className="font-semibold text-foreground tabular-nums">{value === undefined ? '—' : formatValue(value)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </figure>
  );
}
