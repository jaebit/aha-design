import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { type Period } from '@actoz/kit-dashboard';

import { PeriodPicker } from './period-picker';

const meta = {
  title: 'Dashboard/PeriodPicker',
  component: PeriodPicker,
  tags: ['autodocs', 'kit:dashboard'],
  args: {
    today: '2026-10-10',
    value: { preset: '7d', from: '2026-10-04', to: '2026-10-10' },
    onChange: fn(),
  },
} satisfies Meta<typeof PeriodPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 최근 7일. 칩을 누르면 기간이 바뀌고 오른쪽 글도 따라 바뀐다. */
export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<Period>(args.value);
    return (
      <PeriodPicker
        {...args}
        value={value}
        onChange={(next) => {
          args.onChange(next);
          setValue(next);
        }}
      />
    );
  },
};

/** 직접 선택: 시작일과 종료일을 넣는다. */
export const Custom: Story = { args: { value: { preset: 'custom', from: '2026-09-15', to: '2026-10-10' } } };

/** 시작일이 종료일보다 늦으면 입력 테두리와 문구로 알려준다. */
export const InvalidRange: Story = { args: { value: { preset: 'custom', from: '2026-10-12', to: '2026-10-01' } } };

/** 프리셋을 줄인 경우. */
export const FewPresets: Story = { args: { presets: ['7d', '30d', 'month'] } };
