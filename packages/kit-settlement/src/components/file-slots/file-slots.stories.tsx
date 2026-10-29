import type { Meta, StoryObj } from '@storybook/react-vite';

import { FileSlots } from './file-slots';

const meta = {
  title: 'Settlement/FileSlots',
  component: FileSlots,
  tags: ['autodocs', 'kit:settlement'],
  args: {
    title: '1차 자료',
    slots: [
      { name: '구글', received: true },
      { name: '갤럭시', received: true },
      { name: '원스토어', received: true },
      { name: '애플', received: true },
      { name: 'now.gg', received: false },
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
      { name: '구글', received: true },
      { name: '갤럭시', received: true },
      { name: '원스토어', received: true },
      { name: '애플', received: true },
      { name: 'now.gg', received: true },
    ],
  },
};

/** 하나도 받지 못한 상태. */
export const NoneReceived: Story = {
  args: {
    slots: [
      { name: '구글', received: false },
      { name: '갤럭시', received: false },
      { name: '원스토어', received: false },
      { name: '애플', received: false },
      { name: 'now.gg', received: false },
    ],
  },
};
