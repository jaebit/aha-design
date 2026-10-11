import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { useState } from 'react';

import { AppShell, Badge, Button, Callout, Card, FormField, NativeSelect, PageHeader } from '@actoz/ui';
import { ConfirmDialog, DescriptionList, SessionList } from '@actoz/kit-admin';

import { consoleRail, iamUsers, iamStatusBadge, userSessions } from './fixtures';
import { withLinkActions } from './link-actions';

type Confirm = 'none' | 'revokeAll' | 'lock' | 'deactivate';

interface UserDetailPageProps {
  /** 보여줄 사용자 id (fixtures의 iamUsers). */
  userId?: string;
  /** 처음부터 열어 둘 확인 대화상자. */
  initialConfirm?: Confirm;
}

/**
 * 관리 콘솔 · 사용자 상세: 요약 정보 → 역할 → 로그인 세션 → 위험 영역(계정 잠그기·비활성화).
 * 세션을 끊거나 계정을 잠그는 것처럼 사용자에게 바로 영향을 주는 작업은 확인 대화상자를 거친다.
 */
function UserDetailPage({ userId = 'u1', initialConfirm = 'none' }: UserDetailPageProps) {
  const user = iamUsers.find((u) => u.id === userId) ?? iamUsers[0]!;
  const [confirm, setConfirm] = useState<Confirm>(initialConfirm);
  const locked = user.status === 'locked';
  const close = (open: boolean) => {
    if (!open) setConfirm('none');
  };

  return (
    <AppShell rail={consoleRail('users')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-8 px-10 py-10">
          <nav aria-label="위치" className="text-body-sm text-muted-foreground">
            <a href="#users" className="underline underline-offset-4">
              사용자
            </a>
            <span aria-hidden> › </span>
            {user.name}
          </nav>
          <PageHeader
            title={user.name}
            description={`${user.team} · ${user.email}`}
            aside={<Button variant="secondary">비밀번호 재설정 메일 보내기</Button>}
          />

          {locked ? (
            <Callout title="로그인 실패가 5회 이어져 계정이 잠겼습니다" action={<Button size="sm">잠금 해제</Button>}>
              2026-10-10 09:05에 잠겼고, 30분 뒤 자동으로 풀립니다. 본인 확인 뒤 바로 풀 수도 있습니다.
            </Callout>
          ) : null}

          <section aria-labelledby="summary" className="flex flex-col gap-4">
            <h2 id="summary" className="text-heading font-semibold">
              요약
            </h2>
            <Card>
              <DescriptionList
                columns={3}
                items={[
                  { label: '이메일', value: user.email },
                  { label: '소속', value: user.team },
                  { label: '역할', value: <Badge>{user.role}</Badge> },
                  { label: '상태', value: <Badge tone={iamStatusBadge[user.status].tone}>{iamStatusBadge[user.status].label}</Badge> },
                  {
                    label: '2단계 인증',
                    value: user.mfa ? (
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck aria-hidden className="size-4 text-status-good" />
                        인증 앱 사용
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <ShieldOff aria-hidden className="size-4" />
                        미사용
                      </span>
                    ),
                  },
                  { label: '만든 날', value: user.createdAt },
                  { label: '마지막 로그인', value: user.lastLogin },
                ]}
              />
            </Card>
          </section>

          <section aria-labelledby="role" className="flex flex-col gap-4">
            <h2 id="role" className="text-heading font-semibold">
              역할
            </h2>
            <Card className="flex flex-wrap items-end gap-4">
              <FormField label="이 사용자의 역할">
                <NativeSelect className="w-48" defaultValue={user.role}>
                  <option value="관리자">관리자</option>
                  <option value="감사 담당">감사 담당</option>
                  <option value="일반 사용자">일반 사용자</option>
                </NativeSelect>
              </FormField>
              <Button variant="secondary">역할 저장</Button>
              <a href="#roles" className="text-body-sm underline underline-offset-4">
                역할별 권한 보기
              </a>
            </Card>
          </section>

          <section aria-labelledby="sessions" className="flex flex-col gap-4">
            <h2 id="sessions" className="text-heading font-semibold">
              로그인 세션
            </h2>
            <SessionList
              sessions={userSessions}
              allowRevokeCurrent
              onRevoke={() => {}}
              onRevokeAll={() => setConfirm('revokeAll')}
            />
          </section>

          <section aria-labelledby="danger" className="flex flex-col gap-4">
            <h2 id="danger" className="text-heading font-semibold">
              위험 영역
            </h2>
            <Card padding="none" className="flex flex-col divide-y divide-border">
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-body font-medium">계정 잠그기</span>
                  <span className="text-body-sm text-muted-foreground">로그인을 막고 모든 세션을 끊습니다. 잠금을 풀면 다시 로그인할 수 있습니다.</span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setConfirm('lock')} disabled={locked}>
                  계정 잠그기
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-body font-medium">비활성화</span>
                  <span className="text-body-sm text-muted-foreground">퇴사·장기 휴직 때 씁니다. 연결된 앱의 토큰도 모두 취소됩니다.</span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setConfirm('deactivate')}>
                  비활성화
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === 'revokeAll'}
        onOpenChange={close}
        title={`${user.name}님의 세션 ${userSessions.length}개를 모두 끊을까요?`}
        description="모든 기기와 연결된 앱에서 바로 로그아웃됩니다. 다음 로그인 때 비밀번호와 2단계 인증을 다시 거칩니다."
        confirmLabel="모두 로그아웃"
        tone="destructive"
        onConfirm={() => {}}
      />
      <ConfirmDialog
        open={confirm === 'lock'}
        onOpenChange={close}
        title={`${user.name}님의 계정을 잠글까요?`}
        description="잠그는 즉시 로그인이 막히고 열려 있는 세션이 모두 끊깁니다."
        confirmLabel="계정 잠그기"
        tone="destructive"
        onConfirm={() => {}}
      />
      <ConfirmDialog
        open={confirm === 'deactivate'}
        onOpenChange={close}
        title={`${user.name}님을 비활성화할까요?`}
        description="로그인할 수 없고, 세션과 연결된 앱의 토큰이 모두 취소됩니다. 사용자 목록에서 다시 활성화할 수 있습니다."
        confirmLabel="비활성화"
        tone="destructive"
        onConfirm={() => {}}
      />
    </AppShell>
  );
}

const meta = {
  title: 'Templates/ConsoleUserDetail',
  tags: ['kit:admin'],
  component: UserDetailPage,
  parameters: { layout: 'fullscreen', density: 'compact', brand: 'iam' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof UserDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 활성 사용자의 상세. */
export const Default: Story = {};

/** 로그인 실패로 잠긴 계정. 맨 위 안내에서 바로 잠금을 풀 수 있다. */
export const Locked: Story = { args: { userId: 'u3' } };

/** 모든 세션 끊기 전 확인. */
export const ConfirmRevokeAll: Story = { args: { initialConfirm: 'revokeAll' } };
