import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '@actoz/ui';

import { ConfirmDialog } from './confirm-dialog';

const meta = {
  title: 'Admin/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs', 'kit:admin'],
  // 열린 대화상자는 화면 전체를 덮으므로 문서 페이지에서도 iframe 안에 따로 그린다.
  parameters: { layout: 'centered', docs: { story: { inline: false, height: '360px' } } },
  args: {
    title: '사용자 3명을 비활성화할까요?',
    description: '비활성화한 사용자는 로그인할 수 없어요. 사용자 목록에서 언제든 다시 활성화할 수 있어요.',
    confirmLabel: '비활성화',
    tone: 'destructive',
    onConfirm: fn(),
    trigger: <Button variant="destructive">비활성화</Button>,
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 버튼을 누르면 열린다. */
export const WithTrigger: Story = {};

/** 열린 상태. 되돌리기 어려운 작업은 빨간 확인 버튼. */
export const Open: Story = { args: { defaultOpen: true } };

/** 되돌릴 수 있는 작업은 기본 버튼. 대상 목록을 함께 보여준다. */
export const WithTargets: Story = {
  args: {
    title: '역할을 "조회 전용"으로 바꿀까요?',
    description: '아래 사용자의 편집 권한이 사라져요.',
    confirmLabel: '역할 변경',
    tone: 'default',
  },
  render: (args) => (
    <ConfirmDialog {...args} defaultOpen>
      <ul className="list-disc pl-5 text-body text-foreground">
        <li>김하마 (팀아하)</li>
        <li>이수달 (플랫폼팀)</li>
      </ul>
    </ConfirmDialog>
  ),
};
