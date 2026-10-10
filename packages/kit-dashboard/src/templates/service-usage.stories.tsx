import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download } from 'lucide-react';
import { useState } from 'react';

import { AppShell, BarList, Button, PageHeader, StatCard } from '@aha/ui';
import { DonutChart, Heatmap, LineChart, type Period, PeriodPicker, periodOf, Widget, WidgetGrid } from '@aha/kit-dashboard';

import { daily, dashboardRail, hourly, hours, services, teams, weekdays } from './fixtures';
import { withLinkActions } from './link-actions';

const TODAY = '2026-10-10';
const count = (value: number) => `${value.toLocaleString('ko-KR')}건`;

interface ServiceUsagePageProps {
  /** 처음 고른 기간. */
  initialPeriod?: Period;
}

/** 대시보드 · 서비스 사용 현황: 기간을 고르면 숫자 카드, 추이, 비율, 시간대 분포, 팀 순위가 함께 바뀐다. */
function ServiceUsagePage({ initialPeriod = periodOf('7d', TODAY) }: ServiceUsagePageProps) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const rows = daily.filter((d) => d.date >= period.from && d.date <= period.to);
  const sum = (pick: (d: (typeof daily)[number]) => number) => rows.reduce((total, d) => total + pick(d), 0);
  const requests = sum((d) => d.values.guide + d.values.minutes + d.values.review);
  const failures = sum((d) => d.failures);
  const peakUsers = Math.max(0, ...rows.map((d) => d.users));
  const byService = services.map((s) => ({ ...s, value: sum((d) => d.values[s.key as keyof typeof d.values]) }));

  return (
    <AppShell rail={dashboardRail('overview')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-10 py-10">
          <PageHeader
            title="서비스 사용 현황"
            description="AHA AI 서비스의 요청, 사용자, 실패를 기간별로 봅니다."
            aside={
              <Button variant="secondary">
                <Download aria-hidden />
                CSV 내려받기
              </Button>
            }
          />
          <PeriodPicker value={period} onChange={setPeriod} today={TODAY} />

          <WidgetGrid>
            <StatCard label="요청 수" value={count(requests)} delta={{ value: '+12%', direction: 'up', period: '이전 기간 대비', tone: 'good' }} />
            <StatCard label="최대 일 사용자" value={`${peakUsers.toLocaleString('ko-KR')}명`} delta={{ value: '+5%', direction: 'up', period: '이전 기간 대비', tone: 'good' }} />
            <StatCard label="평균 응답" value="3.2초" delta={{ value: '+0.4초', direction: 'up', period: '이전 기간 대비', tone: 'bad' }} />
            <StatCard label="실패" value={count(failures)} hint={`요청의 ${requests > 0 ? ((failures / requests) * 100).toFixed(2) : 0}%`} />

            <Widget title="일별 요청" description="서비스별, 하루 기준" span={3}>
              <LineChart
                title="서비스별 일별 요청"
                series={services}
                data={rows.map((d) => ({ label: d.label, values: d.values }))}
                formatValue={count}
              />
            </Widget>
            <Widget title="서비스별 비율" description="기간 합계">
              <DonutChart title="서비스별 요청 비율" items={byService} centerLabel="요청" formatValue={count} size={160} />
            </Widget>

            <Widget title="시간대별 요청" description="요일 × 시간, 진할수록 많음" span={2}>
              <Heatmap title="요일·시간대별 요청" rows={weekdays} columns={hours} values={hourly(rows.length / 7)} rowHeader="요일" formatValue={count} />
            </Widget>
            <Widget title="많이 쓰는 팀" description="기간 합계, 상위 5개" span={2} footer={`${TODAY.replaceAll('-', '.')} 09:00 기준`}>
              <BarList label="팀별 요청 수" items={teams.map((t) => ({ label: t.label, value: Math.round(requests * t.share) }))} formatValue={count} />
            </Widget>
          </WidgetGrid>
        </div>
      </div>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/ServiceUsage',
  tags: ['kit:dashboard'],
  component: ServiceUsagePage,
  parameters: { layout: 'fullscreen' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof ServiceUsagePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 최근 7일. 기간 칩을 누르면 모든 위젯이 그 기간으로 바뀐다. */
export const Default: Story = {};

/** 최근 30일. 주말마다 요청이 줄어드는 주기가 보인다. */
export const Last30Days: Story = { args: { initialPeriod: periodOf('30d', TODAY) } };
