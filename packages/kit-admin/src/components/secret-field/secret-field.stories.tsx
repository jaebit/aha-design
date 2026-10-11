import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { SecretField } from './secret-field';

const meta = {
  title: 'Admin/SecretField',
  component: SecretField,
  tags: ['autodocs', 'kit:admin'],
  args: {
    label: '클라이언트 secret',
    value: 'iam_cs_7Hq2vN8xLp4RtY6wZ3kB9mJd',
    description: '2026-09-22 발급 · 2026-12-21 만료',
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SecretField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 저장된 secret. 끝 4자만 보이고 보기·복사 버튼이 있다. */
export const Masked: Story = {};

/** 방금 만든 secret. 한 번만 전부 보여주고 경고를 단다. */
export const Revealed: Story = { args: { revealOnce: true, description: undefined } };

/** 재발급 버튼. 누르면 ConfirmDialog로 한 번 더 묻는다. */
export const WithRegenerate: Story = { args: { onRegenerate: fn() } };

/** 클라이언트 id처럼 공개 값. 가리지 않고 복사만 둔다. */
export const ClientId: Story = {
  args: { label: '클라이언트 id', value: 'claude-desktop-4f9a', masked: false, description: undefined },
};
