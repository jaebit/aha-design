import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { AppShell, Badge, Button, Checkbox, Input, NativeSelect, PageHeader, Textarea } from '@aha/ui';
import {
  ConfirmDialog,
  DescriptionList,
  FormActions,
  FormField,
  FormSection,
  PermissionMatrix,
} from '@aha/kit-admin';

import { adminRail, usersSidebar } from './fixtures';
import { withLinkActions } from './link-actions';

const actions = [
  { key: 'read', label: '조회' },
  { key: 'write', label: '편집' },
  { key: 'delete', label: '삭제' },
];

const resources = [
  { key: 'users', label: '사용자', description: '사용자 목록, 역할 변경' },
  { key: 'content', label: '공지와 문서', description: '공지 게시, 규정 문서 등록' },
  { key: 'stats', label: '통계', description: '사용 현황, 다운로드', unavailable: ['write', 'delete'] },
  { key: 'settings', label: '시스템 설정' },
];

const rolePermissions: Record<string, Record<string, string[]>> = {
  admin: { users: ['read', 'write', 'delete'], content: ['read', 'write', 'delete'], stats: ['read'], settings: ['read', 'write'] },
  operator: { users: ['read', 'write'], content: ['read', 'write', 'delete'], stats: ['read'], settings: [] },
  viewer: { users: ['read'], content: ['read'], stats: ['read'], settings: [] },
};

interface UserEditPageProps {
  /** 저장을 눌렀을 때 검증 오류를 보여준다. */
  showErrors?: boolean;
}

/** 관리자 · 사용자 편집: 위에 읽기 전용 요약, 아래에 묶음별 편집 폼과 고정된 저장 줄. */
function UserEditPage({ showErrors = false }: UserEditPageProps) {
  const [role, setRole] = useState('operator');
  const [permissions, setPermissions] = useState(rolePermissions.operator!);
  const [dirty, setDirty] = useState(showErrors ? 1 : 0);
  const touch = () => setDirty((n) => n + 1);

  return (
    <AppShell rail={adminRail('users')} sidebar={usersSidebar('list')}>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col gap-8 px-10 pt-10">
          <nav aria-label="위치" className="flex items-center gap-1 text-body-sm text-muted-foreground">
            <a href="#users" className="hover:text-foreground">
              사용자 목록
            </a>
            <ChevronRight aria-hidden className="size-4" />
            <span>이수달</span>
          </nav>
          <PageHeader
            title="이수달"
            description="플랫폼팀 · sudal@actoz.com"
            aside={
              <ConfirmDialog
                trigger={<Button variant="destructive">비활성화</Button>}
                title="이수달 님을 비활성화할까요?"
                description="비활성화하면 로그인할 수 없어요. 사용자 목록에서 언제든 다시 활성화할 수 있어요."
                confirmLabel="비활성화"
                tone="destructive"
                onConfirm={() => {}}
              />
            }
          />

          <DescriptionList
            columns={3}
            items={[
              { label: '상태', value: <Badge tone="good">활성</Badge> },
              { label: '가입일', value: '2025-03-02' },
              { label: '최근 접속', value: '2026-10-10 08:47' },
            ]}
          />

          <form className="flex flex-col" onSubmit={(event) => event.preventDefault()} onChange={touch}>
            <FormSection title="기본 정보" description="이름과 소속은 사내 인사 정보와 같게 적어요.">
              <FormField label="이름" required error={showErrors ? '이름을 입력해 주세요.' : undefined}>
                <Input defaultValue={showErrors ? '' : '이수달'} />
              </FormField>
              <FormField label="이메일" description="로그인 계정이라 바꿀 수 없어요.">
                <Input type="email" defaultValue="sudal@actoz.com" disabled />
              </FormField>
              <FormField label="소속 팀">
                <NativeSelect defaultValue="platform">
                  <option value="aha">팀아하</option>
                  <option value="platform">플랫폼팀</option>
                  <option value="security">보안팀</option>
                </NativeSelect>
              </FormField>
            </FormSection>

            <FormSection
              title="역할과 권한"
              description="역할을 고르면 기본 권한이 채워져요. 이 사용자에게만 권한을 더하거나 뺄 수 있어요."
            >
              <FormField label="역할" required>
                <NativeSelect
                  value={role}
                  onChange={(event) => {
                    setRole(event.target.value);
                    setPermissions(rolePermissions[event.target.value]!);
                  }}
                >
                  <option value="admin">관리자</option>
                  <option value="operator">운영자</option>
                  <option value="viewer">조회 전용</option>
                </NativeSelect>
              </FormField>
              <PermissionMatrix
                caption="이수달 님의 권한"
                actions={actions}
                resources={resources}
                value={permissions}
                onValueChange={(next) => {
                  setPermissions(next);
                  touch();
                }}
              />
            </FormSection>

            <FormSection title="알림과 메모">
              <Checkbox label="권한이 바뀌면 본인에게 메일로 알리기" defaultChecked />
              <FormField label="메모" description="관리자만 볼 수 있어요.">
                <Textarea defaultValue="2026년 10월 조직 개편으로 플랫폼팀으로 옮김." />
              </FormField>
            </FormSection>

            <FormActions sticky note={dirty > 0 ? `저장하지 않은 변경 ${dirty}건` : undefined}>
              <Button variant="secondary" type="button">
                취소
              </Button>
              <Button type="submit">저장</Button>
            </FormActions>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/UserEdit',
  tags: ['kit:admin'],
  component: UserEditPage,
  parameters: { layout: 'fullscreen' },
  globals: { density: 'compact' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof UserEditPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사용자 상세·편집. 역할을 바꾸면 권한 표가 그 역할의 기본값으로 채워진다. */
export const Default: Story = {};

/** 저장했을 때 필수 항목이 비어 있는 경우. */
export const WithErrors: Story = { args: { showErrors: true } };
