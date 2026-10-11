import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, LockKeyhole } from 'lucide-react';
import { type FormEvent, useId } from 'react';

import { Button, Callout, Checkbox, FormField, Input } from '@aha/ui';
import { AuthLayout } from '@aha/kit-auth';

import { iamLogo } from './fixtures';
import { withLinkActions } from './link-actions';

interface LoginPageProps {
  /**
   * 화면 상태.
   * - `default`: 처음 연 로그인 화면
   * - `error`: 이메일 또는 비밀번호가 틀림. 어느 칸이 틀렸는지 밝히지 않는다.
   * - `locked`: 실패가 쌓여 계정이 잠김. 잠금 해제 방법을 안내한다.
   */
  state?: 'default' | 'error' | 'locked';
  /** 로그인 버튼을 눌렀을 때. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * 로그인 화면: 이메일 + 비밀번호 + 로그인 유지 + 로그인 버튼 하나.
 * 비밀번호 찾기는 비밀번호 라벨 옆에, 도움말·개인정보 처리방침은 카드 아래에 둔다.
 */
function LoginPage({ state = 'default', onSubmit }: LoginPageProps) {
  const errorId = useId();
  // 로그인 실패는 폼 위 문구 하나로 알리고 두 칸에 함께 건다. 한 칸에만 걸면 어느 칸이 틀렸는지 드러난다.
  const failed = state === 'error';
  const failedProps = failed ? { 'aria-invalid': true, 'aria-describedby': errorId } : {};
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };
  return (
    <AuthLayout
      logo={iamLogo}
      title="로그인"
      description="회사 계정으로 로그인하세요."
      footer={
        <>
          <a href="#help" className="underline underline-offset-4 hover:text-foreground">
            도움말
          </a>
          <span aria-hidden>·</span>
          <a href="#privacy" className="underline underline-offset-4 hover:text-foreground">
            개인정보 처리방침
          </a>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {state === 'locked' ? (
          <Callout
            role="alert"
            title={
              <span className="flex items-center gap-2">
                <LockKeyhole aria-hidden className="size-4 text-status-serious" />
                계정이 잠겼습니다
              </span>
            }
          >
            비밀번호를 5회 틀려 30분 동안 로그인할 수 없습니다. 바로 풀려면{' '}
            <a href="#reset" className="font-semibold text-foreground underline underline-offset-4">
              비밀번호를 재설정
            </a>
            하세요.
          </Callout>
        ) : null}
        {failed ? (
          <p id={errorId} role="alert" className="flex items-start gap-2 text-body-sm text-destructive">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            이메일 또는 비밀번호가 맞지 않습니다. 5회 틀리면 계정이 30분 동안 잠깁니다.
          </p>
        ) : null}
        <FormField label="이메일">
          <Input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="name@actoz.com"
            defaultValue={state === 'default' ? undefined : 'hama@actoz.com'}
            disabled={state === 'locked'}
            {...failedProps}
          />
        </FormField>
        <FormField
          label="비밀번호"
          labelAction={
            <Button variant="link" size="sm" asChild>
              <a href="#reset">비밀번호 찾기</a>
            </Button>
          }
        >
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            disabled={state === 'locked'}
            {...failedProps}
          />
        </FormField>
        <Checkbox name="remember" label="이 기기에서 로그인 유지" disabled={state === 'locked'} />
        <Button type="submit" size="lg" className="w-full" disabled={state === 'locked'}>
          로그인
        </Button>
      </form>
    </AuthLayout>
  );
}

const meta = {
  title: 'Templates/Login',
  tags: ['kit:auth'],
  component: LoginPage,
  parameters: { layout: 'fullscreen', brand: 'iam' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 처음 연 로그인 화면. */
export const Default: Story = {};

/** 로그인 실패. 한 문구로 알리고 잠금 정책을 함께 알려 준다. */
export const Failed: Story = { args: { state: 'error' } };

/** 계정 잠김. 입력을 막고 잠금 해제 방법을 안내한다. */
export const Locked: Story = { args: { state: 'locked' } };
