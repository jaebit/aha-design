import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { AppShell, Button, FormField, Input, PageHeader, Textarea } from '@actoz/ui';
import { FormActions, FormSection, PermissionMatrix } from '@actoz/kit-admin';

import { auditorPermissions, consoleRail, permissionActions, permissionResources } from './fixtures';
import { withLinkActions } from './link-actions';

interface RoleEditPageProps {
  /** 역할 이름 초깃값. */
  initialName?: string;
  /** 저장을 눌렀는데 이름이 비어 있거나 겹치는 상태를 보여준다. */
  showErrors?: boolean;
}

/**
 * 관리 콘솔 · 역할 편집: 이름·설명 → 리소스별 권한 표 → 아래에 붙은 저장 줄.
 * 저장하면 이 역할을 가진 사용자에게 바로 적용되므로, 저장 줄에 영향받는 사람 수를 적는다.
 */
function RoleEditPage({ initialName = '감사 담당', showErrors = false }: RoleEditPageProps) {
  const [name, setName] = useState(initialName);
  const [permissions, setPermissions] = useState<Record<string, string[]>>(auditorPermissions);

  return (
    <AppShell rail={consoleRail('roles')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-8 px-10 pt-10">
          <nav aria-label="위치" className="text-body-sm text-muted-foreground">
            <a href="#roles" className="underline underline-offset-4">
              역할
            </a>
            <span aria-hidden> › </span>
            {initialName || '새 역할'}
          </nav>
          <PageHeader title="역할 편집" description="역할마다 관리 콘솔에서 보고 바꿀 수 있는 범위를 정합니다." />

          <FormSection title="기본 정보" description="사용자 상세와 감사 로그에 이 이름으로 보입니다.">
            <FormField
              label="역할 이름"
              required
              error={showErrors ? (name ? '같은 이름의 역할이 이미 있습니다.' : '역할 이름을 입력하세요.') : undefined}
            >
              <Input className="max-w-md" value={name} onChange={(event) => setName(event.target.value)} />
            </FormField>
            <FormField label="설명" description="이 역할을 누구에게 주는지 한 줄로 적습니다.">
              <Textarea className="max-w-2xl" defaultValue="감사 기록을 확인하는 내부 감사·보안 담당자. 설정을 바꿀 수 없습니다." rows={2} />
            </FormField>
          </FormSection>

          <FormSection title="권한" description="감사 로그는 기록을 보기만 할 수 있습니다.">
            <PermissionMatrix
              caption="리소스별 권한"
              resources={permissionResources}
              actions={permissionActions}
              value={permissions}
              onValueChange={setPermissions}
            />
          </FormSection>

          <FormActions sticky note="저장하면 이 역할의 사용자 2명에게 바로 적용됩니다.">
            <Button variant="secondary">취소</Button>
            <Button>저장</Button>
          </FormActions>
        </div>
      </div>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/ConsoleRoleEdit',
  tags: ['kit:admin'],
  component: RoleEditPage,
  parameters: { layout: 'fullscreen', density: 'compact', brand: 'iam' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof RoleEditPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 감사 담당 역할 편집. 권한 표를 눌러 바로 바꿀 수 있다. */
export const Default: Story = {};

/** 저장했는데 이름이 비어 있을 때. 오류 문구가 입력 아래에 보인다. */
export const ValidationError: Story = { args: { initialName: '', showErrors: true } };
