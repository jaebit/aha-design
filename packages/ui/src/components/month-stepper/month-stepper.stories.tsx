import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { MonthStepper } from './month-stepper';

const meta = {
  title: 'Data/MonthStepper',
  component: MonthStepper,
  tags: ['autodocs'],
  args: { value: { year: 2026, month: 10 }, max: { year: 2026, month: 10 }, onValueChange: fn() },
} satisfies Meta<typeof MonthStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 이번 달 (20쪽). 다음 달 버튼은 비활성. */
export const CurrentMonth: Story = {};

/** 이전 달로 넘겨 볼 수 있다. 1월에서 이전을 누르면 전년도 12월이 된다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <MonthStepper {...args} value={value} onValueChange={setValue} />;
  },
};
