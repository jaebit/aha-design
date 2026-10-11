// 대시보드 키트 차트가 함께 쓰는 도구. 공통 StackedColumnChart와 같은 규칙을 따른다:
// 색은 chart-1부터 순서대로 6개까지, 범례는 항상 보이고, 모든 값은 "표로 보기"에서도 읽을 수 있다.
import { useEffect, useRef, useState } from 'react';

import { Button } from '@aha/ui';

// SVG 속성에는 Tailwind 클래스를 쓸 수 없어 토큰 CSS 변수를 직접 참조한다.
export const SERIES_COLORS = [
  'var(--aha-color-chart-1)',
  'var(--aha-color-chart-2)',
  'var(--aha-color-chart-3)',
  'var(--aha-color-chart-4)',
  'var(--aha-color-chart-5)',
  'var(--aha-color-chart-6)',
] as const;

export const AXIS_COLOR = 'var(--aha-color-chart-axis)';
export const GRID_COLOR = 'var(--aha-color-chart-grid)';

export const defaultFormat = (value: number) => `${value.toLocaleString('ko-KR')}건`;

/** 0부터 max를 덮는 깔끔한 눈금 (1·2·5 × 10^n 간격). */
export function niceTicks(max: number, count = 4) {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let value = 0; value <= max + step * 0.999; value += step) ticks.push(Math.round(value * 1e6) / 1e6);
  return ticks;
}

/** 요소 너비를 따라간다. 표 보기와 차트 보기를 오갈 때 다시 잰다. */
export function useWidth<T extends HTMLElement>(dependency: unknown) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width ?? 0));
    observer.observe(element);
    return () => observer.disconnect();
  }, [dependency]);
  return [ref, width] as const;
}

export interface LegendItem {
  key: string;
  label: string;
  color: string;
  /** 범례 옆에 보일 값. 예: "1,234건 · 38%". */
  detail?: string;
}

/** 차트 위 범례와 표/차트 전환 버튼. */
export function ChartHeader({
  items,
  view,
  onViewChange,
  shape = 'square',
}: {
  items: LegendItem[];
  view: 'chart' | 'table';
  onViewChange: (view: 'chart' | 'table') => void;
  /** 선 차트는 line, 나머지는 square. */
  shape?: 'square' | 'line';
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* 범례가 따로 없는 차트(Heatmap)는 빈 "범례" 목록을 그리지 않는다. 빈 자리로 표로 보기 버튼을 오른쪽에 둔다. */}
      {items.length === 0 ? (
        <span />
      ) : (
        <ul aria-label="범례" className="flex flex-wrap gap-x-4 gap-y-1">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
              <span
                aria-hidden
                className={shape === 'line' ? 'h-0.5 w-3 rounded-full' : 'size-2.5 rounded-sm'}
                style={{ background: item.color }}
              />
              {item.label}
              {item.detail ? <span className="text-foreground tabular-nums">{item.detail}</span> : null}
            </li>
          ))}
        </ul>
      )}
      <Button
        variant="link"
        size="sm"
        className="text-body-sm text-muted-foreground"
        aria-pressed={view === 'table'}
        onClick={() => onViewChange(view === 'chart' ? 'table' : 'chart')}
      >
        {view === 'chart' ? '표로 보기' : '차트로 보기'}
      </Button>
    </div>
  );
}
