import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Badge } from '../badge/badge';
import { Citation } from '../citation/citation';
import { Composer } from '../composer/composer';
import { Message, MessageContent } from '../message/message';
import { SidePanel } from './side-panel';

const meta = {
  title: 'Shell/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="flex h-[640px] justify-end bg-subtle">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ITH 보고서 옆 대화 패널 (16쪽). */
export const ReportConversation: Story = {
  args: {
    title: '10/03 처리 메일 급증 원인',
    badge: <Badge>ITH</Badge>,
    onClose: fn(),
    footer: <Composer variant="compact" placeholder="메시지를 입력하세요" onSubmit={fn()} helper="대화는 전체 기록에 저장돼요" />,
    children: (
      <div className="flex flex-col gap-6">
        <Message from="user">
          <MessageContent>10월 3일 처리 메일이 왜 이렇게 많아?</MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            <p>10월 3일은 결제 서비스 오류 그룹이 평소보다 3배 늘어 처리 메일이 132건이었어요.</p>
          </MessageContent>
          <Citation source="2026-10-03 일일 오류 보고서" />
        </Message>
      </div>
    ),
  },
};
