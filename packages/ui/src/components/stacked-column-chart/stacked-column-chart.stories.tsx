import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from '@aha/ui';

import { StackedColumnChart } from './stacked-column-chart';

const services = [
  { key: 'guide', label: '사내 가이드 챗' },
  { key: 'minutes', label: '회의록 생성' },
  { key: 'review', label: '문서 검토' },
  { key: 'newsletter', label: '뉴스레터' },
  { key: 'ith', label: 'ITH' },
  { key: 'etc', label: '기타' },
];

// 결정적인 예시 데이터 (스토리를 다시 열어도 같은 그림).
const daily = Array.from({ length: 14 }, (_, i) => {
  const wave = (n: number) => Math.round(n * (1 + 0.35 * Math.sin(i * 0.9 + n)));
  return {
    label: `10/${String(i + 1).padStart(2, '0')}`,
    values: { guide: wave(24), minutes: wave(9), review: wave(4), newsletter: 14, ith: wave(3), etc: i % 3 },
  };
});

const meta = {
  title: 'Data/StackedColumnChart',
  component: StackedColumnChart,
  tags: ['autodocs'],
  args: { title: '일별 요청 수', series: services, data: daily },
  decorators: [
    (Story) => (
      <Card className="max-w-3xl">
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof StackedColumnChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 일별 요청 추이, 서비스별 색 구분 (20쪽). 막대에 마우스를 올리거나 Tab으로 이동하면 그날의 값이 나온다. */
export const DailyRequests: Story = {};

/** 시리즈가 적을 때. 색은 항상 chart-1부터 순서대로 배정된다. */
export const TwoSeries: Story = {
  args: {
    series: services.slice(0, 2),
    data: daily.slice(0, 7),
  },
};
