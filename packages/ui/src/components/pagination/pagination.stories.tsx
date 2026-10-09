import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Pagination } from './pagination';

const meta = {
  title: 'Data/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, pageCount: 1, onPageChange: fn() },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 한 페이지뿐일 때 (15쪽): 이전 · 다음 모두 비활성. */
export const SinglePage: Story = {};

/** 여러 페이지를 넘겨 볼 수 있다. */
export const Interactive: Story = {
  args: { pageCount: 5 },
  render: function Render(args) {
    const [page, setPage] = useState(2);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};
