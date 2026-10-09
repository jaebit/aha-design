import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from './avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { initials: '하마', alt: '김하마' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 이니셜 아바타. 내비 레일 하단 (1쪽). */
export const Initials: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};
