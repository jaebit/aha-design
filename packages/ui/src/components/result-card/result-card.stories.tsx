import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button, ResultSection, RiskItem } from '@aha/ui';

import { ResultCard } from './result-card';

const meta = {
  title: 'AI/ResultCard',
  component: ResultCard,
  tags: ['autodocs', 'kit:ai'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 회의록 (11쪽): 제목 · 메타 · 섹션 · 하단 액션. */
export const MeetingMinutes: Story = {
  args: {
    title: '주간 회의 회의록',
    meta: '2026-10-08 · 김하마, 이아하, 박팀장',
    actions: (
      <>
        <Button variant="secondary" size="sm" onClick={fn()}>
          <Copy /> 복사
        </Button>
        <Button variant="secondary" size="sm" onClick={fn()}>
          <Download /> 다운로드
        </Button>
        <Button variant="secondary" size="sm" onClick={fn()}>
          <RotateCcw /> 다른 템플릿으로 다시 만들기
        </Button>
      </>
    ),
    children: (
      <>
        <ResultSection title="논의 내용">
          <ul>
            <li>AHA 가이드 챗 베타 피드백 정리</li>
            <li>회의록 생성 메일 발송 기능 일정</li>
          </ul>
        </ResultSection>
        <ResultSection title="결정 사항">
          <p>회의록 메일 발송은 10월 셋째 주에 배포한다.</p>
        </ResultSection>
        <ResultSection title="액션 아이템">
          <ul>
            <li>이아하 · 발송 템플릿 정리 · 10/15</li>
            <li>박팀장 · 보안 검토 요청 · 10/13</li>
          </ul>
        </ResultSection>
      </>
    ),
  },
};

/** 문서 검토 결과 (13쪽): 요약 · 리스크 항목 · 확인할 점. */
export const DocumentReview: Story = {
  args: {
    actions: (
      <>
        <Button variant="secondary" size="sm" onClick={fn()}>
          <Copy /> 복사
        </Button>
        <Button variant="secondary" size="sm" onClick={fn()}>
          <Download /> Word로 다운로드
        </Button>
        <Button variant="secondary" size="sm" onClick={fn()}>
          <RotateCcw /> 다른 기준으로 다시 검토
        </Button>
      </>
    ),
    children: (
      <>
        <ResultSection title="요약">
          <p>해지 조항과 비용 부담에서 발주사에 불리한 조건이 2건 있어요.</p>
        </ResultSection>
        <ResultSection title="리스크 항목">
          <RiskItem severity="높음" tone="critical" title="일방적 해지 시 위약금 없음" source={{ name: '제12조 (해지)', href: '#clause-12' }}>
            수급사가 30일 전 통보만으로 해지할 수 있어요. 상호 해지 조건과 위약금 조항 추가를 제안해요.
          </RiskItem>
          <RiskItem severity="보통" tone="serious" title="추가 비용 부담 주체 불명확" source={{ name: '제8조 (비용)', href: '#clause-8' }}>
            범위 변경 시 비용 부담 주체가 없어요. 사전 서면 합의 조건을 넣는 것을 제안해요.
          </RiskItem>
        </ResultSection>
        <ResultSection title="확인할 점">
          <p>지체상금 비율이 사내 표준(0.1%)과 같은지 법무팀 확인이 필요해요.</p>
        </ResultSection>
      </>
    ),
  },
};
