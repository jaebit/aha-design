import type { Meta, StoryObj } from '@storybook/react-vite';

import { FileSlots } from './file-slots';

const meta = {
  title: 'Settlement/FileSlots',
  component: FileSlots,
  tags: ['autodocs', 'kit:settlement'],
  args: {
    title: '필수 자료',
    slots: [
      { name: '계약서', received: true },
      { name: '판매 보고서', received: true },
      { name: '환율 증빙', received: false },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileSlots>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 일부만 받은 상태. */
export const Partial: Story = {};

/** 모두 받은 상태. */
export const AllReceived: Story = {
  args: {
    slots: [
      { name: '계약서', received: true },
      { name: '판매 보고서', received: true },
      { name: '환율 증빙', received: true },
    ],
  },
};

/** 하나도 받지 못한 상태. */
export const NoneReceived: Story = {
  args: {
    slots: [
      { name: '계약서', received: false },
      { name: '판매 보고서', received: false },
      { name: '환율 증빙', received: false },
    ],
  },
};
