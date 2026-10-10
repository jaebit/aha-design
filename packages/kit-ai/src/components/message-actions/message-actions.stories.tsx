import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { type MessageFeedback } from '@aha/kit-ai';

import { MessageActions } from './message-actions';

const meta = {
  title: 'AI/MessageActions',
  component: MessageActions,
  tags: ['autodocs', 'kit:ai'],
  args: { onCopy: fn(), onFeedbackChange: fn() },
} satisfies Meta<typeof MessageActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 복사, 좋아요, 싫어요 (5쪽). */
export const Default: Story = {};

/** '도움이 안 됐어요'를 누른 상태. */
export const Disliked: Story = { args: { feedback: 'down' } };

/** 누르면 상태가 바뀌고, 같은 버튼을 다시 누르면 취소된다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [feedback, setFeedback] = useState<MessageFeedback>(null);
    return (
      <MessageActions
        {...args}
        feedback={feedback}
        onFeedbackChange={(next) => {
          args.onFeedbackChange?.(next);
          setFeedback(next);
        }}
      />
    );
  },
};

/** 복사만 있는 경우. 피드백을 받지 않는 서비스. */
export const CopyOnly: Story = { args: { onFeedbackChange: undefined } };
