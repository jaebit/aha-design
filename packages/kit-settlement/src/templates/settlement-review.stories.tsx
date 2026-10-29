import type { Meta, StoryObj } from '@storybook/react-vite';

import { ReviewScreen } from './fixtures';
import { withLinkActions } from './link-actions';

const meta = {
  title: 'Templates/SettlementReview',
  tags: ['kit:settlement'],
  component: ReviewScreen,
  parameters: { layout: 'fullscreen', density: 'compact' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof ReviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 정산 검토에 예외가 1건(E05) 있는 상태. 예외를 처리하기 전에는 「검토 확정」이 잠겨 있다. 미확정 값(허용 오차)은 UnknownValue로 표시한다. */
export const Default: Story = {};

/** 예외를 처리한 뒤. 처리한 줄은 지우지 않고 「처리됨 · 확인자 · 시각」으로 남기고, 「검토 확정」이 켜진다. */
export const Resolved: Story = { args: { resolved: true } };
