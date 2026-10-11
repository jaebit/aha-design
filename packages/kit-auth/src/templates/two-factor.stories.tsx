import type { Meta, StoryObj } from '@storybook/react-vite';
import { type FormEvent, useState } from 'react';

import { Button, FormField } from '@aha/ui';
import { AuthLayout, OtpInput } from '@aha/kit-auth';

import { iamLogo } from './fixtures';
import { withLinkActions } from './link-actions';

interface TwoFactorPageProps {
  /** 처음부터 코드가 틀린 상태로 보여준다. */
  invalid?: boolean;
  /** 6자리를 다 넣었거나 확인 버튼을 눌렀을 때. */
  onVerify?: (code: string) => void;
}

/**
 * 2단계 인증 화면: 인증 앱 6자리 코드. 다 넣으면 자동으로 확인하고, 확인 버튼도 둔다.
 * 코드를 못 받는 사람을 위해 복구 코드와 다른 인증 방법 링크를 카드 아래에 둔다.
 */
function TwoFactorPage({ invalid = false, onVerify }: TwoFactorPageProps) {
  const [code, setCode] = useState(invalid ? '482913' : '');
  const [error, setError] = useState(invalid);
  const verify = (value: string) => {
    setError(false);
    onVerify?.(value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verify(code);
  };
  return (
    <AuthLayout
      logo={iamLogo}
      title="2단계 인증"
      description="hama@actoz.com 계정의 인증 앱에 표시된 6자리 코드를 입력하세요."
      footer={
        <>
          <a href="#recovery" className="underline underline-offset-4 hover:text-foreground">
            복구 코드로 로그인
          </a>
          <span aria-hidden>·</span>
          <a href="#other-method" className="underline underline-offset-4 hover:text-foreground">
            다른 방법으로 인증
          </a>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <FormField
          label="인증 코드"
          description="코드는 30초마다 바뀝니다."
          error={error ? '코드가 맞지 않습니다. 인증 앱의 새 코드를 입력하세요.' : undefined}
        >
          <OtpInput
            autoFocus
            value={code}
            onChange={(next) => {
              setCode(next);
              setError(false);
            }}
            onComplete={verify}
          />
        </FormField>
        <Button type="submit" size="lg" className="w-full" disabled={code.length < 6}>
          확인
        </Button>
      </form>
    </AuthLayout>
  );
}

const meta = {
  title: 'Templates/TwoFactor',
  tags: ['kit:auth'],
  component: TwoFactorPage,
  parameters: { layout: 'fullscreen', brand: 'iam' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof TwoFactorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 코드 입력 전. 첫 칸에 포커스가 있다. */
export const Default: Story = {};

/** 코드가 틀렸을 때. 칸 테두리와 오류 문구로 알린다. */
export const Invalid: Story = { args: { invalid: true } };
