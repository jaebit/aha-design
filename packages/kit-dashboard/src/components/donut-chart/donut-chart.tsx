import { useId, useState } from 'react';

import { cn } from '@aha/ui';

import { ChartHeader, defaultFormat, SERIES_COLORS } from '../../lib/chart';

export interface DonutChartItem {
  key: string;
  /** 범례와 표에 보이는 이름. 예: "사내 가이드 챗". */
  label: string;
  value: number;
}

export interface DonutChartProps {
  /** 스크린리더와 표 보기의 제목. 예: "서비스별 요청 비율". */
  title: string;
  /** 큰 값부터 정렬해서 넘긴다. 6개를 넘으면 5개만 두고 나머지를 "기타"로 묶는다. */
  items: DonutChartItem[];
  /** 가운데 합계 아래 문구. 예: "이번 달 요청". */
  centerLabel?: string;
  /** 값 표시 형식. 기본은 "1,234건". */
  formatValue?: (value: number) => string;
  /** 도넛 지름(px). */
  size?: number;
  className?: string;
}

const MAX_ITEMS = SERIES_COLORS.length;

/** 6개를 넘으면 앞의 5개 + "기타". */
function groupItems(items: DonutChartItem[]) {
  if (items.length <= MAX_ITEMS) return items;
  const head = items.slice(0, MAX_ITEMS - 1);
  const rest = items.slice(MAX_ITEMS - 1).reduce((sum, item) => sum + item.value, 0);
  return [...head, { key: '__other', label: '기타', value: rest }];
}

/**
 * 전체에서 각 부분이 차지하는 비율을 보여주는 도넛 차트 (서비스별 요청 비율 등).
 *
 * - 가운데에 합계, 범례에 값과 비율을 함께 적는다. 비율은 색만으로 읽히지 않게 숫자로도 보여준다.
 * - 조각은 6개까지. 넘으면 "기타"로 묶는다. 시간에 따른 변화는 LineChart를 쓴다.
 */
export function DonutChart({ title, items, centerLabel, formatValue = defaultFormat, size = 180, className }: DonutChartProps) {
  const titleId = useId();
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const [active, setActive] = useState<string | null>(null);
  const grouped = groupItems(items);
  const total = grouped.reduce((sum, item) => sum + item.value, 0);
  const percent = (value: number) => (total > 0 ? Math.round((value / total) * 1000) / 10 : 0);

  const stroke = Math.max(14, size * 0.14);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // 조각 사이 틈 (배경색). 아주 작은 조각도 보이도록 최소 길이를 둔다.
  const gap = grouped.filter((item) => item.value > 0).length > 1 ? 2 : 0;
  let offset = 0;
  const arcs = grouped.map((item, index) => {
    const length = total > 0 ? (item.value / total) * circumference : 0;
    const arc = { item, color: SERIES_COLORS[index]!, start: offset, length: Math.max(0, length - gap) };
    offset += length;
    return arc;
  });
  const activeItem = grouped.find((item) => item.key === active);

  return (
    <figure data-slot="donut-chart" aria-labelledby={titleId} className={cn('relative flex flex-col gap-4', className)}>
      <figcaption id={titleId} className="sr-only">
        {title}
      </figcaption>
      <ChartHeader
        items={grouped.map((item, i) => ({
          key: item.key,
          label: item.label,
          color: SERIES_COLORS[i]!,
          detail: `${percent(item.value)}%`,
        }))}
        view={view}
        onViewChange={setView}
      />

      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-normal">
                  항목
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-normal">
                  값
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  비율
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {grouped.map((item) => (
                <tr key={item.key} className="border-b border-border">
                  <th scope="row" className="py-2 pr-4 text-left font-normal">
                    {item.label}
                  </th>
                  <td className="py-2 pr-4 text-right">{formatValue(item.value)}</td>
                  <td className="py-2 text-right">{percent(item.value)}%</td>
                </tr>
              ))}
              <tr>
                <th scope="row" className="py-2 pr-4 text-left font-semibold">
                  합계
                </th>
                <td className="py-2 pr-4 text-right font-semibold">{formatValue(total)}</td>
                <td className="py-2 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="relative" style={{ width: size, height: size }} onPointerLeave={() => setActive(null)}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="group" aria-label={title} className="-rotate-90">
              <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-muted" strokeWidth={stroke} />
              {arcs.map((arc) =>
                arc.length > 0 ? (
                  <circle
                    key={arc.item.key}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth={active === arc.item.key ? stroke + 4 : stroke}
                    strokeDasharray={`${arc.length} ${circumference - arc.length}`}
                    strokeDashoffset={-arc.start}
                    tabIndex={0}
                    role="img"
                    aria-label={`${arc.item.label} ${formatValue(arc.item.value)}, ${percent(arc.item.value)}%`}
                    onPointerEnter={() => setActive(arc.item.key)}
                    onFocus={() => setActive(arc.item.key)}
                    onBlur={() => setActive(null)}
                    className="cursor-default outline-none transition-[stroke-width]"
                  />
                ) : null,
              )}
            </svg>
            <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              {activeItem ? (
                <>
                  <span className="text-caption text-muted-foreground">{activeItem.label}</span>
                  <span className="text-heading font-semibold tabular-nums">{percent(activeItem.value)}%</span>
                  <span className="text-caption text-muted-foreground tabular-nums">{formatValue(activeItem.value)}</span>
                </>
              ) : (
                <>
                  <span className="text-heading font-semibold tabular-nums">{formatValue(total)}</span>
                  {centerLabel ? <span className="text-caption text-muted-foreground">{centerLabel}</span> : null}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
