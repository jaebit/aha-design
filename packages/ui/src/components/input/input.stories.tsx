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

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: '연차 이월 · 회식비 증빙 문의' } };

/** 값이 잘못되었을 때 `aria-invalid`를 준다. */
export const Invalid: Story = { args: { defaultValue: '', 'aria-invalid': true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'hama@actoz.com' } };
