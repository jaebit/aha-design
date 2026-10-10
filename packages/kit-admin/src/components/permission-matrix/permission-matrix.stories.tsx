import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { PermissionMatrix } from './permission-matrix';

const meta = {
  title: 'Admin/PermissionMatrix',
  component: PermissionMatrix,
  tags: ['autodocs', 'kit:admin'],
  args: {
    caption: '운영자 역할의 권한',
    actions: [
      { key: 'read', label: '조회' },
      { key: 'write', label: '편집' },
      { key: 'delete', label: '삭제' },
    ],
    resources: [
      { key: 'users', label: '사용자', description: '사용자 목록, 역할 변경' },
      { key: 'content', label: '공지와 문서', description: '공지 게시, 규정 문서 등록' },
      { key: 'stats', label: '통계', description: '사용 현황, 다운로드', unavailable: ['write', 'delete'] },
      { key: 'settings', label: '시스템 설정' },
    ],
    value: { users: ['read', 'write'], content: ['read', 'write', 'delete'], stats: ['read'], settings: [] },
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PermissionMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 역할 편집: 체크박스로 권한을 준다. */
export const Editable: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <PermissionMatrix
        {...args}
        value={value}
        onValueChange={(next) => {
          args.onValueChange?.(next);
          setValue(next);
        }}
      />
    );
  },
};

/** 읽기 전용: 권한을 바꿀 수 없는 사용자에게 ✓ / – 로 보여준다. */
export const ReadOnly: Story = { args: { readOnly: true } };
