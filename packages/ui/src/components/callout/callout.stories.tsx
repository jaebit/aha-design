import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button';
import { Callout } from './callout';

const meta = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사용 팁 (10쪽). */
export const Tip: Story = {
  args: {
    title: '더 좋은 회의록을 위한 팁',
    children: '회의 시작할 때 회의 일시, 참석자 이름과 역할, 회의 목적을 먼저 말해 주세요.',
  },
};

/** 사람에게 넘기기 (5쪽). AI가 답하기 어려울 때 담당 부서로 연결한다. */
export const Handoff: Story = {
  args: {
    children: '사내 가이드만으로 판단이 어려우면 담당 부서에 바로 문의할 수 있어요.',
    action: <Button variant="secondary">담당 부서에 문의</Button>,
  },
};
