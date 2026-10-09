import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchInput } from './search-input';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  args: { 'aria-label': '대화 검색', placeholder: '대화 제목이나 내용으로 검색' },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 전체 기록 검색 (2쪽). */
export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: '연차' } };
