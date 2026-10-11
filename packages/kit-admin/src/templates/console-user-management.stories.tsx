import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShieldCheck, ShieldOff, UserPlus } from 'lucide-react';
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
import { BulkActionBar, ConfirmDialog } from '@actoz/kit-admin';

import { consoleRail, type IamUser, iamUsers, iamStatusBadge, type IamUserStatus } from './fixtures';
import { withLinkActions } from './link-actions';

const columns: DataTableColumn<IamUser>[] = [
  {
    key: 'name',
    header: '이름',
    cell: (user) => (
      <CellText
        primary={
          <a href={`#users/${user.id}`} className="font-semibold underline underline-offset-4">
            {user.name}
          </a>
        }
        secondary={user.email}
      />
    ),
  },
  { key: 'team', header: '소속', secondary: true, cell: (user) => user.team },
  { key: 'role', header: '역할', cell: (user) => <Badge>{user.role}</Badge> },
  {
    key: 'status',
    header: '상태',
    cell: (user) => <Badge tone={iamStatusBadge[user.status].tone}>{iamStatusBadge[user.status].label}</Badge>,
  },
  {
    key: 'mfa',
    header: '2단계 인증',
    cell: (user) =>
      user.mfa ? (
        <span className="inline-flex items-center gap-1.5 text-body-sm text-foreground">
          <ShieldCheck aria-hidden className="size-4 text-status-good" />
          사용
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground">
          <ShieldOff aria-hidden className="size-4" />
          미사용
        </span>
      ),
  },
  { key: 'lastLogin', header: '마지막 로그인', secondary: true, cell: (user) => user.lastLogin },
];

interface UserManagementPageProps {
  /** 처음 걸어 둘 상태 조건. 생략하면 전체. */
  initialStatus?: IamUserStatus | 'all';
  /** 처음 걸어 둘 이름·이메일 검색어. */
  initialQuery?: string;
  /** 처음에 골라 둔 사용자 id. */
  initialSelected?: string[];
  /** 처음부터 비활성화 확인 대화상자를 연다. */
  confirmOpen?: boolean;
}

/**
 * 관리 콘솔 · 사용자 목록: 조건 검색 → 여러 명 골라 일괄 작업(잠금 해제, 초대 재전송, 비활성화) → 되돌리기 어려운 작업은 한 번 더 확인.
 * 계정 상태(활성·잠김·초대 대기·비활성)는 Badge tone과 라벨로, 2단계 인증 사용 여부는 아이콘과 글자로 보여준다.
 * 관리 콘솔은 촘촘한 밀도(data-density="compact")로 쓴다.
 */
function UserManagementPage({
  initialStatus = 'all',
  initialQuery = '',
  initialSelected = [],
  confirmOpen = false,
}: UserManagementPageProps) {
  const [status, setStatus] = useState<IamUserStatus | 'all'>(initialStatus);
  const [query, setQuery] = useState(initialQuery);
  const [role, setRole] = useState<IamUser['role'] | 'all'>('all');
  const [applied, setApplied] = useState({ status: initialStatus, query: initialQuery, role: 'all' as IamUser['role'] | 'all' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [confirming, setConfirming] = useState(confirmOpen);
  const rows = iamUsers.filter(
    (user) =>
      (applied.status === 'all' || user.status === applied.status) &&
      (applied.role === 'all' || user.role === applied.role) &&
      (!applied.query || `${user.name} ${user.email}`.includes(applied.query)),
  );
  const filtered = applied.status !== 'all' || applied.role !== 'all' || applied.query !== '';
  const chosen = iamUsers.filter((user) => selected.includes(user.id));
  const lockedCount = chosen.filter((user) => user.status === 'locked').length;
  const invitedCount = chosen.filter((user) => user.status === 'invited').length;

  return (
    <AppShell rail={consoleRail('users')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-10 py-10">
          <PageHeader
            title="사용자"
            description="회사 계정으로 로그인하는 사용자의 상태, 역할, 2단계 인증을 관리합니다."
            aside={
              <Button>
                <UserPlus aria-hidden />
                사용자 초대
              </Button>
            }
          />

          <Card padding="none">
            <FilterBar
              onSubmit={() => {
                setApplied({ status, query, role });
                setPage(1);
                setSelected([]);
              }}
              onReset={() => {
                setStatus('all');
                setQuery('');
                setRole('all');
                setApplied({ status: 'all', query: '', role: 'all' });
                setPage(1);
                setSelected([]);
              }}
            >
              <FilterField label="이름·이메일">
                <Input className="w-56" placeholder="예: 김하마" value={query} onChange={(event) => setQuery(event.target.value)} />
              </FilterField>
              <FilterField label="상태">
                <NativeSelect className="w-32" value={status} onChange={(event) => setStatus(event.target.value as IamUserStatus | 'all')}>
                  <option value="all">전체</option>
                  <option value="active">활성</option>
                  <option value="locked">잠김</option>
                  <option value="invited">초대 대기</option>
                  <option value="disabled">비활성</option>
                </NativeSelect>
              </FilterField>
              <FilterField label="역할">
                <NativeSelect className="w-36" value={role} onChange={(event) => setRole(event.target.value as IamUser['role'] | 'all')}>
                  <option value="all">전체</option>
                  <option value="관리자">관리자</option>
                  <option value="감사 담당">감사 담당</option>
                  <option value="일반 사용자">일반 사용자</option>
                </NativeSelect>
              </FilterField>
            </FilterBar>

            <BulkActionBar className="mx-6 mb-4" selectedCount={selected.length} unit="명" onClear={() => setSelected([])}>
              <Button variant="secondary" size="sm" disabled={lockedCount === 0}>
                잠금 해제{lockedCount > 0 ? ` (${lockedCount})` : ''}
              </Button>
              <Button variant="secondary" size="sm" disabled={invitedCount === 0}>
                초대 재전송{invitedCount > 0 ? ` (${invitedCount})` : ''}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
                비활성화
              </Button>
            </BulkActionBar>

            <DataTable
              caption="사용자 목록"
              columns={columns}
              rows={rows}
              getRowId={(user) => user.id}
              getRowLabel={(user) => user.name}
              selectedIds={selected}
              onSelectedIdsChange={setSelected}
              emptyMessage="조건에 맞는 사용자가 없습니다. 조건을 바꾸거나 초기화하세요."
              footer={
                <>
                  <span className="text-body-sm text-muted-foreground">{filtered ? `조건에 맞는 ${rows.length}명` : '전체 214명'}</span>
                  <Pagination page={page} pageCount={filtered ? 1 : 27} onPageChange={setPage} />
                </>
              }
            />
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`사용자 ${chosen.length}명을 비활성화할까요?`}
        description="비활성화하면 바로 로그인할 수 없고, 열려 있는 세션과 연결된 앱의 토큰도 모두 끊깁니다. 다시 활성화하면 로그인할 수 있습니다."
        confirmLabel="비활성화"
        tone="destructive"
        onConfirm={() => setSelected([])}
      >
        <ul className="list-disc pl-5 text-body text-foreground">
          {chosen.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      </ConfirmDialog>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/ConsoleUserManagement',
  tags: ['kit:admin'],
  component: UserManagementPage,
  // 관리 콘솔은 촘촘한 밀도가 기본이다. 툴바나 갤러리에서 기본 밀도와 비교할 수 있다.
  parameters: { layout: 'fullscreen', density: 'compact', brand: 'iam' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof UserManagementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사용자 목록. 행을 고르면 표 위에 일괄 작업 줄이 나타난다. */
export const Default: Story = {};

/** 세 명을 고른 상태. 잠긴 계정이 있어 잠금 해제를 쓸 수 있다. */
export const Selected: Story = { args: { initialSelected: ['u2', 'u3', 'u4'] } };

/** 일괄 비활성화 전 확인. 누구를 비활성화하는지 이름과 이메일로 다시 보여준다. */
export const ConfirmDeactivate: Story = { args: { initialSelected: ['u2', 'u3', 'u4'], confirmOpen: true } };

/** 조건에 맞는 사용자가 없을 때. */
export const Empty: Story = { args: { initialQuery: '없는사람' } };
