import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '@aha/ui';

import { FormActions } from './form-actions';

const meta = {
  title: 'Admin/FormActions',
  component: FormActions,
  tags: ['autodocs', 'kit:admin'],
  args: {
    children: (
      <>
        <Button variant="secondary" onClick={fn()}>
          취소
        </Button>
        <Button onClick={fn()}>저장</Button>
      </>
    ),
  },
} satisfies Meta<typeof FormActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 취소 · 저장. */
export const Default: Story = {};

/** 저장하지 않은 변경이 있다는 안내. */
export const WithNote: Story = { args: { note: '저장하지 않은 변경 2건' } };
