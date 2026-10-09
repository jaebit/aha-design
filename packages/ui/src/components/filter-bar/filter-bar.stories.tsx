import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Card, FilterField, Input, NativeSelect } from '@aha/ui';

import { FilterBar } from './filter-bar';

const meta = {
  title: 'Data/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  args: { onSubmit: fn(), onReset: fn(), submitLabel: '보고서 조회' },
  decorators: [
    (Story) => (
      <Card padding="none" className="max-w-5xl">
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ITH 보고서 조회 조건 (15쪽). 날짜는 네이티브 날짜 입력을 쓴다. */
export const Expanded: Story = {
  args: {
    summary: '7건의 보고서 · 전체 서비스 · 날짜 내림차순',
    children: (
      <>
        <FilterField label="시작일">
          <Input type="date" className="h-12 w-44" />
        </FilterField>
        <FilterField label="종료일">
          <Input type="date" className="h-12 w-44" />
        </FilterField>
        <FilterField label="서비스군">
          <NativeSelect className="w-56">
            <option value="">전체 서비스군</option>
            <option value="game">게임</option>
          </NativeSelect>
        </FilterField>
        <FilterField label="서비스">
          <NativeSelect className="w-56">
            <option value="">전체 서비스</option>
            <option value="billing">결제</option>
          </NativeSelect>
        </FilterField>
      </>
    ),
  },
};

/** 옆 대화 패널이 열려 좁을 때 (16쪽). 조건 요약 버튼을 누르면 펼친다. */
export const Collapsed: Story = {
  args: {
    collapsed: true,
    collapsedLabels: ['시작일 · 종료일', '전체 서비스군', '전체 서비스'],
    onExpand: fn(),
  },
};
