import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { AppShell, Badge, Button, Card, PageHeader, ScopeList } from '@aha/ui';
import { ConfirmDialog, DescriptionList, SecretField } from '@aha/kit-admin';

import { clientScopes, consoleRail, oauthClient } from './fixtures';
import { withLinkActions } from './link-actions';

interface ClientDetailPageProps {
  /** 비밀값을 막 재발급한 직후. 새 비밀값을 한 번만 전부 보여준다. */
  justRotated?: boolean;
  /** 처음부터 재발급 확인 대화상자를 연다. */
  confirmOpen?: boolean;
}

/**
 * 관리 콘솔 · OAuth 클라이언트 상세: 기본 정보 → 클라이언트 ID·비밀값 → 리디렉션 URI → 허용 scope.
 * 비밀값은 가려서 보여주고, 재발급은 기존 비밀값을 쓰는 서버가 바로 끊기므로 한 번 더 확인한다.
 * 새로 만든 비밀값은 이 화면을 벗어나면 다시 볼 수 없다.
 */
function ClientDetailPage({ justRotated = false, confirmOpen = false }: ClientDetailPageProps) {
  const [confirming, setConfirming] = useState(confirmOpen);
  const [rotated, setRotated] = useState(justRotated);

  return (
    <AppShell rail={consoleRail('clients')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-8 px-10 py-10">
          <nav aria-label="위치" className="text-body-sm text-muted-foreground">
            <a href="#clients" className="underline underline-offset-4">
              클라이언트
            </a>
            <span aria-hidden> › </span>
            {oauthClient.name}
          </nav>
          <PageHeader
            title={oauthClient.name}
            description="Claude Desktop, Codex 같은 MCP 클라이언트가 이 앱을 거쳐 사내 MCP 서버에 접근합니다."
            aside={<Button variant="secondary">설정 편집</Button>}
          />

          <section aria-labelledby="info" className="flex flex-col gap-4">
            <h2 id="info" className="text-heading font-semibold">
              기본 정보
            </h2>
            <Card>
              <DescriptionList
                items={[
                  { label: '클라이언트 이름', value: oauthClient.name },
                  { label: '유형', value: <Badge>{oauthClient.type}</Badge> },
                  { label: '만든 사람', value: oauthClient.owner },
                  { label: '만든 날', value: oauthClient.createdAt },
                ]}
              />
            </Card>
          </section>

          <section aria-labelledby="credentials" className="flex flex-col gap-4">
            <h2 id="credentials" className="text-heading font-semibold">
              자격 증명
            </h2>
            <Card className="flex flex-col gap-6">
              <SecretField label="클라이언트 ID" value={oauthClient.clientId} masked={false} />
              <SecretField
                label="클라이언트 비밀값"
                value={rotated ? oauthClient.newSecret : oauthClient.secret}
                revealOnce={rotated}
                onRegenerate={() => setConfirming(true)}
                description={rotated ? '방금 재발급했습니다. 서버 설정에 바로 넣으세요.' : `${oauthClient.secretCreatedAt}에 발급. 서버 설정에만 두고 코드나 채팅에 붙여넣지 않습니다.`}
              />
            </Card>
          </section>

          <section aria-labelledby="redirects" className="flex flex-col gap-4">
            <h2 id="redirects" className="text-heading font-semibold">
              리디렉션 URI
            </h2>
            <Card padding="none">
              <ul className="flex flex-col divide-y divide-border">
                {oauthClient.redirectUris.map((uri) => (
                  <li key={uri} className="px-5 py-3 font-mono text-body-sm text-foreground">
                    {uri}
                  </li>
                ))}
              </ul>
            </Card>
            <p className="text-body-sm text-muted-foreground">로그인 뒤 이 주소로만 돌아갑니다. 정확히 같은 문자열이어야 하며, 끝 슬래시도 구분합니다.</p>
          </section>

          <section aria-labelledby="scopes" className="flex flex-col gap-4">
            <h2 id="scopes" className="text-heading font-semibold">
              허용 scope
            </h2>
            <ScopeList items={clientScopes} showScope />
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="클라이언트 비밀값을 재발급할까요?"
        description="지금 비밀값은 바로 쓸 수 없게 됩니다. 이 비밀값으로 토큰을 받는 서버는 새 값으로 바꿀 때까지 로그인이 실패합니다."
        confirmLabel="재발급"
        tone="destructive"
        onConfirm={() => setRotated(true)}
      />
    </AppShell>
  );
}

const meta = {
  title: 'Templates/ConsoleClientDetail',
  tags: ['kit:admin'],
  component: ClientDetailPage,
  parameters: { layout: 'fullscreen', density: 'compact', brand: 'iam' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof ClientDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 클라이언트 상세. 비밀값은 마지막 4자리만 보인다. */
export const Default: Story = {};

/** 비밀값을 막 재발급한 직후. 새 값을 한 번만 전부 보여준다. */
export const NewSecret: Story = { args: { justRotated: true } };

/** 비밀값 재발급 전 확인. */
export const ConfirmRotate: Story = { args: { confirmOpen: true } };
