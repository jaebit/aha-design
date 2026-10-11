import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShieldCheck } from 'lucide-react';

import { Button, Checkbox, FormField, Input, ScopeList } from '@aha/ui';
import { OtpInput } from '@aha/kit-auth';

import { AuthLayout } from './auth-layout';

const meta = {
  title: 'Auth/AuthLayout',
  component: AuthLayout,
  tags: ['autodocs', 'kit:auth'],
  // 예시는 IAM 인증 화면이다. 로고를 넘기고 IAM 브랜드로 그린다 (기본 로고는 AHA).
  parameters: { layout: 'fullscreen', brand: 'iam' },
  args: {
    title: '로그인',
    children: null,
    logo: (
      <>
        <ShieldCheck aria-hidden className="size-7 text-primary" />
        IAM
      </>
    ),
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 이메일·비밀번호 로그인. 주요 버튼은 "로그인" 하나다. */
export const Login: Story = {
  args: {
    title: '로그인',
    description: '회사 계정으로 로그인하세요.',
    footer: (
      <>
        <a href="#help" className="underline underline-offset-4 hover:text-foreground">
          도움말
        </a>
        <span aria-hidden>·</span>
        <a href="#privacy" className="underline underline-offset-4 hover:text-foreground">
          개인정보 처리방침
        </a>
      </>
    ),
    children: (
      <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
        <FormField label="이메일">
          <Input type="email" autoComplete="username" placeholder="name@actoz.com" />
        </FormField>
        <FormField
          label="비밀번호"
          labelAction={
            <Button variant="link" size="sm" asChild>
              <a href="#reset">비밀번호 찾기</a>
            </Button>
          }
        >
          <Input type="password" autoComplete="current-password" />
        </FormField>
        <Checkbox label="이 기기에서 로그인 유지" />
        <Button type="submit" size="lg" className="w-full">
          로그인
        </Button>
      </form>
    ),
  },
};

/** 로그인 실패. 어느 칸이 틀렸는지 알려 주지 않고 한 문구로 알린다. */
export const LoginError: Story = {
  args: {
    title: '로그인',
    description: '회사 계정으로 로그인하세요.',
    children: (
      <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
        <p id="login-error" role="alert" className="text-body-sm text-destructive">
          이메일 또는 비밀번호가 맞지 않습니다. 5회 틀리면 계정이 30분 잠깁니다.
        </p>
        <FormField label="이메일">
          <Input type="email" autoComplete="username" defaultValue="hama@actoz.com" aria-invalid aria-describedby="login-error" />
        </FormField>
        <FormField label="비밀번호">
          <Input type="password" autoComplete="current-password" defaultValue="wrong-password" aria-invalid aria-describedby="login-error" />
        </FormField>
        <Button type="submit" size="lg" className="w-full">
          로그인
        </Button>
      </form>
    ),
  },
};

/** 2단계 인증. 6자리를 모두 넣으면 자동으로 확인한다. */
export const TwoFactor: Story = {
  args: {
    title: '2단계 인증',
    description: '인증 앱에 표시된 6자리 코드를 입력하세요.',
    footer: (
      <a href="#recovery" className="underline underline-offset-4 hover:text-foreground">
        복구 코드로 로그인
      </a>
    ),
    children: (
      <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
        <FormField label="인증 코드" description="코드는 30초마다 바뀝니다.">
          <OtpInput />
        </FormField>
        <Button type="submit" size="lg" className="w-full">
          확인
        </Button>
      </form>
    ),
  },
};

/** OAuth 동의. 앱 이름과 요청 권한을 보여주고 허용·거부를 고르게 한다. */
export const Consent: Story = {
  args: {
    title: 'Claude Desktop이 내 계정에 접근하려고 합니다',
    description: 'hama@actoz.com 계정으로 아래 권한을 허용합니다. 허용한 권한은 계정 설정 > 연결된 앱에서 언제든 취소할 수 있습니다.',
    children: (
      <div className="flex flex-col gap-6">
        <ScopeList
          items={[
            { scope: 'openid', label: '내 신원 확인', description: '로그인한 사람이 누구인지 확인합니다.', required: true },
            { scope: 'profile', label: '이름과 소속 보기', description: '이름, 부서, 직급을 읽습니다.' },
            { scope: 'work.my.read', label: '내 업무 목록 보기', description: '업무요청게시판에서 내가 담당한 업무만 읽습니다.' },
          ]}
        />
        <div className="flex gap-3">
          <Button variant="secondary" size="lg" className="flex-1">
            거부
          </Button>
          <Button size="lg" className="flex-1">
            허용
          </Button>
        </div>
      </div>
    ),
  },
};

/** 기본 로고("AHA 💡")와 AHA 브랜드. 로고를 넘기지 않으면 이렇게 보인다. */
export const DefaultLogo: Story = {
  parameters: { brand: 'aha' },
  args: {
    logo: undefined,
    title: '로그인',
    description: '회사 계정으로 로그인하세요.',
    children: (
      <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
        <FormField label="이메일">
          <Input type="email" autoComplete="username" placeholder="name@actoz.com" />
        </FormField>
        <Button type="submit" size="lg" className="w-full">
          다음
        </Button>
      </form>
    ),
  },
};
