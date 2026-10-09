import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: { children: '카드 내용' },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 카드. 연한 테두리. */
export const Default: Story = {};

/** 강조 카드. 사용자가 지금 행동해야 하는 카드. */
export const Emphasis: Story = { args: { variant: 'emphasis' } };
