import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExceptionBadge } from './exception-badge';

const meta = {
  title: 'Settlement/ExceptionBadge',
  component: ExceptionBadge,
  tags: ['autodocs', 'kit:settlement'],
  args: { code: 'E05', children: '재계산 로열티 ≠ 정산서 로열티' },
} satisfies Meta<typeof ExceptionBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 확인 후 진행. 사람이 확인하면 계속할 수 있다. */
export const Attend: Story = {};

/** 진행 불가. 원인이 풀리기 전에는 넘어갈 수 없다. */
export const Block: Story = { args: { code: 'E06', children: '정산서 환율 ≠ 계약 기준환율' } };

/** 보완 입력. 빠진 값을 채워야 한다. */
export const Supply: Story = { args: { code: 'E07', children: '기준환율 자동 조회 실패' } };

/** 정책 미정. 점선으로 표시한다. */
export const Policy: Story = { args: { code: 'E03', children: '2차 자료가 아직 없음' } };

/** 대기. 다른 쪽 응답을 기다린다. 점선으로 표시한다. */
export const Wait: Story = { args: { code: 'E13', children: '필수 자료 일부 미수령' } };

/** 상황 문장 없이 코드와 종류만 보인다. */
export const CodeOnly: Story = { args: { code: 'E08', children: null } };
