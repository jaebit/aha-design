import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { ChoiceCardGroup } from './choice-card';

const options = [
  { value: 'summary', eyebrow: '일반 문서용', label: '핵심 내용 요약' },
  { value: 'contract-risk', eyebrow: '계약서용', label: '계약 리스크 검토' },
  { value: 'playbook', eyebrow: '법무팀', label: '용역계약 플레이북' },
];

const meta = {
  title: 'AI/ChoiceCardGroup',
  component: ChoiceCardGroup,
  tags: ['autodocs', 'kit:ai'],
  args: { label: '검토 기준', options, onValueChange: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChoiceCardGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 검토 기준 선택 (13쪽). "계약 리스크 검토"가 선택된 상태. */
export const Selected: Story = { args: { value: 'contract-risk' } };

/** 아직 고르지 않은 상태. */
export const Unselected: Story = {};

/** 눌러서 고를 수 있다. 방향키로도 이동한다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string>();
    return (
      <ChoiceCardGroup
        {...args}
        value={value}
        onValueChange={(next) => {
          args.onValueChange(next);
          setValue(next);
        }}
      />
    );
  },
};
