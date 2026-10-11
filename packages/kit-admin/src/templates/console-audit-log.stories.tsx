import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download } from 'lucide-react';
import { useState } from 'react';

import {
  AppShell,
  Badge,
  Button,
  Card,
  CellText,
  DataTable,
  type DataTableColumn,
  FilterBar,
  FilterField,
  Input,
  NativeSelect,
  PageHeader,
  Pagination,
} from '@actoz/ui';

import { type AuditEvent, auditEvents, auditResultBadge, type AuditResult, consoleRail } from './fixtures';
import { withLinkActions } from './link-actions';

const columns: DataTableColumn<AuditEvent>[] = [
  { key: 'at', header: '시각', cell: (event) => <span className="font-mono text-body-sm">{event.at}</span> },
  {
    key: 'actor',
    header: '사용자',
    cell: (event) => (
      <CellText
        primary={
          <a href={`#users?email=${encodeURIComponent(event.actorEmail)}`} className="underline underline-offset-4">
            {event.actor}
          </a>
        }
        secondary={event.actorEmail}
      />
    ),
  },
  {
    key: 'event',
    header: '이벤트',
    cell: (event) => <CellText primary={<code className="font-mono text-body-sm">{event.event}</code>} secondary={event.summary} />,
  },
  {
    key: 'result',
    header: '결과',
    cell: (event) => <Badge tone={auditResultBadge[event.result].tone}>{auditResultBadge[event.result].label}</Badge>,
  },
  { key: 'ip', header: 'IP', secondary: true, cell: (event) => <span className="font-mono text-body-sm">{event.ip}</span> },
];

interface AuditLogPageProps {
  /** 처음 걸어 둘 결과 조건. */
  initialResult?: AuditResult | 'all';
  /** 처음 걸어 둘 사용자 검색어. */
  initialQuery?: string;
}

/**
 * 관리 콘솔 · 감사 로그: 기간·이벤트·결과·사용자로 걸러 보는 읽기 전용 기록.
 * 이벤트는 코드(login.failed 등)와 사람이 읽는 요약을 함께 보여주고, 결과는 Badge tone과 라벨로 표시한다.
 */
function AuditLogPage({ initialResult = 'all', initialQuery = '' }: AuditLogPageProps) {
  const [result, setResult] = useState<AuditResult | 'all'>(initialResult);
  const [query, setQuery] = useState(initialQuery);
  const [applied, setApplied] = useState({ result: initialResult, query: initialQuery });
  const [page, setPage] = useState(1);
  const rows = auditEvents.filter(
    (event) =>
      (applied.result === 'all' || event.result === applied.result) &&
      (!applied.query || `${event.actor} ${event.actorEmail}`.includes(applied.query)),
  );
  const filtered = applied.result !== 'all' || applied.query !== '';

  return (
    <AppShell rail={consoleRail('audit')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-10 py-10">
          <PageHeader
            title="감사 로그"
            description="로그인, 2단계 인증, 역할·클라이언트 변경 기록입니다. 기록은 1년 동안 보관하며 고칠 수 없습니다."
            aside={
              <Button variant="secondary">
                <Download aria-hidden />
                CSV 내보내기
              </Button>
            }
          />

          <Card padding="none">
            <FilterBar
              onSubmit={() => {
                setApplied({ result, query });
                setPage(1);
              }}
              onReset={() => {
                setResult('all');
                setQuery('');
                setApplied({ result: 'all', query: '' });
              }}
            >
              <FilterField label="시작일">
                <Input type="date" className="w-40" defaultValue="2026-10-09" />
              </FilterField>
              <FilterField label="종료일">
                <Input type="date" className="w-40" defaultValue="2026-10-10" />
              </FilterField>
              <FilterField label="이벤트">
                <NativeSelect className="w-44" defaultValue="all">
                  <option value="all">전체</option>
                  <option value="login">로그인</option>
                  <option value="mfa">2단계 인증</option>
                  <option value="role">역할</option>
                  <option value="client">클라이언트</option>
                </NativeSelect>
              </FilterField>
              <FilterField label="결과">
                <NativeSelect className="w-28" value={result} onChange={(event) => setResult(event.target.value as AuditResult | 'all')}>
                  <option value="all">전체</option>
                  <option value="success">성공</option>
                  <option value="failure">실패</option>
                </NativeSelect>
              </FilterField>
              <FilterField label="사용자">
                <Input className="w-48" placeholder="이름 또는 이메일" value={query} onChange={(event) => setQuery(event.target.value)} />
              </FilterField>
            </FilterBar>

            <DataTable
              caption="감사 로그"
              columns={columns}
              rows={rows}
              getRowId={(event) => event.id}
              emptyMessage="조건에 맞는 기록이 없습니다. 기간을 넓히거나 조건을 초기화하세요."
              footer={
                <>
                  <span className="text-body-sm text-muted-foreground">{filtered ? `조건에 맞는 ${rows.length}건` : '기간 안 1,284건'}</span>
                  <Pagination page={page} pageCount={filtered ? 1 : 52} onPageChange={setPage} />
                </>
              }
            />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/ConsoleAuditLog',
  tags: ['kit:admin'],
  component: AuditLogPage,
  parameters: { layout: 'fullscreen', density: 'compact', brand: 'iam' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof AuditLogPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 최근 이틀의 감사 로그. */
export const Default: Story = {};

/** 실패한 기록만. 로그인 실패가 이어지는 계정을 찾을 때. */
export const FailedOnly: Story = { args: { initialResult: 'failure' } };

/** 조건에 맞는 기록이 없을 때. */
export const Empty: Story = { args: { initialQuery: '없는사람' } };
