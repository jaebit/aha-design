import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartColumn, ChevronRight, LayoutGrid, Mail, MessageSquareText, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import {
  AppShell,
  Badge,
  BarList,
  Button,
  Card,
  List,
  ListRow,
  MonthStepper,
  PageHeader,
  ServiceSidebar,
  SidebarNavItem,
  SidebarSection,
  StackedColumnChart,
  StatCard,
  type YearMonth,
} from '@aha/ui';

import { ahaRail } from './fixtures';
import { withLinkActions } from './link-actions';

const services = [
  { key: 'guide', label: '사내 가이드 챗' },
  { key: 'minutes', label: '회의록 생성' },
  { key: 'review', label: '문서 검토' },
  { key: 'newsletter', label: '뉴스레터' },
  { key: 'ith', label: 'ITH' },
  { key: 'etc', label: '기타' },
];

const daily = Array.from({ length: 9 }, (_, i) => {
  const wave = (n: number) => Math.round(n * (1 + 0.35 * Math.sin(i * 0.9 + n)));
  return {
    label: `10/${String(i + 1).padStart(2, '0')}`,
    values: { guide: wave(24), minutes: wave(9), review: wave(4), newsletter: 14, ith: wave(3), etc: i % 3 },
  };
});

const tasks = [
  { id: 't1', service: '사내 가이드 챗', title: '검수 대기 중인 규정 문서', count: 3 },
  { id: 't2', service: '사내 가이드 챗', title: "'도움이 안 됐어요' 답변", count: 7 },
  { id: 't3', service: '통계', title: '실패한 작업', count: 2 },
  { id: 't4', service: '회의록 생성', title: '메일 미발송 회의록', count: 0 },
];

/** 관리자 설정 · 사용 현황 요약 (20쪽). */
function AdminDashboardPage() {
  const [month, setMonth] = useState<YearMonth>({ year: 2026, month: 10 });
  return (
    <AppShell
      rail={ahaRail()}
      sidebar={
        <ServiceSidebar
          title="관리자 설정"
          onCollapse={() => {}}
          footer={<SidebarNavItem href="#iam" label="IAM 및 관리자" icon={<ShieldCheck />} external />}
        >
          <SidebarSection title="메뉴">
            <SidebarNavItem href="#summary" label="사용 현황 요약" icon={<LayoutGrid />} active />
            <SidebarNavItem href="#stats" label="통계" icon={<ChartColumn />} />
            <SidebarNavItem href="#guide-admin" label="사내 가이드 챗 관리" icon={<MessageSquareText />} count={3} />
            <SidebarNavItem href="#newsletter-admin" label="뉴스레터 구독 관리" icon={<Mail />} />
          </SidebarSection>
        </ServiceSidebar>
      }
    >
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-10 py-10">
          <PageHeader
            title="사용 현황 요약"
            aside={<MonthStepper value={month} onValueChange={setMonth} max={{ year: 2026, month: 10 }} />}
          />

          <Card variant="emphasis" className="flex flex-col gap-3">
            <h2 className="text-heading font-semibold">확인할 일</h2>
            <List>
              {tasks.map((task) => (
                <ListRow
                  key={task.id}
                  href={`#${task.id}`}
                  leading={<Badge>{task.service}</Badge>}
                  title={task.title}
                  trailing={
                    <span className="flex items-center gap-0.5 font-semibold text-foreground">
                      {task.count}건 <ChevronRight aria-hidden className="size-4" />
                    </span>
                  }
                />
              ))}
            </List>
          </Card>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard label="요청 수" value="1,284" delta={{ value: '+12%', direction: 'up', period: '지난달 대비', tone: 'good' }} />
            <StatCard label="이용자 수" value="86명" delta={{ value: '−3%', direction: 'down', period: '지난달 대비', tone: 'bad' }} />
            <StatCard label="성공률" value="98.2%" hint="실패 23건" />
            <StatCard label="예상 비용" value="약 $42.10" hint="토큰 3,512,000" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-heading font-semibold">일별 요청 추이</h2>
                <Button variant="link" size="sm" asChild>
                  <a href="#stats">통계 자세히 보기</a>
                </Button>
              </div>
              <StackedColumnChart title="일별 요청 수 (서비스별)" series={services} data={daily} />
            </Card>
            <Card className="flex flex-col gap-4">
              <h2 className="text-heading font-semibold">서비스별 이용</h2>
              <BarList
                label="서비스별 이용 건수"
                items={[
                  { label: '사내 가이드 챗', value: 642 },
                  { label: '뉴스레터', value: 410 },
                  { label: '회의록 생성', value: 228 },
                  { label: '문서 검토', value: 104 },
                  { label: 'ITH', value: 96 },
                  { label: '기타', value: 24 },
                ]}
              />
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/AdminDashboard',
  component: AdminDashboardPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof AdminDashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
