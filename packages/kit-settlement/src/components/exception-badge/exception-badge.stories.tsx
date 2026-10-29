import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExceptionBadge } from './exception-badge';

const meta = {
  title: 'Settlement/ExceptionBadge',
  component: ExceptionBadge,
  tags: ['autodocs', 'kit:settlement'],
  args: { code: 'E01', children: '보고 기간이 계약 기간과 일부 겹칩니다' },
} satisfies Meta<typeof ExceptionBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 확인 후 진행. 사람이 확인하면 계속할 수 있다. */
export const Attend: Story = {};

/** 진행 불가. 원인이 풀리기 전에는 넘어갈 수 없다. */
export const Block: Story = { args: { code: 'E06', children: '계약서 원본이 없습니다' } };

/** 보완 입력. 빠진 값을 채워야 한다. */
export const Supply: Story = { args: { code: 'E07', children: '환율 기준일이 비어 있습니다' } };

/** 정책 미정. 점선으로 표시한다. */
export const Policy: Story = { args: { code: 'E03', children: '최소 보증금 차감 기준이 정해지지 않았습니다' } };

/** 대기. 다른 쪽 응답을 기다린다. 점선으로 표시한다. */
export const Wait: Story = { args: { code: 'E13', children: '라이선서 회신을 기다립니다' } };

/** 상황 문장 없이 코드와 종류만 보인다. */
export const CodeOnly: Story = { args: { code: 'E08', children: undefined } };
