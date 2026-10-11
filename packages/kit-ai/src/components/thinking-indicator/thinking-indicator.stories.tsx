import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThinkingIndicator } from './thinking-indicator';

const meta = {
  title: 'AI/ThinkingIndicator',
  component: ThinkingIndicator,
  tags: ['autodocs', 'kit:ai'],
} satisfies Meta<typeof ThinkingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 문구. 답변을 만드는 동안 메시지 자리에 보여준다. */
export const Default: Story = {};

/** 작업별로 구체적인 문구를 쓴다. */
export const MeetingMinutes: Story = { args: { label: '음성 원문을 만들고 있어요' } };
