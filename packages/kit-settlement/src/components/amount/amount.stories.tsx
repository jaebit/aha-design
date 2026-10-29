import type { Meta, StoryObj } from '@storybook/react-vite';

import { Amount } from './amount';

const meta = {
  title: 'Settlement/Amount',
  component: Amount,
  tags: ['autodocs', 'kit:settlement'],
  args: { currency: 'USD', value: '12,480.50' },
} satisfies Meta<typeof Amount>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 크기. 표와 목록 안에서 쓴다. */
export const Default: Story = {};

/** 결과 카드의 핵심 금액. */
export const Large: Story = { args: { size: 'lg', currency: 'KRW', value: '16,224,650' } };
