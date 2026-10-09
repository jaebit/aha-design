import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { PreviewCard } from './preview-card';

const meta = {
  title: 'AI/PreviewCard',
  component: PreviewCard,
  tags: ['autodocs'],
  args: {
    title: '음성 원문 미리보기',
    lines: ['[화자 A] 지난주 베타 피드백부터 정리할게요.', '[화자 B] 가이드 챗 근거 표시가 좋다는 의견이 많았어요.'],
    moreLabel: '원문 전체 보기',
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 음성 원문 미리보기 (11쪽). 화면 안에서 전체 원문을 연다. */
export const Transcript: Story = { args: { onMore: fn() } };

/** 전체 보기가 별도 주소일 때. */
export const WithLink: Story = { args: { moreHref: '#transcript' } };
