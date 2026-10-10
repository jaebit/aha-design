import type { Meta, StoryObj } from '@storybook/react-vite';

import { Citation } from './citation';

const meta = {
  title: 'AI/Citation',
  component: Citation,
  tags: ['autodocs', 'kit:ai'],
  args: { source: '인사 규정 · 연차휴가 조항', href: '#guide' },
} satisfies Meta<typeof Citation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 응답 본문 아래 근거 칩 (5쪽). */
export const Chip: Story = {};

/** 리스크 항목 같은 카드 안의 밑줄 링크 (13쪽). */
export const Inline: Story = { args: { variant: 'inline', source: '제12조 (해지)' } };

/** 링크가 없는 근거. 문서 위치를 알 수 없을 때. */
export const WithoutLink: Story = { args: { href: undefined, source: '2026-10-03 일일 오류 보고서' } };
