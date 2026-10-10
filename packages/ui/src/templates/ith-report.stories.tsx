import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import {
  AppShell,
  Badge,
  Card,
  CellText,
  Citation,
  Composer,
  DataTable,
  type DataTableColumn,
  FilterBar,
  FilterField,
  HistoryItem,
  Input,
  Message,
  MessageContent,
  NativeSelect,
  PageHeader,
  Pagination,
  ServiceSidebar,
  SidebarSection,
  SidePanel,
} from '@aha/ui';

import { ahaRail } from './fixtures';
import { withLinkActions } from './link-actions';

interface ErrorReport {
  date: string;
  mails: number;
  groups: number;
  quality: string;
  createdAt: string;
}

const reports: ErrorReport[] = [
  { date: '2026-10-06', mails: 71, groups: 26, quality: '일부 품질 저하', createdAt: '2026-10-07 09:06:44' },
  { date: '2026-10-05', mails: 47, groups: 34, quality: '일부 품질 저하', createdAt: '2026-10-06 09:03:29' },
  { date: '2026-10-04', mails: 69, groups: 35, quality: '일부 품질 저하', createdAt: '2026-10-05 09:03:44' },
  { date: '2026-10-03', mails: 132, groups: 68, quality: '일부 품질 저하', createdAt: '2026-10-04 09:07:10' },
  { date: '2026-10-02', mails: 119, groups: 48, quality: '일부 품질 저하', createdAt: '2026-10-03 09:05:20' },
];

const columns: DataTableColumn<ErrorReport>[] = [
  {
    key: 'date',
    header: '대상 날짜',
    cell: (row) => (
      <CellText
        primary={
          <a href={`#report/${row.date}`} className="font-semibold underline underline-offset-4">
            {row.date}
          </a>
        }
        secondary="일일 · 1차 생성"
      />
    ),
  },
  { key: 'mails', header: '처리 메일', cell: (row) => <CellText primary={`${row.mails}건`} strong /> },
  { key: 'groups', header: '그룹', cell: (row) => `${row.groups}개` },
  { key: 'quality', header: '보고서 품질', cell: (row) => <Badge tone="warning">{row.quality}</Badge> },
  {
    key: 'createdAt',
    header: '생성 시각',
    secondary: true,
    cell: (row) => <CellText primary={row.createdAt} secondary="Korea Standard Time" />,
  },
];

/** ITH 일일 오류 보고서 (15–16쪽): 필터 + 표 + 하단 입력창. 질문하면 오른쪽 대화 패널이 열린다. */
function IthReportPage({ initialPanelOpen }: { initialPanelOpen: boolean }) {
  const [panelOpen, setPanelOpen] = useState(initialPanelOpen);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const compact = panelOpen && !filtersOpen;

  return (
    <AppShell
      rail={ahaRail('ith')}
      sidebar={
        <ServiceSidebar title="ITH" onCollapse={fn()}>
          <SidebarSection title="보고서">
            <HistoryItem href="#daily" title="일일 오류 보고서" active />
          </SidebarSection>
          <SidebarSection title="최근 기록">
            <HistoryItem href="#r1" title="10/03 처리 메일 급증 원인" meta="오늘 10:12" metaPosition="bottom" active={panelOpen} />
            <HistoryItem href="#r2" title="주간 오류 그룹 추이" meta="어제" metaPosition="bottom" />
            <HistoryItem href="#r3" title="서비스별 품질 저하 비교" meta="10/02" metaPosition="bottom" />
          </SidebarSection>
        </ServiceSidebar>
      }
    >
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6 px-10 py-10">
              <PageHeader
                title="일일 오류 보고서"
                description="날짜별 오류 규모와 확인할 그룹을 살펴보세요."
                aside={panelOpen ? undefined : 'Korea Standard Time'}
              />
              <Card padding="none" className="overflow-hidden">
                <FilterBar
                  submitLabel="보고서 조회"
                  onSubmit={fn()}
                  onReset={fn()}
                  collapsed={compact}
                  collapsedLabels={['시작일 · 종료일', '전체 서비스군', '전체 서비스']}
                  onExpand={() => setFiltersOpen(true)}
                  summary="5건의 보고서 · 전체 서비스 · 날짜 내림차순"
                >
                  <FilterField label="시작일">
                    <Input type="date" className="h-12 w-44" />
                  </FilterField>
                  <FilterField label="종료일">
                    <Input type="date" className="h-12 w-44" />
                  </FilterField>
                  <FilterField label="서비스군">
                    <NativeSelect className="w-52">
                      <option value="">전체 서비스군</option>
                    </NativeSelect>
                  </FilterField>
                  <FilterField label="서비스">
                    <NativeSelect className="w-52">
                      <option value="">전체 서비스</option>
                    </NativeSelect>
                  </FilterField>
                </FilterBar>
                <DataTable
                  caption="일일 오류 보고서 목록"
                  columns={columns}
                  rows={reports}
                  getRowId={(row) => row.date}
                  compact={panelOpen}
                  selectedRowId={panelOpen ? '2026-10-03' : undefined}
                  footer={
                    panelOpen ? undefined : (
                      <>
                        <p className="text-body-sm text-muted-foreground">
                          처리 메일·그룹 수는 전체 서비스 기준입니다. 수집·제외 건수는 보고서 상세에서 확인할 수 있습니다.
                        </p>
                        <Pagination page={1} pageCount={1} onPageChange={fn()} />
                      </>
                    )
                  }
                />
              </Card>
            </div>
          </div>
          {panelOpen ? null : (
            <div className="mx-auto w-full max-w-4xl shrink-0 px-10 pb-6">
              <Composer variant="docked" placeholder="보고서에 대해 물어보세요" onAttach={fn()} onSubmit={() => setPanelOpen(true)} />
            </div>
          )}
        </div>

        {panelOpen ? (
          <SidePanel
            title="10/03 처리 메일 급증 원인"
            badge={<Badge>ITH</Badge>}
            onClose={() => setPanelOpen(false)}
            footer={<Composer variant="compact" placeholder="메시지를 입력하세요" onSubmit={fn()} helper="대화는 전체 기록에 저장돼요" />}
          >
            <div className="flex flex-col gap-6">
              <Message from="user">
                <MessageContent>10월 3일 처리 메일이 왜 이렇게 많아?</MessageContent>
              </Message>
              <Message from="assistant">
                <MessageContent>
                  <p>10월 3일은 결제 서비스 오류 그룹이 평소보다 3배 늘어 처리 메일이 132건이었어요.</p>
                </MessageContent>
                <Citation source="2026-10-03 일일 오류 보고서" />
              </Message>
            </div>
          </SidePanel>
        ) : null}
      </div>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/IthReport',
  tags: ['kit:ai'],
  component: IthReportPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withLinkActions()],
  args: { initialPanelOpen: false },
} satisfies Meta<typeof IthReportPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 보고서 조회 (15쪽). 아래 입력창에서 질문을 보내면 대화 패널이 열린다. */
export const Report: Story = {};

/** 대화 패널이 열린 상태 (16쪽): 필터가 접히고, 보조 열이 숨고, 이야기 중인 행이 강조된다. */
export const WithConversation: Story = { args: { initialPanelOpen: true } };
