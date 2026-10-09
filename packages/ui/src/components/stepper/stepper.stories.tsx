import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stepper } from './stepper';

const meta = {
  title: 'Shell/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: ['음성 원문', '회의록', '메일 발송'], current: 2 },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 회의록 생성 3단계 중 마지막 단계 진행 중 (11쪽). */
export const MeetingMinutes: Story = {};

/** 문서 검토 2단계 모두 완료 (13쪽). */
export const DocumentReviewDone: Story = { args: { steps: ['문서 읽기', '검토 결과'], current: 2 } };

/** 첫 단계 진행 중. */
export const FirstStep: Story = { args: { current: 0 } };
