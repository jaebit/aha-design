import type { Meta, StoryObj } from '@storybook/react-vite';

import { NativeSelect } from './native-select';

const meta = {
  title: 'Components/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  args: {
    'aria-label': '서비스군',
    children: (
      <>
        <option value="">전체 서비스군</option>
        <option value="game">게임</option>
        <option value="billing">결제</option>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-60">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 서비스군 필터 (15쪽). */
export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
