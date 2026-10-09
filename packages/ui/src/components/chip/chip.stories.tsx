import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Chip } from './chip';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: '연차 이월 규정', onClick: fn() },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 누르면 바로 동작하는 칩. 추천 질문 (3쪽). */
export const Action: Story = {};

/** 켜진 필터 칩. */
export const Selected: Story = { args: { selected: true, children: '전체' } };

/** 전체 기록의 서비스 필터 (2쪽). 하나만 선택된다. */
export const FilterGroup: Story = {
  render: function Render() {
    const filters = ['전체', '사내 가이드 챗', '회의록 생성', '문서 검토', 'ITH', 'IP 로열티 정산', '자금 일보'];
    const [current, setCurrent] = useState('전체');
    return (
      <div role="group" aria-label="서비스 필터" className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Chip key={filter} selected={current === filter} onClick={() => setCurrent(filter)}>
            {filter}
          </Chip>
        ))}
      </div>
    );
  },
};
