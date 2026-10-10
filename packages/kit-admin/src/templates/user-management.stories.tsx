import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserPlus } from 'lucide-react';
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
} from '@aha/ui';
import { BulkActionBar, ConfirmDialog } from '@aha/kit-admin';

import { type AdminUser, adminRail, adminUsers, statusBadge, usersSidebar } from './fixtures';
import { withLinkActions } from './link-actions';

const columns: DataTableColumn<AdminUser>[] = [
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
  { key: 'team', header: '소속 팀', cell: (user) => user.team },
  { key: 'role', header: '역할', cell: (user) => <Badge variant="soft">{user.role}</Badge> },
  {
    key: 'status',
    header: '상태',
    cell: (user) => <Badge tone={statusBadge[user.status].tone}>{statusBadge[user.status].label}</Badge>,
  },
  { key: 'lastSeen', header: '최근 접속', secondary: true, cell: (user) => user.lastSeen },
];

interface UserManagementPageProps {
  /** 처음에 골라 둔 사용자 id. */
  initialSelected?: string[];
  /** 처음부터 비활성화 확인 대화상자를 연다. */
  confirmOpen?: boolean;
}

/** 관리자 · 사용자 목록: 조건 검색 → 여러 명 골라 일괄 작업 → 되돌리기 어려운 작업은 한 번 더 확인. */
function UserManagementPage({ initialSelected = [], confirmOpen = false }: UserManagementPageProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [page, setPage] = useState(1);
  const [confirming, setConfirming] = useState(confirmOpen);
  const chosen = adminUsers.filter((user) => selected.includes(user.id));

  return (
    <AppShell rail={adminRail('users')} sidebar={usersSidebar('list')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-10 py-10">
          <PageHeader
            title="사용자 목록"
            description="AHA 서비스를 쓰는 사내 사용자와 역할을 관리해요."
            aside={
              <Button>
                <UserPlus aria-hidden />
                사용자 초대
              </Button>
            }
          />

          <Card padding="none">
            <FilterBar onSubmit={() => {}} onReset={() => {}}>
              <FilterField label="이름·이메일">
                <Input className="w-56" placeholder="예: 김하마" />
              </FilterField>
              <FilterField label="역할">
                <NativeSelect defaultValue="all" className="w-36">
                  <option value="all">전체</option>
                  <option value="admin">관리자</option>
                  <option value="operator">운영자</option>
                  <option value="viewer">조회 전용</option>
                </NativeSelect>
              </FilterField>
              <FilterField label="상태">
                <NativeSelect defaultValue="all" className="w-32">
                  <option value="all">전체</option>
                  <option value="active">활성</option>
                  <option value="invited">초대됨</option>
                  <option value="inactive">비활성</option>
                </NativeSelect>
              </FilterField>
            </FilterBar>

            {selected.length > 0 ? (
              <div className="px-6 pb-4">
                <BulkActionBar selectedCount={selected.length} unit="명" onClear={() => setSelected([])}>
                  <Button variant="secondary" size="sm">
                    역할 변경
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
                    비활성화
                  </Button>
                </BulkActionBar>
              </div>
            ) : null}

            <DataTable
              caption="사용자 목록"
              columns={columns}
              rows={adminUsers}
              getRowId={(user) => user.id}
              getRowLabel={(user) => user.name}
              selectedIds={selected}
              onSelectedIdsChange={setSelected}
              footer={
                <>
                  <span className="text-body-sm text-muted-foreground">전체 128명</span>
                  <Pagination page={page} pageCount={16} onPageChange={setPage} />
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
        description="비활성화한 사용자는 로그인할 수 없어요. 사용자 목록에서 언제든 다시 활성화할 수 있어요."
        confirmLabel="비활성화"
        tone="destructive"
        onConfirm={() => setSelected([])}
      >
        <ul className="list-disc pl-5 text-body text-foreground">
          {chosen.map((user) => (
            <li key={user.id}>
              {user.name} ({user.team})
            </li>
          ))}
        </ul>
      </ConfirmDialog>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/UserManagement',
  tags: ['kit:admin'],
  component: UserManagementPage,
  // 관리자 화면은 촘촘한 밀도(data-density="compact")가 기본이다. 툴바나 갤러리에서 기본 밀도와 비교할 수 있다.
  parameters: { layout: 'fullscreen', density: 'compact' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof UserManagementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사용자 목록. 행을 고르면 표 위에 일괄 작업 줄이 나타난다. */
export const Default: Story = {};

/** 세 명을 고른 상태. */
export const WithSelection: Story = { args: { initialSelected: ['u2', 'u3', 'u6'] } };

/** 일괄 비활성화 전 확인. */
export const ConfirmDeactivate: Story = { args: { initialSelected: ['u2', 'u3', 'u6'], confirmOpen: true } };
