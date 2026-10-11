import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, UserRound } from 'lucide-react';

import { ScopeList } from './scope-list';

const meta = {
  title: 'Components/ScopeList',
  component: ScopeList,
  tags: ['autodocs'],
  args: {
    items: [
      { scope: 'openid', label: '내 신원 확인', description: '로그인한 사람이 누구인지 확인합니다.', required: true },
      { scope: 'profile', label: '이름과 소속 보기', description: '이름, 부서, 직급을 읽습니다.' },
      { scope: 'work.my.read', label: '내 업무 목록 보기', description: '업무요청게시판에서 내가 담당한 업무만 읽습니다.' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScopeList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 동의 화면의 권한 목록. */
export const Consent: Story = {};

/** 권한마다 아이콘을 다르게 줄 때. */
export const WithIcons: Story = {
  args: {
    items: [
      { scope: 'profile', label: '이름과 소속 보기', icon: <UserRound aria-hidden />, required: true },
      { scope: 'email', label: '이메일 주소 보기', icon: <Mail aria-hidden /> },
    ],
  },
};

/** 관리 콘솔의 OAuth 클라이언트 상세. scope 값을 함께 보여준다. */
export const WithScopeValues: Story = { args: { showScope: true } };
