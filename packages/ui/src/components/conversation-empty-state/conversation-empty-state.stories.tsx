import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Callout, Composer, Suggestions, TooltipTerm } from '@aha/ui';

import { ConversationEmptyState } from './conversation-empty-state';

const meta = {
  title: 'AI/ConversationEmptyState',
  component: ConversationEmptyState,
  tags: ['autodocs', 'kit:ai'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="flex min-h-[640px] py-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사내 가이드 챗 (3, 4쪽): 입력창 + 용어 툴팁이 있는 안내 문구 + 예시 질문. */
export const GuideChat: Story = {
  args: {
    title: '사내 가이드에서 찾아드려요',
    composer: (
      <Composer
        variant="hero"
        placeholder="사내 가이드에 대해 물어보세요"
        onAttach={fn()}
        onSubmit={fn()}
        helper={
          <>
            등록된{' '}
            <TooltipTerm term="사내 가이드">
              <strong>사규 · 매뉴얼 · FAQ</strong>처럼 회사에 등록된 문서예요. 답변은 이 문서 안에서만 찾고 근거를 함께
              보여드려요.
            </TooltipTerm>{' '}
            안에서만 답해요. 최종 확인은 담당 부서에 해 주세요.
          </>
        }
      />
    ),
    children: <Suggestions align="center" items={['연차 이월 규정', '법인카드 증빙 서류', '사무용품 신청 방법']} onSelect={fn()} />,
  },
};

/** 회의록 생성 (10쪽): 라벨 첨부 버튼 + 제약 정보 + 팁. */
export const MeetingMinutes: Story = {
  args: {
    title: '회의 녹음으로 회의록을 만들어 보세요',
    composer: (
      <Composer variant="hero" placeholder="녹음 파일을 첨부하세요" onAttach={fn()} attachLabel="녹음 파일 첨부" onSubmit={fn()} />
    ),
    constraints: ['mp3, wav, m4a, mp4, ogg, flac, webm', '최대 512MB · 3시간', '30분 녹음 기준 원문 약 1분'],
    children: (
      <Callout title="더 좋은 회의록을 위한 팁">
        회의 시작할 때 회의 일시, 참석자 이름과 역할, 회의 목적을 먼저 말해 주세요.
      </Callout>
    ),
  },
};
