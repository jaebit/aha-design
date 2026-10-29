import { Amount, UnknownValue } from '@actoz/kit-settlement';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SourcedValue } from './sourced-value';

const meta = {
  title: 'Settlement/SourcedValue',
  component: SourcedValue,
  tags: ['autodocs', 'kit:settlement'],
  args: { label: '로열티율', value: '12%', source: '계약서 제4조' },
} satisfies Meta<typeof SourcedValue>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 글자 값과 출처. */
export const Default: Story = {};

/** 핵심 금액을 크게 보인다. */
export const Emphasis: Story = {
  args: {
    label: '최종 로열티',
    emphasis: true,
    source: '정산서 3쪽',
    children: <Amount currency="USD" value="12,480.50" size="lg" />,
  },
};

/** 값을 모르면 0이나 빈칸 대신 UnknownValue를 넣는다. */
export const WithUnknownValue: Story = {
  args: {
    label: '최소 보증금',
    source: undefined,
    children: <UnknownValue kind="undecided" reference="Q-01" />,
  },
};
