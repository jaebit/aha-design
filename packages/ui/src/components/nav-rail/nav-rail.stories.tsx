import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ahaBottomItems, ahaServices, ahaUser } from '../../templates/fixtures';
import { AccountMenu } from '../account-menu/account-menu';
import { NavRail } from './nav-rail';

const meta = {
  title: 'Shell/NavRail',
  component: NavRail,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { items: ahaServices, bottomItems: ahaBottomItems, onNavigate: fn() },
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
    account: <AccountMenu {...ahaUser} expanded onAdminSettings={fn()} onLogout={fn()} />,
  },
};

/** 좁은 레일: 아이콘만, 라벨은 툴팁. 서비스 화면 (3쪽). */
export const Collapsed: Story = {
  args: {
    activeId: 'guide-chat',
    account: <AccountMenu {...ahaUser} onAdminSettings={fn()} onLogout={fn()} />,
  },
};
