import type { Meta, StoryObj } from '@storybook/react-vite';

import { PageHeader } from './page-header';

const meta = {
  title: 'Shell/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 전체 기록 (2쪽). */
export const Default: Story = {
  args: { title: '전체 기록', description: '모든 서비스에서 나눈 대화를 한곳에서 찾아보세요.' },
};

/** 오른쪽 보조 정보: ITH 보고서의 시간대 (15쪽). */
export const WithAside: Story = {
  args: {
    title: '일일 오류 보고서',
    description: '날짜별 오류 규모와 확인할 그룹을 살펴보세요.',
    aside: 'Korea Standard Time',
  },
};
