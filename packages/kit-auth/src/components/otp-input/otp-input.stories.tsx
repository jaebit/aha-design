import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { OtpInput } from './otp-input';

const meta = {
  title: 'Auth/OtpInput',
  component: OtpInput,
  tags: ['autodocs', 'kit:auth'],
  args: { onChange: fn(), onComplete: fn() },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 빈 6자리 칸. 숫자를 붙여넣으면 한 번에 채워진다. */
export const Default: Story = {};

/** 일부 입력한 상태. */
export const Partial: Story = { args: { defaultValue: '482' } };

/** 코드가 틀렸을 때. 오류 문구는 FormField `error`로 함께 보여준다. */
export const Invalid: Story = { args: { defaultValue: '482913', 'aria-invalid': true } };

/** 확인 중에는 입력을 막는다. */
export const Disabled: Story = { args: { defaultValue: '482913', disabled: true } };

/** 제어 모드. 다 채우면 `onComplete`로 확인을 시작한다. */
export const Controlled: Story = {
  render: function Render(args) {
    const [code, setCode] = useState('');
    return (
      <div className="flex flex-col gap-3">
        <OtpInput
          {...args}
          value={code}
          onChange={(next) => {
            setCode(next);
            args.onChange?.(next);
          }}
        />
        <p className="text-body-sm text-muted-foreground">입력한 값: {code || '없음'}</p>
      </div>
    );
  },
};
