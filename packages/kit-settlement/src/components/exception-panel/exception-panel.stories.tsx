import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Amount, UnknownValue } from '@actoz/kit-settlement';

import { ExceptionPanel } from './exception-panel';

const reasons = [
  { id: 'r1', label: '정산서 금액을 따름 · 반올림 차이' },
  { id: 'r2', label: '정산서 금액을 따름 · 차감 항목 차이' },
  {
    id: 'r3',
    label: '정산서 오류 · 퍼블리셔 문의 후 수정본 업로드',
    resolve: {
      notice:
        '정산서 오류는 확인 후 진행하지 않습니다. 이 건은 대기 상태가 되고, 퍼블리셔에 문의한 뒤 수정 정산서를 올리면 다시 판정합니다.',
      actionLabel: '수정 정산서 업로드',
    },
  },
  { id: 'r4', label: '기타', other: true },
];

const comparison = (
  <>
    <table className="w-full text-body-sm">
      <thead>
        <tr className="border-b border-border text-left text-muted-foreground">
          <th scope="col" className="py-1.5 pr-3 font-normal">
            정산서 원문
          </th>
          <th scope="col" className="py-1.5 pr-3 font-normal">
            재계산
          </th>
          <th scope="col" className="py-1.5 font-normal">
            차액
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-1.5 pr-3">
            <Amount currency="USD" value="31,240.00" />
          </td>
          <td className="py-1.5 pr-3">
            <Amount currency="USD" value="31,238.50" />
          </td>
          <td className="py-1.5 tabular-nums">1.50</td>
        </tr>
      </tbody>
    </table>
    <p className="text-body-sm text-muted-foreground">
      허용 오차: <UnknownValue kind="undecided" /> (완전일치 적용)
    </p>
  </>
);

const meta = {
  title: 'Settlement/ExceptionPanel',
  component: ExceptionPanel,
  tags: ['autodocs', 'kit:settlement'],
  // 열린 대화상자는 화면 전체를 덮으므로 문서 페이지에서도 iframe 안에 따로 그린다.
  parameters: { layout: 'centered', docs: { story: { inline: false, height: '640px' } } },
  args: {
    defaultOpen: true,
    code: 'E05',
    situation: '재계산 로열티 ≠ 정산서 로열티',
    comparison,
    reasons,
    onProceed: fn(),
    onResolve: fn(),
  },
} satisfies Meta<typeof ExceptionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 열린 상태. 기준과 다른 점을 먼저 보이고, 사유는 고르게 한다. 「기타」일 때만 서술란이 열린다. */
export const Default: Story = {};

/** 「정산서 오류」를 고른 상태. 확인 후 진행하지 않고 주 버튼이 「수정 정산서 업로드」로 바뀐다. */
export const ServiceError: Story = { args: { defaultReasonId: 'r3' } };

/** 「기타」를 고른 상태. 서술란이 열린다. */
export const OtherReason: Story = { args: { defaultReasonId: 'r4' } };
