import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { SessionList } from './session-list';

const meta = {
  title: 'Admin/SessionList',
  component: SessionList,
  tags: ['autodocs', 'kit:admin'],
  args: {
    onRevoke: fn(),
    onRevokeAll: fn(),
    sessions: [
      { id: 's1', device: 'Windows · Chrome 141', deviceType: 'desktop', ip: '10.20.31.7', location: '서울', lastActive: '방금 전', signedInAt: '2026-10-10 09:12', current: true },
      { id: 's2', device: 'iPhone · Safari', deviceType: 'mobile', ip: '211.36.142.18', location: '서울', lastActive: '2시간 전', signedInAt: '2026-10-09 18:40' },
      { id: 's3', device: 'iPad · Safari', deviceType: 'tablet', ip: '10.20.40.11', location: '판교', lastActive: '어제', signedInAt: '2026-10-07 10:05' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SessionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 계정 설정 > 보안: 이 기기 세션과 다른 기기 세션. 이 기기는 로그아웃 버튼이 없다. */
export const Default: Story = {};

/** OAuth 앱으로 연결된 세션. 앱 이름이 배지로 붙는다. */
export const WithOAuthClients: Story = {
  args: {
    sessions: [
      { id: 's1', device: 'Windows · Chrome 141', deviceType: 'desktop', ip: '10.20.31.7', location: '서울', lastActive: '방금 전', current: true },
      { id: 's4', device: 'macOS · Claude Desktop', deviceType: 'desktop', ip: '10.20.31.22', location: '서울', lastActive: '10분 전', client: 'Claude Desktop' },
      { id: 's5', device: 'Linux · Codex CLI', deviceType: 'desktop', ip: '10.20.50.3', location: '판교', lastActive: '3일 전', client: 'Codex CLI' },
    ],
  },
};

/** 관리자가 사용자 상세에서 볼 때. 모든 세션을 끊을 수 있다. */
export const AdminView: Story = { args: { allowRevokeCurrent: true, onRevokeAll: undefined } };

/** 세션이 없을 때. */
export const Empty: Story = { args: { sessions: [], onRevokeAll: undefined } };

/** 읽기 전용 (감사 담당자 화면). 로그아웃 버튼이 없다. */
export const ReadOnly: Story = { args: { onRevoke: undefined, onRevokeAll: undefined } };
