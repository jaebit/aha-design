import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Checkbox } from './checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: '이메일 알림 받기', onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 라벨이 있는 기본 체크박스. 라벨을 눌러도 바뀐다. */
export const Default: Story = { args: { defaultChecked: true } };

/** 보조 설명이 있는 폼 항목. */
export const WithDescription: Story = {
  args: { label: '관리자 권한 부여', description: '사용자 관리와 설정 변경을 할 수 있어요.' },
};

/** 일부만 선택된 상태. 표 머리글의 전체 선택에서 쓴다. */
export const Indeterminate: Story = { args: { label: '전체 선택', checked: false, indeterminate: true } };

/** 라벨 없이 표의 행 선택에 쓸 때는 `aria-label`을 준다. */
export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': '김하마 선택' } };

/** 여러 개 고르기. */
export const Group: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(['guide']);
    const toggle = (key: string) => (checked: boolean) =>
      setSelected((list) => (checked ? [...list, key] : list.filter((k) => k !== key)));
    return (
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-body font-semibold">사용할 서비스</legend>
        <Checkbox label="사내 가이드 챗" checked={selected.includes('guide')} onCheckedChange={toggle('guide')} />
        <Checkbox label="회의록 생성" checked={selected.includes('minutes')} onCheckedChange={toggle('minutes')} />
        <Checkbox label="문서 검토" checked={selected.includes('review')} onCheckedChange={toggle('review')} />
      </fieldset>
    );
  },
};

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
