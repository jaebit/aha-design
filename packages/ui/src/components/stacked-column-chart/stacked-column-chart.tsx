import { useEffect, useId, useRef, useState } from 'react';

import { Button } from '../button/button';
import { cn } from '../../lib/cn';

export interface ChartSeries {
  /** `data[].values`의 키. */
  key: string;
  /** 범례와 툴팁에 보이는 이름. */
  label: string;
}

export interface StackedColumnDatum {
  /** x축 라벨. 예: "10/01". */
  label: string;
  /** 시리즈 키별 값. 없는 키는 0으로 본다. */
  values: Record<string, number>;
}

export interface StackedColumnChartProps {
  /** 스크린리더와 표 보기의 제목. 예: "일별 요청 수". */
  title: string;
  /** 쌓을 시리즈. 순서대로 chart-1~6 색을 받는다. 6개를 넘으면 앞의 5개만 두고 나머지 값을 더해 "기타"로 묶는다. */
  series: ChartSeries[];
  /** x축 순서대로 정렬한 막대 값. */
  data: StackedColumnDatum[];
  /** 값 표시 형식. 기본은 "1,234건". */
  formatValue?: (value: number) => string;
  /** 그림 영역 높이(px). */
  height?: number;
  className?: string;
}

// SVG 속성에는 Tailwind 클래스를 쓸 수 없어 토큰 CSS 변수를 직접 참조한다 (Tailwind 테마 변수는 사용 감지 여부에 따라 빠질 수 있다).
const SERIES_COLORS = [
  'var(--actoz-color-chart-1)',
  'var(--actoz-color-chart-2)',
  'var(--actoz-color-chart-3)',
  'var(--actoz-color-chart-4)',
  'var(--actoz-color-chart-5)',
  'var(--actoz-color-chart-6)',
] as const;

const MAX_BAR = 24;
const GAP = 2;
const RADIUS = 4;
const AXIS_LEFT = 48;
const AXIS_BOTTOM = 28;
const TOP = 8;

const defaultFormat = (value: number) => `${value.toLocaleString('ko-KR')}건`;

/** 0부터 max를 덮는 깔끔한 눈금 (1·2·5 × 10^n 간격). */
function niceTicks(max: number, count = 4) {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let value = 0; value <= max + step * 0.999; value += step) ticks.push(Math.round(value * 1e6) / 1e6);
  return ticks;
}

/** 6개를 넘으면 앞의 5개 + "기타"(나머지 시리즈 값의 합). */
function groupSeries(series: ChartSeries[], data: StackedColumnDatum[]) {
  if (series.length <= SERIES_COLORS.length) return { shown: series, data };
  const head = series.slice(0, SERIES_COLORS.length - 1);
  const rest = series.slice(SERIES_COLORS.length - 1);
  const other: ChartSeries = { key: '__other', label: '기타' };
  return {
    shown: [...head, other],
    data: data.map((datum) => ({
      ...datum,
      values: { ...datum.values, [other.key]: rest.reduce((sum, s) => sum + (datum.values[s.key] ?? 0), 0) },
    })),
  };
}

/** 위쪽 모서리만 둥근 막대 경로 (기준선 쪽은 각지게). */
function topRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height);
  return `M${x},${y + height}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${y + height}Z`;
}

/**
 * 시리즈별로 쌓은 세로 막대 차트 (20쪽 "일별 요청 추이 · 서비스별 색 구분").
 *
 * - 색: 시리즈 순서대로 chart-1~6. 7개 이상이면 6번째부터 "기타"로 묶는다. 텍스트에는 시리즈 색을 쓰지 않는다.
 * - 범례는 항상 위에 있고, 막대에 마우스를 올리거나 포커스하면 그날의 모든 시리즈 값이 툴팁으로 나온다.
 * - chart-3~5는 흰 배경 대비가 낮아 "표로 보기"를 항상 제공한다. 모든 값은 표에서도 읽을 수 있다.
 */
export function StackedColumnChart({
  title,
  series,
  data: input,
  formatValue = defaultFormat,
  height = 220,
  className,
}: StackedColumnChartProps) {
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const [active, setActive] = useState<{ index: number; x: number } | null>(null);
  const { shown, data } = groupSeries(series, input);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width ?? 0));
    observer.observe(element);
    return () => observer.disconnect();
  }, [view]);

  const totals = data.map((datum) => shown.reduce((sum, s) => sum + (datum.values[s.key] ?? 0), 0));
  const ticks = niceTicks(Math.max(0, ...totals));
  const yMax = ticks.at(-1) ?? 1;
  const plotWidth = Math.max(0, width - AXIS_LEFT);
  const plotHeight = height - AXIS_BOTTOM - TOP;
  const band = data.length > 0 ? plotWidth / data.length : 0;
  const barWidth = Math.min(MAX_BAR, band * 0.6);
  const y = (value: number) => TOP + plotHeight - (value / yMax) * plotHeight;
  const labelEvery = band < 36 ? Math.ceil(36 / Math.max(band, 1)) : 1;

  const showTooltip = (index: number) => () => setActive({ index, x: AXIS_LEFT + band * index + band / 2 });

  const activeDatum = active ? data[active.index] : undefined;

  return (
    <figure data-slot="stacked-column-chart" aria-labelledby={titleId} className={cn('relative flex flex-col gap-4', className)}>
      <figcaption id={titleId} className="sr-only">
        {title}
      </figcaption>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul aria-label="범례" className="flex flex-wrap gap-x-4 gap-y-1">
          {shown.map((s, i) => (
            <li key={s.key} className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
              <span aria-hidden className="size-2.5 rounded-sm" style={{ background: SERIES_COLORS[i] }} />
              {s.label}
            </li>
          ))}
        </ul>
        <Button
          variant="link"
          size="sm"
          className="text-body-sm text-muted-foreground"
          aria-pressed={view === 'table'}
          onClick={() => setView(view === 'chart' ? 'table' : 'chart')}
        >
          {view === 'chart' ? '표로 보기' : '차트로 보기'}
        </Button>
      </div>

      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-normal">
                  날짜
                </th>
                {shown.map((s) => (
                  <th key={s.key} scope="col" className="py-2 pr-4 text-right font-normal">
                    {s.label}
                  </th>
                ))}
                <th scope="col" className="py-2 text-right font-normal">
                  합계
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.map((datum, index) => (
                <tr key={datum.label} className="border-b border-border">
                  <th scope="row" className="py-2 pr-4 text-left font-normal">
                    {datum.label}
                  </th>
                  {shown.map((s) => (
                    <td key={s.key} className="py-2 pr-4 text-right">
                      {formatValue(datum.values[s.key] ?? 0)}
                    </td>
                  ))}
                  <td className="py-2 text-right font-semibold">{formatValue(totals[index] ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={containerRef} className="relative w-full" style={{ height }} onPointerLeave={() => setActive(null)}>
          {width > 0 ? (
            <svg width={width} height={height} role="group" aria-label={title} className="overflow-visible">
              {ticks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={AXIS_LEFT}
                    x2={width}
                    y1={y(tick)}
                    y2={y(tick)}
                    stroke={tick === 0 ? 'var(--actoz-color-chart-axis)' : 'var(--actoz-color-chart-grid)'}
                    strokeWidth={1}
                    shapeRendering="crispEdges"
                  />
                  <text
                    x={AXIS_LEFT - 8}
                    y={y(tick)}
                    dy="0.32em"
                    textAnchor="end"
                    className="fill-muted-foreground text-caption tabular-nums"
                  >
                    {tick.toLocaleString('ko-KR')}
                  </text>
                </g>
              ))}

              {data.map((datum, index) => {
                const cx = AXIS_LEFT + band * index + band / 2;
                let acc = 0;
                const segments = shown
                  .map((s, i) => ({ s, i, value: datum.values[s.key] ?? 0 }))
                  .filter((segment) => segment.value > 0);
                const lastIndex = segments.length - 1;
                const isActive = active?.index === index;
                return (
                  <g
                    key={datum.label}
                    tabIndex={0}
                    role="img"
                    aria-label={`${datum.label} 합계 ${formatValue(totals[index] ?? 0)}. ${segments
                      .map((segment) => `${segment.s.label} ${formatValue(segment.value)}`)
                      .join(', ')}`}
                    onPointerEnter={showTooltip(index)}
                    onFocus={showTooltip(index)}
                    onBlur={() => setActive(null)}
                    className="cursor-default outline-none"
                  >
                    {/* 막대보다 넓은 투명 히트 영역 */}
                    <rect x={cx - band / 2} y={TOP} width={band} height={plotHeight} fill="transparent" />
                    {isActive ? (
                      <rect x={cx - band / 2} y={TOP} width={band} height={plotHeight} className="fill-muted" />
                    ) : null}
                    {segments.map((segment, k) => {
                      const top = y(acc + segment.value);
                      const bottom = y(acc);
                      acc += segment.value;
                      // 쌓인 구간 사이는 배경색 2px 틈으로 나눈다 (테두리를 그리지 않는다).
                      const gap = k === 0 ? 0 : GAP;
                      const h = Math.max(0, bottom - top - gap);
                      const x = cx - barWidth / 2;
                      return k === lastIndex ? (
                        <path key={segment.s.key} d={topRoundedRect(x, top, barWidth, h, RADIUS)} fill={SERIES_COLORS[segment.i]} />
                      ) : (
                        <rect key={segment.s.key} x={x} y={top} width={barWidth} height={h} fill={SERIES_COLORS[segment.i]} />
                      );
                    })}
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

          {active && activeDatum ? (
            <div
              role="presentation"
              className="pointer-events-none absolute top-0 z-10 min-w-40 rounded-md border border-border bg-popover px-3 py-2 shadow-popover"
              style={{
                left: Math.min(Math.max(active.x + 16, 0), Math.max(0, width - 180)),
              }}
            >
              <p className="text-body-sm font-semibold text-foreground">
                {activeDatum.label} · {formatValue(totals[active.index] ?? 0)}
              </p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {shown.map((s, i) => (
                  <li key={s.key} className="flex items-center justify-between gap-4 text-caption">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: SERIES_COLORS[i] }} />
                      {s.label}
                    </span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatValue(activeDatum.values[s.key] ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </figure>
  );
}
