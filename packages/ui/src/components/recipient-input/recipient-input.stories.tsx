import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button, Card } from '@aha/ui';

import { RecipientInput } from './recipient-input';

const meta = {
  title: 'AI/RecipientInput',
  component: RecipientInput,
  tags: ['autodocs'],
  args: { label: '받는 사람', value: ['이아하', '박팀장'], onValueChange: fn() },
} satisfies Meta<typeof RecipientInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 받는 사람 칩 (11쪽). */
export const Default: Story = {};

/** 추가 · 삭제가 동작한다. "+ 추가"를 눌러 이름을 입력하고 Enter. */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <RecipientInput
        {...args}
        value={value}
        onValueChange={(next) => {
          args.onValueChange(next);
          setValue(next);
        }}
      />
    );
  },
};

/** 메일 발송 카드 (11쪽 3/3 단계): 받는 사람 + 보내기 버튼. 지금 행동해야 하므로 강조 카드에 넣는다. */
export const MailSendCard: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <Card variant="emphasis" className="flex max-w-3xl flex-col gap-4">
        <RecipientInput {...args} value={value} onValueChange={setValue} />
        <div className="flex gap-2">
          <Button disabled={value.length === 0}>메일 보내기</Button>
          <Button variant="secondary">나중에 보내기</Button>
        </div>
      </Card>
    );
  },
};
