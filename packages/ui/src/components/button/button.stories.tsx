import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, ArrowUp, Copy, Search, Trash2 } from 'lucide-react';

import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: '보고서 조회' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 화면의 주요 액션. 와이어프레임 15쪽 "보고서 조회", 11쪽 "메일 보내기". */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <Search /> 보고서 조회
      </>
    ),
  },
};

/** 외곽선 보조 액션. 5쪽 "담당 부서에 문의". */
export const Secondary: Story = {
  args: { variant: 'secondary', children: '담당 부서에 문의' },
};

/** 낮은 강조 액션. 응답 액션 바의 복사 버튼처럼 쓴다. */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'sm',
    children: (
      <>
        <Copy /> 복사
      </>
    ),
  },
};

/** 밑줄 텍스트 링크. 1쪽 "전체 기록 보기". */
export const Link: Story = {
  args: { variant: 'link', children: '전체 기록 보기' },
};

/** 되돌릴 수 없는 액션. 8쪽 더보기 메뉴의 "삭제". */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Trash2 /> 삭제
      </>
    ),
  },
};

/** 원형 아이콘 버튼. 입력창의 전송 버튼. 아이콘만 있을 때는 aria-label 필수. */
export const IconRound: Story = {
  args: { size: 'icon-round', 'aria-label': '보내기', children: <ArrowUp /> },
};

/** asChild로 링크에 버튼 스타일을 입힌다. */
export const AsLink: Story = {
  args: {
    asChild: true,
    variant: 'secondary',
    children: (
      <a href="#history">
        전체 기록 <ArrowRight />
      </a>
    ),
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        작게
      </Button>
      <Button {...args} size="md">
        기본
      </Button>
      <Button {...args} size="lg">
        크게
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, children: '메일 보내기' },
};
