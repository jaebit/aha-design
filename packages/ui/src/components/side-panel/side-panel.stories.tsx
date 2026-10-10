import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Badge, Button } from '@aha/ui';

import { SidePanel } from './side-panel';

const meta = {
  title: 'Shell/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="flex h-[640px] justify-end bg-subtle">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 목록에서 고른 항목의 상세 (16쪽 ITH 보고서의 오류 그룹). */
export const ItemDetail: Story = {
  args: {
    title: '결제 서비스 오류 그룹',
    badge: <Badge tone="serious">보통</Badge>,
    onClose: fn(),
    footer: (
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={fn()}>
          담당자 지정
        </Button>
        <Button onClick={fn()}>처리 완료</Button>
      </div>
    ),
    children: (
      <dl className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <dt className="text-body-sm text-muted-foreground">발생 기간</dt>
          <dd className="text-body">2026-10-01 ~ 2026-10-03</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-body-sm text-muted-foreground">처리 메일</dt>
          <dd className="text-body">132건 (평소의 3배)</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-body-sm text-muted-foreground">내용</dt>
          <dd className="text-body">결제 승인 응답이 늦어 같은 오류 메일이 반복해서 발송됐습니다.</dd>
        </div>
      </dl>
    ),
  },
};
