import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bot } from 'lucide-react';

import { Avatar, Button, type ScopeItem, ScopeList } from '@aha/ui';
import { AuthLayout } from '@aha/kit-auth';

import { iamLogo, requestedScopes } from './fixtures';
import { withLinkActions } from './link-actions';

interface ConsentPageProps {
  /** 권한을 요청한 앱 이름. */
  appName?: string;
  /** 앱이 요청한 권한. 필수 권한을 먼저 둔다. */
  scopes?: ScopeItem[];
  /** 거부했을 때. */
  onDeny?: () => void;
  /** 허용했을 때. */
  onAllow?: () => void;
}

/**
 * OAuth 동의 화면: 어느 앱이, 어느 계정으로, 무엇을 하려는지 보여주고 거부·허용을 고르게 한다.
 * scope 값이 아니라 사람이 읽는 권한 이름을 보여준다. 다른 계정으로 바꾸는 링크를 둔다.
 */
function ConsentPage({ appName = 'Claude Desktop', scopes = requestedScopes, onDeny, onAllow }: ConsentPageProps) {
  return (
    <AuthLayout
      logo={iamLogo}
      title={`${appName}이(가) 내 계정에 접근하려고 합니다`}
      description="허용한 권한은 계정 설정 > 연결된 앱에서 언제든 취소할 수 있습니다."
      footer={
        <a href="#app-info" className="underline underline-offset-4 hover:text-foreground">
          이 앱에 대해 알아보기
        </a>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-subtle px-4 py-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground [&_svg]:size-5">
            <Bot aria-hidden />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-body font-semibold text-foreground">{appName}</span>
            <span className="text-body-sm text-muted-foreground">사내 MCP Gateway를 거쳐 연결합니다</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar initials="하마" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-body-sm text-muted-foreground">로그인한 계정</span>
            <span className="truncate text-body text-foreground">hama@actoz.com</span>
          </div>
          <Button variant="link" size="sm" asChild>
            <a href="#switch-account">다른 계정</a>
          </Button>
        </div>
        <section className="flex flex-col gap-3" aria-labelledby="consent-scopes">
          <h2 id="consent-scopes" className="text-body-sm font-semibold text-foreground">
            요청한 권한
          </h2>
          <ScopeList items={scopes} />
        </section>
        <div className="flex gap-3">
          <Button variant="secondary" size="lg" className="flex-1" onClick={onDeny}>
            거부
          </Button>
          <Button size="lg" className="flex-1" onClick={onAllow}>
            허용
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}

const meta = {
  title: 'Templates/Consent',
  tags: ['kit:auth'],
  component: ConsentPage,
  parameters: { layout: 'fullscreen', brand: 'iam' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof ConsentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** MCP 클라이언트가 내 업무 목록 권한을 요청할 때. */
export const Default: Story = {};

/** 신원 확인만 요청하는 앱. 권한이 적을수록 허용하기 쉽다. */
export const SignInOnly: Story = {
  args: {
    appName: '사내 위키',
    scopes: [
      { scope: 'openid', label: '내 신원 확인', description: '로그인한 사람이 누구인지 확인합니다.', required: true },
      { scope: 'email', label: '이메일 주소 보기', description: '회사 이메일 주소를 읽습니다.' },
    ],
  },
};
