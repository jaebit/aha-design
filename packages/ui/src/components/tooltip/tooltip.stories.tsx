import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy } from 'lucide-react';

import { Button } from '../button/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTerm, TooltipTrigger } from './tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-16">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 문장 속 용어 설명 (3쪽). */
export const Term: Story = {
  render: () => (
    <p className="text-body-sm text-muted-foreground">
      등록된{' '}
      <TooltipTerm term="사내 가이드">
        <strong>사규 · 매뉴얼 · FAQ</strong>처럼 회사에 등록된 문서예요. 답변은 이 문서 안에서만 찾고 근거를 함께 보여드려요.
      </TooltipTerm>{' '}
      안에서만 답해요. 최종 확인은 담당 부서에 해 주세요.
    </p>
  ),
};

/** 아이콘 버튼 라벨. */
export const IconButton: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="복사">
          <Copy />
        </Button>
      </TooltipTrigger>
      <TooltipContent>복사</TooltipContent>
    </Tooltip>
  ),
};
