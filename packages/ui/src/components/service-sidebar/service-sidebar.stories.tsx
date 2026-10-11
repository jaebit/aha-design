import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button, HistoryItem, SidebarSection } from '@actoz/ui';

import { ServiceSidebar } from './service-sidebar';

const meta = {
  title: 'Shell/ServiceSidebar',
  component: ServiceSidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { title: '사내 가이드 챗', onCollapse: fn(), newAction: { label: '새 대화', onClick: fn() } },
  decorators: [
    (Story) => (
      <div className="flex h-[640px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ServiceSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const allHistory = (
  <Button variant="link" size="sm" asChild className="text-caption text-muted-foreground">
    <a href="#history">전체 기록</a>
  </Button>
);

/** 사내 가이드 챗: 날짜가 위에 있는 기록 (5쪽). */
export const GuideChat: Story = {
  args: {
    children: (
      <SidebarSection title="최근 기록" action={allHistory}>
        <HistoryItem href="#c1" meta="오늘 09:40" title="연차 이월 · 회식비 증빙 문의" active />
        <HistoryItem href="#c2" meta="10/02" title="사무용품 신청 방법" />
      </SidebarSection>
    ),
  },
};

/** 고정된 대화가 있을 때: "고정됨" 섹션이 위에 생긴다 (8쪽). */
export const WithPinned: Story = {
  args: {
    children: (
      <>
        <SidebarSection title="고정됨">
          <HistoryItem href="#c1" meta="오늘 09:40" title="연차 이월 · 회식비 증빙 문의" pinned active />
        </SidebarSection>
        <SidebarSection title="최근 기록" action={allHistory}>
          <HistoryItem href="#c2" meta="10/02" title="사무용품 신청 방법" />
        </SidebarSection>
      </>
    ),
  },
};

/** 회의록 생성: 상태가 아래에 있는 기록 (11쪽). */
export const MeetingMinutes: Story = {
  args: {
    title: '회의록 생성',
    newAction: { label: '새 회의록', onClick: fn() },
    children: (
      <SidebarSection title="최근 기록" action={allHistory}>
        <HistoryItem href="#m1" metaPosition="bottom" meta="지금 · 메일 발송 대기" title="[주간 회의] 회의록" active />
        <HistoryItem href="#m2" metaPosition="bottom" meta="어제 · 메일 발송 완료" title="9/21 회의 액션아이템 정리" />
        <HistoryItem href="#m3" metaPosition="bottom" meta="10/01 · 회의록 생성 완료" title="주간 회의 회의록" />
      </SidebarSection>
    ),
  },
};
