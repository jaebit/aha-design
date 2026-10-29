import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusPill } from './status-pill';

const meta = {
  title: 'Settlement/StatusPill',
  component: StatusPill,
  tags: ['autodocs', 'kit:settlement'],
  args: { status: '정산 검토' },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 담당자가 결과를 확인할 차례. 진한 테두리. */
export const Review: Story = {};

/** 기다리는 상태. 점선 테두리. */
export const Waiting: Story = { args: { status: '정산서 대기' } };

/** 진행 중인 중간 단계. 「검토 확정」도 여기에 속한다. */
export const Step: Story = { args: { status: '송부' } };

/** 업무가 끝난 상태. 완료 표시가 붙는 것은 이것뿐이다. */
export const Done: Story = { args: { status: '입금 완료' } };
