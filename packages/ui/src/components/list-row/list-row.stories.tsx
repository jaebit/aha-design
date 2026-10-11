import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight } from 'lucide-react';

import { Badge, List } from '@actoz/ui';

import { ListRow } from './list-row';

const meta = {
  title: 'Components/ListRow',
  component: ListRow,
  tags: ['autodocs'],
  args: { href: '#c1', title: '연차 이월 · 회식비 증빙 문의' },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <List>
          <Story />
        </List>
      </div>
    ),
  ],
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 이어서 하기 (1쪽): 서비스 태그 + 제목 + 시간. */
export const ContinueItem: Story = {
  args: { leading: <Badge>사내 가이드 챗</Badge>, trailing: '오늘 09:40' },
};

/** 전체 기록 (2쪽): 제목 아래 첫 질문 미리보기. */
export const HistoryItem: Story = {
  args: {
    leading: <Badge>사내 가이드 챗</Badge>,
    description: '올해 못 쓴 연차, 내년으로 이월할 수 있어?',
    trailing: '오늘 09:40',
  },
};

/** 관리자 확인할 일 (20쪽): 태그 + 항목 + 건수 ›. */
export const TaskItem: Story = {
  args: {
    title: '검수 대기 중인 규정 문서',
    leading: <Badge>사내 가이드 챗</Badge>,
    trailing: (
      <span className="flex items-center gap-0.5 font-semibold text-foreground">
        3건 <ChevronRight className="size-4" aria-hidden />
      </span>
    ),
  },
};
