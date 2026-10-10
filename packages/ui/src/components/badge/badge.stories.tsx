import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: '사내 가이드 챗' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 서비스 태그 (1, 2쪽). 기록 목록에서 어느 서비스의 기록인지 표시한다. */
export const ServiceTag: Story = { args: { variant: 'outline' } };

/** AI 응답의 진행 단계 (11, 13쪽). */
export const Step: Story = { args: { variant: 'outline', children: '1/3 음성 원문' } };

/** 개수 강조 (20쪽 관리자 메뉴). */
export const Count: Story = { args: { variant: 'solid', children: '3' } };

/** 키워드·제약 정보 (10, 14쪽). */
export const Soft: Story = { args: { variant: 'soft', size: 'md', children: '최대 512MB · 3시간' } };

/** 와이어프레임에 나오는 배지 모음. */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>ITH</Badge>
      <Badge>회의록 생성</Badge>
      <Badge>일부 품질 저하</Badge>
      <Badge>높음</Badge>
      <Badge>2/2 검토 결과</Badge>
      <Badge variant="solid">0</Badge>
      <Badge variant="soft" size="md">
        PDF, Word, PowerPoint
      </Badge>
      <Badge variant="soft" size="md">
        모델 업데이트
      </Badge>
    </div>
  ),
};

/** 상태 배지: 라벨 앞에 상태색 아이콘. 글자는 기본색 그대로 두고, 라벨이 상태를 말한다. */
export const StatusTones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="good">완료</Badge>
      <Badge tone="warning">일부 품질 저하</Badge>
      <Badge tone="serious">보통</Badge>
      <Badge tone="critical">높음</Badge>
    </div>
  ),
};
