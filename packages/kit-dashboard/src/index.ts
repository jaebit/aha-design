// 대시보드 키트. 공통 부품(@aha/ui)의 StatCard·BarList·StackedColumnChart 위에 시계열·비율·분포 차트와 위젯 배치를 둔다.

// 차트
export { DonutChart, type DonutChartItem, type DonutChartProps } from './components/donut-chart/donut-chart';
export { Heatmap, type HeatmapProps } from './components/heatmap/heatmap';
export { LineChart, type LineChartDatum, type LineChartProps } from './components/line-chart/line-chart';

// 기간 · 배치
export {
  type Period,
  PeriodPicker,
  type PeriodPickerProps,
  type PeriodPreset,
  periodOf,
} from './components/period-picker/period-picker';
export { Widget, WidgetGrid, type WidgetGridProps, type WidgetProps } from './components/widget-grid/widget-grid';
