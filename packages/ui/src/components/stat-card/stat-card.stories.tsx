import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatCard } from './stat-card';

const meta = {
  title: 'Data/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  args: { label: '요청 수', value: '1,284', delta: { value: '+12%', direction: 'up', period: '지난달 대비' } },
  decorators: [
    (Story) => (
      <div className="max-w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 지난달 대비 변화가 있는 지표 (20쪽 요청 수). */
export const WithDelta: Story = {};

/** 보조 정보 한 줄 (20쪽 성공률 · 예상 비용). */
export const WithHint: Story = { args: { label: '성공률', value: '98.2%', delta: undefined, hint: '실패 23건' } };

/** 관리자 화면의 KPI 한 줄 (20쪽). */
export const KpiRow: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-5xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="요청 수" value="1,284" delta={{ value: '+12%', direction: 'up', period: '지난달 대비' }} />
      <StatCard label="이용자 수" value="86명" delta={{ value: '−3%', direction: 'down', period: '지난달 대비' }} />
      <StatCard label="성공률" value="98.2%" hint="실패 23건" />
      <StatCard label="예상 비용" value="약 $42.10" hint="토큰 3,512,000" />
    </div>
  ),
};
