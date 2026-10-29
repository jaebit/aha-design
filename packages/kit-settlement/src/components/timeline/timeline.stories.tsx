import type { Meta, StoryObj } from '@storybook/react-vite';

import { Timeline } from './timeline';

const meta = {
  title: 'Settlement/Timeline',
  component: Timeline,
  tags: ['autodocs', 'kit:settlement'],
  args: {
    steps: [
      { name: '문서 생성', meta: '2026.09.20 · 시스템 · 문서 생성은 발행이 아닙니다', status: 'done' },
      { name: '내부 검토', meta: '2026.09.21 · 김정산', status: 'current' },
      { name: '라이선서 확인', status: 'pending' },
      { name: '발행', status: 'pending' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 진행 중인 흐름. 끝난 단계, 지금 단계, 남은 단계가 함께 보인다. */
export const InProgress: Story = {};

/** 모든 단계가 끝난 상태. */
export const Completed: Story = {
  args: {
    steps: [
      { name: '문서 생성', meta: '2026.09.20 · 시스템', status: 'done' },
      { name: '내부 검토', meta: '2026.09.21 · 김정산', status: 'done' },
      { name: '발행', meta: '2026.09.22 · 박재무', status: 'done' },
    ],
  },
};

/** 아직 시작하지 않은 상태. */
export const NotStarted: Story = {
  args: {
    steps: [
      { name: '문서 생성', status: 'pending' },
      { name: '내부 검토', status: 'pending' },
    ],
  },
};
