import type { Meta, StoryObj } from '@storybook/react-vite';
import { Ellipsis, Pencil, Pin, Trash2 } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@aha/ui';

import { DropdownMenuContent } from './dropdown-menu';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenuContent,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex h-64 justify-end p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 대화 더보기 메뉴 (7쪽). 삭제는 구분선 아래 마지막에 둔다. */
export const ConversationMenu: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="대화 메뉴">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={fn()}>
          <Pencil /> 이름 변경
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={fn()}>
          <Pin /> 대화 고정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={fn()}>
          <Trash2 /> 삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
