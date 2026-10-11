import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Switch } from './switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'AI 소식 구독', checked: true, onCheckedChange: fn(), stateLabels: { on: '구독 중', off: '구독 안 함' } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 구독 중 (14쪽). */
export const On: Story = {};

/** 구독하지 않음. */
export const Off: Story = { args: { checked: false } };

/** 누르면 바로 바뀐다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <Switch
        {...args}
        checked={checked}
        onCheckedChange={(next) => {
          args.onCheckedChange(next);
          setChecked(next);
        }}
      />
    );
  },
};

/** 바꿀 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true } };
