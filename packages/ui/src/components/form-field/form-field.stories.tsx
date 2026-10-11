import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Input, NativeSelect, Textarea } from '@aha/ui';

import { FormField } from './form-field';

const meta = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: { label: '이메일', children: <Input type="email" defaultValue="hama@actoz.com" /> },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 필수 항목과 도움말. */
export const Required: Story = {
  args: { required: true, description: '사내 메일 주소만 쓸 수 있어요.' },
};

/** 오류: 무엇을 고치면 되는지 적는다. 입력 테두리가 destructive 색이 된다. */
export const WithError: Story = {
  args: {
    required: true,
    children: <Input type="email" defaultValue="hama@gmail.com" />,
    error: '사내 메일 주소(@actoz.com)를 입력해 주세요.',
  },
};

/** 선택 항목. */
export const Select: Story = {
  args: {
    label: '소속 팀',
    children: (
      <NativeSelect defaultValue="aha">
        <option value="aha">팀아하</option>
        <option value="platform">플랫폼팀</option>
        <option value="security">보안팀</option>
      </NativeSelect>
    ),
  },
};

/** 여러 줄 입력. */
export const Multiline: Story = {
  args: { label: '메모', description: '관리자만 볼 수 있어요.', children: <Textarea placeholder="변경 사유나 참고 사항" /> },
};

/** 라벨 오른쪽 보조 링크. 로그인 화면의 비밀번호 칸. */
export const WithLabelAction: Story = {
  args: {
    label: '비밀번호',
    required: true,
    labelAction: (
      <Button variant="link" size="sm">
        비밀번호 찾기
      </Button>
    ),
    children: <Input type="password" autoComplete="current-password" />,
  },
  parameters: { brand: 'iam' },
};
