import type { Meta, StoryObj } from '@storybook/react-vite';
import { Upload } from 'lucide-react';

import { Badge, Button, Card, DataTable, type DataTableColumn, FilterField, NativeSelect, PageHeader, StatCard } from '@actoz/ui';
import { ExceptionBadge, SETTLEMENT_STATUSES, StatusPill } from '@actoz/kit-settlement';

import { type SettlementCase, SettlementShell, settlementCases } from './fixtures';
import { withLinkActions } from './link-actions';

const columns: DataTableColumn<SettlementCase>[] = [
  {
    key: 'unit',
    header: '정산단위',
    cell: (item) => (
      <a href={item.href} className="font-semibold underline underline-offset-4">
        {item.unit}
      </a>
    ),
  },
  { key: 'month', header: '정산월', cell: (item) => <span className="tabular-nums">{item.month}</span> },
  { key: 'status', header: '상태', cell: (item) => <StatusPill status={item.status} /> },
  {
    key: 'exceptions',
    header: '예외',
    align: 'end',
    cell: (item) =>
      item.exceptions > 0 ? (
        <Badge variant="solid" aria-label={`예외 ${item.exceptions}건`}>
          {item.exceptions}
        </Badge>
      ) : (
        <span className="tabular-nums text-muted-foreground">0</span>
      ),
  },
  {
    key: 'note',
    header: '비고',
    cell: (item) => {
      if (!item.note) return <span className="text-muted-foreground">—</span>;
      return 'code' in item.note ? <ExceptionBadge code={item.note.code} /> : item.note.text;
    },
  },
];

/** 정산 현황(홈): 요약 → 필터 → 정산 건 표. 상태는 StatusPill, 예외는 ExceptionBadge로 표시하고, 표 아래에 상태 순서를 안내한다. */
function SettlementHomePage() {
  return (
    <SettlementShell activeId="home">
      <PageHeader
        title="정산 현황"
        aside={
          <Button>
            <Upload aria-hidden />
            자료 업로드
          </Button>
        }
      />

      <section aria-label="요약" className="grid gap-4 sm:grid-cols-3">
        <StatCard label="검토 필요" value="2" />
        <StatCard label="자료·정산서 대기" value="3" />
        <StatCard label="미입금" value="1" />
      </section>

      <section aria-label="정산 건 목록" className="flex flex-col gap-3">
        <div role="group" aria-label="필터" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <FilterField label="정산월">
            <NativeSelect defaultValue="all" className="w-32">
              <option value="all">전체</option>
              <option value="2026.09">2026.09</option>
              <option value="2026.08">2026.08</option>
              <option value="2026.05">2026.05</option>
            </NativeSelect>
          </FilterField>
          <FilterField label="IP">
            <NativeSelect defaultValue="latale-1000" className="w-44">
              <option value="latale-1000">라테일 · 천년</option>
              <option value="all">전체</option>
            </NativeSelect>
          </FilterField>
          <FilterField label="상태">
            <NativeSelect defaultValue="all" className="w-36">
              <option value="all">전체</option>
              {SETTLEMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </NativeSelect>
          </FilterField>
        </div>

        <Card padding="none">
          <DataTable
            caption="정산 건 목록"
            columns={columns}
            rows={settlementCases}
            getRowId={(item) => item.id}
            footer={
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-body-sm text-muted-foreground">상태 순서</span>
                <ol aria-label="상태 순서" className="flex flex-wrap items-center gap-1.5">
                  {SETTLEMENT_STATUSES.map((status, index) => (
                    <li key={status} className="flex items-center gap-1.5">
                      <StatusPill status={status} />
                      {index < SETTLEMENT_STATUSES.length - 1 ? (
                        <span aria-hidden className="text-muted-foreground">
                          →
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            }
          />
        </Card>
      </section>
    </SettlementShell>
  );
}

const meta = {
  title: 'Templates/SettlementHome',
  tags: ['kit:settlement'],
  component: SettlementHomePage,
  // 정산 화면은 촘촘한 밀도(data-density="compact")가 기본이다.
  parameters: { layout: 'fullscreen', density: 'compact' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof SettlementHomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 정산 현황. 검토가 필요한 건, 대기 건, 미입금 건을 한눈에 보고 건을 눌러 들어간다. */
export const Default: Story = {};
