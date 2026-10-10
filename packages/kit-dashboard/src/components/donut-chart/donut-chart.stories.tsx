import type { Meta, StoryObj } from '@storybook/react-vite';

import { DonutChart } from './donut-chart';

const meta = {
  title: 'Dashboard/DonutChart',
  component: DonutChart,
  tags: ['autodocs', 'kit:dashboard'],
  args: {
    title: '서비스별 요청 비율',
    centerLabel: '이번 달 요청',
    items: [
      { key: 'guide', label: '사내 가이드 챗', value: 4820 },
      { key: 'minutes', label: '회의록 생성', value: 1310 },
      { key: 'review', label: '문서 검토', value: 690 },
      { key: 'newsletter', label: '뉴스레터', value: 420 },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 가운데 합계, 범례에 비율. 조각에 마우스를 올리면 가운데가 그 항목으로 바뀐다. */
export const Default: Story = {};

/** 항목이 6개를 넘으면 앞의 5개만 두고 나머지를 "기타"로 묶는다. */
export const GroupsOthers: Story = {
  args: {
    items: [
      { key: 'guide', label: '사내 가이드 챗', value: 4820 },
      { key: 'minutes', label: '회의록 생성', value: 1310 },
      { key: 'review', label: '문서 검토', value: 690 },
      { key: 'newsletter', label: '뉴스레터', value: 420 },
      { key: 'ith', label: 'ITH', value: 260 },
      { key: 'royalty', label: 'IP 로열티 정산', value: 90 },
      { key: 'fund', label: '자금 일보', value: 70 },
    ],
  },
};
