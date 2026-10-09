import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartColumn, FileSearch, History, Mail, MessageSquareText, Mic, ReceiptText, Wallet } from 'lucide-react';
import { fn } from 'storybook/test';

import { AccountMenu } from '@aha/ui';

import { NavRail } from './nav-rail';

const meta = {
  title: 'Shell/NavRail',
  component: NavRail,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  // 예시 데이터는 MCP 예제 코드에 그대로 보이도록 스토리 안에 직접 적는다 (fixtures를 import하지 않는다).
  args: {
    items: [
      { id: 'guide-chat', label: '사내 가이드 챗', icon: <MessageSquareText />, href: '#guide-chat' },
      { id: 'meeting-minutes', label: '회의록 생성', icon: <Mic />, href: '#meeting-minutes' },
      { id: 'document-review', label: '문서 검토', icon: <FileSearch />, href: '#document-review' },
      { id: 'newsletter', label: '뉴스레터 구독', icon: <Mail />, href: '#newsletter' },
      { id: 'ith', label: 'ITH', icon: <ChartColumn />, href: '#ith' },
      { id: 'ip-royalty', label: 'IP 로열티 정산', icon: <ReceiptText />, href: '#ip-royalty' },
      { id: 'daily-cash', label: '자금 일보', icon: <Wallet />, href: '#daily-cash' },
    ],
    bottomItems: [{ id: 'history', label: '전체 기록', icon: <History />, href: '#history' }],
    onNavigate: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex h-[720px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 넓은 레일: 로고 + 라벨 + 이름이 보이는 계정 영역. 홈 화면 (1쪽). */
export const Expanded: Story = {
  args: {
    expanded: true,
    account: <AccountMenu name="김하마" team="팀아하" email="hama@actoz.com" initials="하마" expanded onAdminSettings={fn()} onLogout={fn()} />,
  },
};

/** 좁은 레일: 아이콘만, 라벨은 툴팁. 서비스 화면 (3쪽). */
export const Collapsed: Story = {
  args: {
    activeId: 'guide-chat',
    account: <AccountMenu name="김하마" team="팀아하" email="hama@actoz.com" initials="하마" onAdminSettings={fn()} onLogout={fn()} />,
  },
};
