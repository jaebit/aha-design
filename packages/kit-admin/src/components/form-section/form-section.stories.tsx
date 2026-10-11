import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormField, Input, NativeSelect } from '@aha/ui';

import { FormSection } from './form-section';

const meta = {
  title: 'Admin/FormSection',
  component: FormSection,
  tags: ['autodocs', 'kit:admin'],
  args: {
    title: '기본 정보',
    description: '이름과 소속은 사내 인사 정보와 같게 적어요.',
    children: (
      <>
        <FormField label="이름" required>
          <Input defaultValue="김하마" />
        </FormField>
        <FormField label="소속 팀">
          <NativeSelect defaultValue="aha">
            <option value="aha">팀아하</option>
            <option value="platform">플랫폼팀</option>
          </NativeSelect>
        </FormField>
      </>
    ),
  },
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 제목·설명 + 항목. 넓은 화면에서 좌우로 나뉜다. */
export const Default: Story = {};

/** 여러 묶음을 이어 두면 사이에 구분선이 생긴다. */
export const Stacked: Story = {
  render: (args) => (
    <div>
      <FormSection {...args} />
      <FormSection title="알림" description="중요한 변경이 있을 때 받는 알림이에요.">
        <FormField label="알림 메일">
          <Input type="email" defaultValue="hama@actoz.com" />
        </FormField>
      </FormSection>
    </div>
  ),
};
