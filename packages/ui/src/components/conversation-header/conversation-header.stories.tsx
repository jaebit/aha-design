import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelLeftOpen, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '@aha/ui';

import { ConversationHeader } from './conversation-header';

const meta = {
  title: 'Shell/ConversationHeader',
  component: ConversationHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    title: '연차 이월 · 회식비 증빙 문의',
    onRename: fn(),
    onPinnedChange: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof ConversationHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 (5쪽). 오른쪽 더보기 메뉴에 이름 변경 · 고정 · 삭제. */
export const Default: Story = {};

/** 사이드바를 접었을 때 (6쪽): 펼치기 · 새 대화 버튼과 서비스 브레드크럼. */
export const SidebarCollapsed: Story = {
  args: {
    serviceName: '사내 가이드 챗',
    leading: (
      <>
        <Button variant="ghost" size="icon" aria-label="사이드바 펼치기">
          <PanelLeftOpen />
        </Button>
        <Button variant="ghost" size="icon" aria-label="새 대화">
          <SquarePen />
        </Button>
      </>
    ),
  },
};

/** 메뉴에서 이름 변경 → Enter 저장 / Esc 취소, 대화 고정·해제가 실제로 동작한다 (7, 8쪽). */
export const Interactive: Story = {
  render: function Render(args) {
    const [title, setTitle] = useState(args.title);
    const [pinned, setPinned] = useState(false);
    return (
      <ConversationHeader
        {...args}
        title={title}
        pinned={pinned}
        onRename={(next) => {
          args.onRename?.(next);
          setTitle(next);
        }}
        onPinnedChange={(next) => {
          args.onPinnedChange?.(next);
          setPinned(next);
        }}
      />
    );
  },
};
