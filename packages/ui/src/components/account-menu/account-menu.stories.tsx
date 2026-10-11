import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AccountMenu } from './account-menu';

const meta = {
  title: 'Shell/AccountMenu',
  component: AccountMenu,
  tags: ['autodocs'],
  args: { name: '김하마', team: '팀아하', email: 'hama@actoz.com', initials: '하마', onLogout: fn() },
  decorators: [
    (Story) => (
      <div className="flex h-80 w-62 items-end">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 관리자 계정: 메뉴에 "관리자 설정"이 있다 (19쪽). */
export const Admin: Story = { args: { expanded: true, onAdminSettings: fn() } };

/** 일반 사용자: "관리자 설정" 없음. */
export const Member: Story = { args: { expanded: true } };

/** 좁은 레일에서는 아바타만 보인다. */
export const Compact: Story = { args: { onAdminSettings: fn() } };

/** 관리자 메뉴 이름 바꾸기. IAM은 "관리 콘솔"을 쓴다. */
export const AdminLabel: Story = {
  args: { team: '보안플랫폼팀', expanded: true, onAdminSettings: fn(), adminLabel: '관리 콘솔' },
  parameters: { brand: 'iam' },
};
