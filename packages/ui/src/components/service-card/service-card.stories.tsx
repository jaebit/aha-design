import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileSearch, MessageSquareText, Mic } from 'lucide-react';

import { ServiceCard } from './service-card';

const meta = {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  tags: ['autodocs'],
  args: {
    icon: <MessageSquareText />,
    title: '사내 가이드 챗',
    description: '등록된 사내 가이드에서 답을 찾아드려요.',
    tag: '질문 입력',
    href: '#guide-chat',
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ServiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 홈 서비스 카드 (1쪽). */
export const Default: Story = {};

/** 홈 화면의 카드 3개 배치. */
export const HomeGrid: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="grid grid-cols-3 gap-4">
      <ServiceCard {...args} />
      <ServiceCard
        icon={<Mic />}
        title="회의록 생성"
        description="회의 녹음으로 회의록을 만들고 메일로 보내요."
        tag="녹음 파일"
        href="#meeting-minutes"
      />
      <ServiceCard
        icon={<FileSearch />}
        title="문서 검토"
        description="계약서와 문서의 조항, 리스크를 검토해요."
        tag="문서 파일"
        href="#document-review"
      />
    </div>
  ),
};
