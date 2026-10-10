import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AttachmentCard } from './attachment-card';

const meta = {
  title: 'AI/AttachmentCard',
  component: AttachmentCard,
  tags: ['autodocs', 'kit:ai'],
} satisfies Meta<typeof AttachmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 회의 녹음 (11쪽). */
export const Audio: Story = { args: { kind: 'audio', name: '새로운 녹음 192.m4a', meta: '48MB · 32분' } };

/** 검토할 문서 (13쪽). */
export const Document: Story = { args: { kind: 'document', name: '용역계약서.pdf', meta: '2.1MB · 18쪽' } };

/** 보내기 전, 입력창 위에서 첨부를 지울 수 있는 상태. */
export const Removable: Story = { args: { name: '용역계약서.pdf', meta: '2.1MB · 18쪽', onRemove: fn() } };
