import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heatmap } from './heatmap';

const days = ['월', '화', '수', '목', '금', '토', '일'];
const hours = Array.from({ length: 24 }, (_, h) => `${h}시`);
// 평일 업무 시간에 몰리고 점심(12시)에 잠깐 줄어드는 예시 값.
const usage = days.map((_, d) =>
  hours.map((_, h) => {
    if (d >= 5) return h >= 10 && h <= 17 ? 2 + ((h * 3) % 5) : 0;
    if (h < 8 || h > 19) return h === 7 || h === 20 ? 3 : 0;
    return h === 12 ? 18 : 30 + ((h * 7 + d * 5) % 25);
  }),
);

const meta = {
  title: 'Dashboard/Heatmap',
  component: Heatmap,
  tags: ['autodocs', 'kit:dashboard'],
  args: {
    title: '요일·시간대별 요청',
    rows: days,
    columns: hours,
    values: usage,
    rowHeader: '요일',
  },
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 요일 × 시간대. 평일 업무 시간에 몰리고 점심에 줄어든다. 칸에 마우스를 올리면 값이 보인다. */
export const WeeklyUsage: Story = {};

/** 열이 적으면 모든 라벨을 보여준다. */
export const FewColumns: Story = {
  args: {
    title: '팀·서비스별 사용',
    rows: ['팀아하', '플랫폼팀', '재무팀'],
    columns: ['가이드 챗', '회의록', '문서 검토', 'ITH'],
    values: [
      [120, 40, 12, 0],
      [80, 22, 30, 15],
      [10, 4, 56, 2],
    ],
    rowHeader: '팀',
  },
};
