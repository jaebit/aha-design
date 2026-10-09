import type { Meta, StoryObj } from '@storybook/react-vite';

import { RiskItem } from './risk-item';

const meta = {
  title: 'AI/RiskItem',
  component: RiskItem,
  tags: ['autodocs'],
  args: {
    severity: '높음',
    tone: 'critical',
    title: '일방적 해지 시 위약금 없음',
    source: { name: '제12조 (해지)', href: '#clause-12' },
    children: '수급사가 30일 전 통보만으로 해지할 수 있어요. 상호 해지 조건과 위약금 조항 추가를 제안해요.',
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RiskItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 심각도 높음 (13쪽). */
export const High: Story = {};

/** 심각도 보통 (13쪽). */
export const Medium: Story = {
  args: {
    severity: '보통',
    title: '추가 비용 부담 주체 불명확',
    source: { name: '제8조 (비용)', href: '#clause-8' },
    children: '범위 변경 시 비용 부담 주체가 없어요. 사전 서면 합의 조건을 넣는 것을 제안해요.',
  },
};
