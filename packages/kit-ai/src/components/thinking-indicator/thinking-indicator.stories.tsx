import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThinkingIndicator } from './thinking-indicator';

const meta = {
  title: 'AI/ThinkingIndicator',
  component: ThinkingIndicator,
  tags: ['autodocs', 'kit:ai'],
} satisfies Meta<typeof ThinkingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 작업별로 구체적인 문구를 쓴다. */
export const MeetingMinutes: Story = { args: { label: '음성 원문을 만들고 있어요' } };
