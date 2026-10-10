import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '@aha/ui';

import { BulkActionBar } from './bulk-action-bar';

const meta = {
  title: 'Admin/BulkActionBar',
  component: BulkActionBar,
  tags: ['autodocs', 'kit:admin'],
  args: {
    selectedCount: 3,
    unit: '명',
    onClear: fn(),
    children: (
      <>
        <Button variant="secondary" size="sm" onClick={fn()}>
          역할 변경
        </Button>
        <Button variant="destructive" size="sm" onClick={fn()}>
          비활성화
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof BulkActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사용자 3명을 골랐을 때. */
export const Selected: Story = {};

/** 고른 항목이 없으면 아무것도 그리지 않는다. */
export const NothingSelected: Story = { args: { selectedCount: 0 } };
