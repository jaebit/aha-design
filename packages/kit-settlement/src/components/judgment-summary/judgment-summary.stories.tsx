import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { JudgmentSummary } from './judgment-summary';

const meta = {
  title: 'Settlement/JudgmentSummary',
  component: JudgmentSummary,
  tags: ['autodocs', 'kit:settlement'],
  args: { items: [] },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JudgmentSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 예외가 없을 때. 완료 계열로 보인다. */
export const NoException: Story = {};

/** 확인 후 진행할 수 있는 예외만 있을 때. */
export const Exceptions: Story = {
  args: {
    items: [
      { code: 'E05', situation: '재계산 로열티 ≠ 정산서 로열티', action: { label: '확인', onClick: fn() } },
      { code: 'E07', situation: '기준환율 자동 조회 실패', action: { label: '기준환율 입력', onClick: fn() } },
    ],
  },
};

/** 진행 불가가 하나라도 있을 때. 해제·무시 버튼은 없고, 원인을 푸는 동작만 둔다. */
export const Blocked: Story = {
  args: {
    items: [
      { code: 'E06', situation: '정산서 환율 ≠ 계약 기준환율', action: { label: '수정 정산서 업로드', onClick: fn() } },
      { code: 'E05', situation: '재계산 로열티 ≠ 정산서 로열티', action: { label: '확인', onClick: fn() } },
    ],
  },
};

/** 처리된 줄은 지우지 않고 확인자와 시각을 남긴다. 버튼은 숨긴다. */
export const Resolved: Story = {
  args: {
    items: [
      { code: 'E05', situation: '재계산 로열티 ≠ 정산서 로열티', resolved: { by: '담당자', at: '2026.09.21 14:02' } },
      { code: 'E07', situation: '기준환율 자동 조회 실패', action: { label: '기준환율 입력', onClick: fn() } },
    ],
  },
};
