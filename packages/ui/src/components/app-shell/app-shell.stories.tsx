import type { Meta, StoryObj } from '@storybook/react-vite';
import { History, Mail, MessageSquareText, Mic } from 'lucide-react';
import { fn } from 'storybook/test';

import { AccountMenu, HistoryItem, NavRail, PageHeader, ServiceSidebar, SidebarSection } from '@actoz/ui';

import { AppShell } from './app-shell';

const meta = {
  title: 'Shell/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  // 화면 높이(h-dvh)를 채우는 뼈대라 문서 페이지에서도 iframe으로 그린다.
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 640 } } },
  // 예시 데이터는 MCP 예제 코드에 그대로 보이도록 스토리 안에 직접 적는다 (fixtures를 import하지 않는다).
  args: {
    rail: (
      <NavRail
        items={[
          { id: 'guide-chat', label: '사내 가이드 챗', icon: <MessageSquareText />, href: '#guide-chat' },
          { id: 'meeting-minutes', label: '회의록 생성', icon: <Mic />, href: '#meeting-minutes' },
          { id: 'newsletter', label: '뉴스레터 구독', icon: <Mail />, href: '#newsletter' },
        ]}
        bottomItems={[{ id: 'history', label: '전체 기록', icon: <History />, href: '#history' }]}
        activeId="guide-chat"
        onNavigate={fn()}
        account={<AccountMenu name="김하마" team="팀아하" email="hama@actoz.com" initials="하마" onAdminSettings={fn()} onLogout={fn()} />}
      />
    ),
    children: null,
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 서비스 화면: 좁은 레일 + 서비스 사이드바 + 본문 (3쪽). */
export const WithSidebar: Story = {
  args: {
    sidebar: (
      <ServiceSidebar title="사내 가이드 챗" onCollapse={fn()} newAction={{ label: '새 대화', onClick: fn() }}>
        <SidebarSection title="최근 기록">
          <HistoryItem href="#c1" meta="오늘 09:40" title="연차 이월 · 회식비 증빙 문의" active />
          <HistoryItem href="#c2" meta="10/02" title="사무용품 신청 방법" />
        </SidebarSection>
      </ServiceSidebar>
    ),
    children: (
      <div className="flex flex-col gap-6 p-8">
        <PageHeader title="사내 가이드 챗" description="사내 규정과 안내 문서에서 답을 찾아드려요." />
      </div>
    ),
  },
};

/** 사이드바가 없는 화면: 레일 + 본문. 전체 기록·뉴스레터 (2, 14쪽). */
export const RailOnly: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-6 p-8">
        <PageHeader title="전체 기록" description="모든 서비스에서 나눈 대화를 한곳에서 찾아보세요." />
      </div>
    ),
  },
};
