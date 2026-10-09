import type { Meta, StoryObj } from '@storybook/react-vite';

import { BarList } from './bar-list';

const meta = {
  title: 'Data/BarList',
  component: BarList,
  tags: ['autodocs'],
  args: {
    label: '서비스별 이용 건수',
    items: [
      { label: '사내 가이드 챗', value: 642 },
      { label: '뉴스레터', value: 410 },
      { label: '회의록 생성', value: 228 },
      { label: '문서 검토', value: 104 },
      { label: 'ITH', value: 96 },
      { label: '기타', value: 24 },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 서비스별 이용 (20쪽). 큰 값 순으로 정렬해서 넘긴다. */
export const ServiceUsage: Story = {};
