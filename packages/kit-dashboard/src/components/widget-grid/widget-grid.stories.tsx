import type { Meta, StoryObj } from '@storybook/react-vite';

import { BarList, Button, StatCard } from '@aha/ui';
import { Widget } from '@aha/kit-dashboard';

import { WidgetGrid } from './widget-grid';

const meta = {
  title: 'Dashboard/WidgetGrid',
  component: WidgetGrid,
  tags: ['autodocs', 'kit:dashboard'],
  args: { children: null },
} satisfies Meta<typeof WidgetGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 위쪽 숫자 카드 4개(각 1칸) + 아래 위젯 2개(2칸씩). 화면이 좁아지면 2열, 1열로 바뀐다. */
export const Layout: Story = {
  args: {
    children: (
      <>
        <StatCard label="이번 달 요청" value="7,240건" delta={{ value: '+12%', direction: 'up', period: '지난달 대비', tone: 'good' }} />
        <StatCard label="활성 사용자" value="283명" delta={{ value: '+5%', direction: 'up', period: '지난달 대비', tone: 'good' }} />
        <StatCard label="평균 응답" value="3.2초" delta={{ value: '+0.4초', direction: 'up', period: '지난달 대비', tone: 'bad' }} />
        <StatCard label="실패율" value="0.8%" delta={{ value: '−0.2%p', direction: 'down', period: '지난달 대비', tone: 'good' }} />
        <Widget title="많이 쓰는 서비스" description="이번 달 요청 수" span={2} action={<Button variant="ghost" size="sm">자세히</Button>}>
          <BarList
            label="서비스별 요청 수"
            items={[
              { label: '사내 가이드 챗', value: 4820 },
              { label: '회의록 생성', value: 1310 },
              { label: '문서 검토', value: 690 },
            ]}
          />
        </Widget>
        <Widget title="확인할 일" description="관리자가 처리할 항목" span={2} footer="10/10 09:00 기준">
          <p className="text-body text-muted-foreground">검수 대기 중인 규정 문서 3건</p>
        </Widget>
      </>
    ),
  },
};

/** 위젯 하나. 제목, 설명, 오른쪽 위 동작, 아래 기준 시각. */
export const SingleWidget: Story = {
  args: {
    children: (
      <Widget title="평균 응답 시간" description="AI 답변이 끝날 때까지" footer="10/10 09:00 기준">
        <p className="text-display font-bold tabular-nums">3.2초</p>
      </Widget>
    ),
  },
};
