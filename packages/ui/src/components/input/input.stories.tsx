import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { 'aria-label': '대화 이름', placeholder: '대화 이름' },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 빈 입력. 안내 문구(placeholder)만 보인다. */
export const Default: Story = {};

/** 값이 들어 있는 상태 (8쪽 대화 이름 변경). */
export const WithValue: Story = { args: { defaultValue: '연차 이월 · 회식비 증빙 문의' } };

/** 값이 잘못되었을 때 `aria-invalid`를 준다. */
export const Invalid: Story = { args: { defaultValue: '', 'aria-invalid': true } };

/** 바꿀 수 없는 값. 흐리게 보인다. */
export const Disabled: Story = { args: { disabled: true, defaultValue: 'hama@actoz.com' } };
