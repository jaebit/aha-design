import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@actoz/ui';

import { DescriptionList } from './description-list';

const meta = {
  title: 'Admin/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs', 'kit:admin'],
  args: {
    items: [
      { label: '이메일', value: 'hama@actoz.com' },
      { label: '소속 팀', value: '팀아하' },
      { label: '역할', value: <Badge variant="soft">관리자</Badge> },
      { label: '상태', value: <Badge tone="good">활성</Badge> },
      { label: '가입일', value: '2025-03-02' },
      { label: '최근 접속', value: '2026-10-10 09:12' },
    ],
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사용자 상세 요약 (2열). */
export const TwoColumns: Story = {};

/** 넓은 화면에서 3열. */
export const ThreeColumns: Story = { args: { columns: 3 } };

/** 긴 값은 한 줄 전체를 쓴다. */
export const WithWideItem: Story = {
  args: {
    items: [
      { label: '이메일', value: 'hama@actoz.com' },
      { label: '소속 팀', value: '팀아하' },
      { label: '메모', value: '2026년 10월 조직 개편으로 팀아하로 옮김. 기존 플랫폼팀 권한은 회수함.', wide: true },
    ],
  },
};
