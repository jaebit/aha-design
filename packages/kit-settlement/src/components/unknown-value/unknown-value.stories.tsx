import type { Meta, StoryObj } from '@storybook/react-vite';

import { UnknownValue } from './unknown-value';

const meta = {
  title: 'Settlement/UnknownValue',
  component: UnknownValue,
  tags: ['autodocs', 'kit:settlement'],
  args: { kind: 'unknown' },
} satisfies Meta<typeof UnknownValue>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 아직 확인하지 못한 값. */
export const Unknown: Story = {};

/** 정해지지 않은 값. 질문 ID를 함께 보인다. */
export const Undecided: Story = { args: { kind: 'undecided', reference: 'Q-01' } };

/** 적용 중인 임시 기준과 질문 ID를 함께 적는다. */
export const UndecidedWithBasis: Story = { args: { kind: 'undecided', reference: '완전일치 적용 · Q-02' } };
