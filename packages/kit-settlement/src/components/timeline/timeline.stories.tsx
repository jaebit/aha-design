import type { Meta, StoryObj } from '@storybook/react-vite';

import { Timeline } from './timeline';

const meta = {
  title: 'Settlement/Timeline',
  component: Timeline,
  tags: ['autodocs', 'kit:settlement'],
  args: {
    steps: [
      { name: '초안 생성', meta: '2026.09.20 · 시스템 · 문서 생성은 발행이 아닙니다', status: 'done' },
      { name: '결재 종결', meta: '2026.09.24 · 담당자', status: 'done' },
      { name: '발급', meta: '2026.09.26 · 재무팀 · 증빙 번호 20260926-41000012', status: 'done' },
      { name: '송부', meta: '2026.09.30 · 담당자', status: 'done' },
      { name: '입금', meta: '미입금 23일 (송부 후 경과)', status: 'current' },
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

/** 송부까지 끝나고 입금을 기다리는 흐름. 연체 기준이 미정이라 경과일만 보이고 색 경고는 없다. */
export const InProgress: Story = {};

/** 모든 단계가 끝난 상태. */
export const Completed: Story = {
  args: {
    steps: [
      { name: '초안 생성', meta: '2026.09.20 · 시스템 · 문서 생성은 발행이 아닙니다', status: 'done' },
      { name: '결재 종결', meta: '2026.09.24 · 담당자', status: 'done' },
      { name: '발급', meta: '2026.09.26 · 재무팀 · 증빙 번호 20260926-41000012', status: 'done' },
      { name: '송부', meta: '2026.09.30 · 담당자', status: 'done' },
      { name: '입금', meta: '2026.10.02 · 재무팀', status: 'done' },
    ],
  },
};

/** 아직 시작하지 않은 상태. */
export const NotStarted: Story = {
  args: {
    steps: [
      { name: '초안 생성', status: 'pending' },
      { name: '결재 종결', status: 'pending' },
    ],
  },
};
