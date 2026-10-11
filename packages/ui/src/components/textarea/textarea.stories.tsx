import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from './textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { 'aria-label': '변경 사유', placeholder: '변경 사유를 적어 주세요' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 빈 입력. */
export const Default: Story = {};

/** 내용이 있는 입력. */
export const Filled: Story = { args: { defaultValue: '조직 개편으로 소속 팀이 바뀌어 권한을 다시 지정합니다.' } };

/** 값이 잘못된 상태. 오류 문구는 폼 항목(FormField)이 보여준다. */
export const Invalid: Story = { args: { 'aria-invalid': true } };

/** 수정할 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true, defaultValue: '수정할 수 없는 메모' } };
