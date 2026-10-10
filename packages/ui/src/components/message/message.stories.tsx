import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import {
  Button,
  Callout,
  Citation,
  MessageActions,
  MessageContent,
  type MessageFeedback,
  Suggestions,
  ThinkingIndicator,
} from '@aha/ui';

import { Message } from './message';

const meta = {
  title: 'AI/Message',
  component: Message,
  tags: ['autodocs', 'kit:ai'],
  decorators: [
    (Story) => (
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사용자 질문. 오른쪽 회색 말풍선 (5쪽). */
export const User: Story = {
  args: { from: 'user' },
  render: (args) => (
    <Message {...args}>
      <MessageContent>올해 못 쓴 연차, 내년으로 이월할 수 있어?</MessageContent>
    </Message>
  ),
};

/** AI 답변: 요약 → 목록 → 근거 → 액션 바 (5쪽 첫 번째 답변). */
export const Assistant: Story = {
  args: { from: 'assistant' },
  render: function Render(args) {
    const [feedback, setFeedback] = useState<MessageFeedback>(null);
    return (
      <Message {...args}>
        <MessageContent>
          <p>올해 못 쓴 연차는 최대 5일까지 내년으로 이월할 수 있어요.</p>
          <ul>
            <li>이월하려면 12월 15일까지 인사 시스템에서 신청해야 해요.</li>
            <li>이월한 연차는 내년 6월 30일까지 써야 해요.</li>
            <li>이월하지 않은 연차는 연차 수당으로 정산돼요.</li>
          </ul>
        </MessageContent>
        <Citation source="인사 규정 · 연차휴가 조항" href="#guide" />
        <MessageActions onCopy={fn()} feedback={feedback} onFeedbackChange={setFeedback} />
      </Message>
    );
  },
};

/** 판단이 어려운 답변: 근거 아래 담당 부서 연결과 후속 질문을 붙인다 (5쪽 두 번째 답변). */
export const AssistantWithHandoff: Story = {
  args: { from: 'assistant' },
  render: (args) => (
    <Message {...args}>
      <MessageContent>
        <p>법인카드로 팀 회식비를 결제했다면 아래 증빙이 필요해요.</p>
        <ul>
          <li>카드 매출전표와 참석자 명단</li>
          <li>결제일로부터 7일 안에 경비 시스템에 제출</li>
          <li>1인당 한도를 넘으면 사전 승인 필요</li>
        </ul>
      </MessageContent>
      <Citation source="경비 처리 지침" href="#guide" />
      <Callout action={<Button variant="secondary">담당 부서에 문의</Button>}>
        사내 가이드만으로 판단이 어려우면 담당 부서에 바로 문의할 수 있어요.
      </Callout>
      <MessageActions onCopy={fn()} onFeedbackChange={fn()} />
      <Suggestions items={['회식비 1인당 한도는 얼마야?', '영수증을 잃어버리면 어떻게 해?']} onSelect={fn()} />
    </Message>
  ),
};

/** 여러 단계로 진행되는 작업의 단계 배지 (11, 13쪽). */
export const AssistantWithStep: Story = {
  args: { from: 'assistant', step: '1/2 문서 읽기' },
  render: (args) => (
    <Message {...args}>
      <MessageContent>
        <p>문서를 읽었어요. 18쪽 분량의 용역계약서예요.</p>
        <p>어떤 기준으로 검토할까요?</p>
      </MessageContent>
    </Message>
  ),
};

/** 응답을 만드는 중. 본문이 오기 시작하면 표시를 지운다. */
export const AssistantThinking: Story = {
  args: { from: 'assistant' },
  render: (args) => (
    <Message {...args}>
      <ThinkingIndicator label="사내 가이드에서 찾고 있어요" />
    </Message>
  ),
};
