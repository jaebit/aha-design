import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Suggestions } from './suggestions';

const meta = {
  title: 'AI/Suggestions',
  component: Suggestions,
  tags: ['autodocs'],
  args: { onSelect: fn() },
} satisfies Meta<typeof Suggestions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 빈 상태의 예시 질문 (3쪽). 가운데 정렬. */
export const EmptyState: Story = {
  args: { items: ['연차 이월 규정', '법인카드 증빙 서류', '사무용품 신청 방법'], align: 'center' },
};

/** 답변 뒤 후속 질문 (5쪽). 왼쪽 정렬. */
export const FollowUp: Story = {
  args: { items: ['회식비 1인당 한도는 얼마야?', '영수증을 잃어버리면 어떻게 해?'] },
};
