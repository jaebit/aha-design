import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartColumn, FileSearch, History, Mail, MessageSquareText, Mic, ReceiptText, Wallet } from 'lucide-react';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

import { withLinkActions } from '../link-actions';
import { GuideChatScreen, type GuideAnswer, type GuideConversation, type GuideTurn } from './guide-chat-screen';

const answers: Record<string, GuideAnswer> = {
  '연차 이월 규정': {
    summary: '올해 못 쓴 연차는 최대 5일까지 내년으로 이월할 수 있어요.',
    points: [
      '이월하려면 12월 15일까지 인사 시스템에서 신청해야 해요.',
      '이월한 연차는 내년 6월 30일까지 써야 해요.',
      '이월하지 않은 연차는 연차 수당으로 정산돼요.',
    ],
    source: { name: '인사 규정 · 연차휴가 조항', href: '#guide' },
    followUps: ['연차 수당은 언제 지급돼?', '반차도 이월할 수 있어?'],
  },
  '법인카드 증빙 서류': {
    summary: '법인카드로 팀 회식비를 결제했다면 아래 증빙이 필요해요.',
    points: ['카드 매출전표와 참석자 명단', '결제일로부터 7일 안에 경비 시스템에 제출', '1인당 한도를 넘으면 사전 승인 필요'],
    source: { name: '경비 처리 지침', href: '#guide' },
    handoff: true,
    followUps: ['회식비 1인당 한도는 얼마야?', '영수증을 잃어버리면 어떻게 해?'],
  },
};

/** 데모용 답변. 실제 앱에서는 가이드 챗 API를 부른다. */
const demoAnswer = (delay = 600) =>
  fn(async (question: string): Promise<GuideAnswer> => {
    await new Promise((r) => setTimeout(r, delay));
    return (
      answers[question] ?? {
        summary: `"${question}"에 대한 내용을 사내 가이드에서 찾지 못했어요.`,
        handoff: true,
      }
    );
  });

const leaveTurn: GuideTurn = {
  id: 't1',
  question: '올해 못 쓴 연차, 내년으로 이월할 수 있어?',
  answer: answers['연차 이월 규정'],
  feedback: null,
};

const leaveConversation: GuideConversation = {
  id: 'c1',
  title: '연차 이월 · 회식비 증빙 문의',
  meta: '오늘 09:40',
  turns: [
    leaveTurn,
    { id: 't2', question: '법인카드로 회식비 냈는데 증빙은 뭐가 필요해?', answer: answers['법인카드 증빙 서류'], feedback: null },
  ],
};

const suppliesConversation: GuideConversation = {
  id: 'c2',
  title: '사무용품 신청 방법',
  meta: '10/02',
  turns: [
    {
      id: 't3',
      question: '사무용품 신청은 어디서 해?',
      answer: {
        summary: '사무용품은 그룹웨어 > 총무 > 비품 신청에서 신청해요.',
        source: { name: '총무 매뉴얼 · 비품 관리', href: '#guide' },
      },
    },
  ],
};

const history = [leaveConversation, suppliesConversation];

const meta = {
  title: 'Templates/GuideChat',
  component: GuideChatScreen,
  parameters: { layout: 'fullscreen' },
  decorators: [withLinkActions(['#guide-chat/'])],
  args: {
    // 예시 데이터는 MCP 예제 코드에 그대로 보이도록 직접 적는다 (fixtures를 import하지 않는다).
    user: { name: '김하마', team: '팀아하', email: 'hama@actoz.com', initials: '하마' },
    navItems: [
      { id: 'guide-chat', label: '사내 가이드 챗', icon: <MessageSquareText />, href: '#guide-chat' },
      { id: 'meeting-minutes', label: '회의록 생성', icon: <Mic />, href: '#meeting-minutes' },
      { id: 'document-review', label: '문서 검토', icon: <FileSearch />, href: '#document-review' },
      { id: 'newsletter', label: '뉴스레터 구독', icon: <Mail />, href: '#newsletter' },
      { id: 'ith', label: 'ITH', icon: <ChartColumn />, href: '#ith' },
      { id: 'ip-royalty', label: 'IP 로열티 정산', icon: <ReceiptText />, href: '#ip-royalty' },
      { id: 'daily-cash', label: '자금 일보', icon: <Wallet />, href: '#daily-cash' },
    ],
    navBottomItems: [{ id: 'history', label: '전체 기록', icon: <History />, href: '#history' }],
    answer: demoAnswer(),
    historyHref: '#history',
    onAttach: fn(),
    confirmDelete: fn(() => true),
    onNavigate: fn(),
    onContactDepartment: fn(),
    onAdminSettings: fn(),
    onLogout: fn(),
  },
} satisfies Meta<typeof GuideChatScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 첫 진입 빈 상태 (3쪽): 가운데 큰 입력창과 예시 질문. */
export const Empty: Story = {
  args: { initialConversations: history },
};

/** 기록이 하나도 없는 첫 사용자. 사이드바에 기록 섹션이 없다. */
export const FirstVisit: Story = {};

/** 대화 화면 (5쪽): 근거, 담당 부서 연결, 액션 바, 후속 질문. */
export const Conversation: Story = {
  args: { initialConversations: history, initialActiveId: 'c1' },
};

/** 고정된 대화가 있을 때 (8쪽): 사이드바 위에 "고정됨" 섹션. */
export const WithPinned: Story = {
  args: {
    initialConversations: history.map((c) => (c.id === 'c1' ? { ...c, pinned: true } : c)),
    initialActiveId: 'c1',
  },
};

/** 사이드바를 접었을 때 (6쪽): 머리말에 펼치기 · 새 대화 버튼과 브레드크럼. */
export const SidebarCollapsed: Story = {
  args: { initialConversations: history, initialActiveId: 'c1', initialSidebarOpen: false },
};

/** 응답을 만드는 중: 생각 중 표시가 보이고 입력창 전송이 막힌다. */
export const Thinking: Story = {
  args: {
    initialConversations: [
      { ...leaveConversation, turns: [leaveTurn, { id: 't-pending', question: '영수증을 잃어버리면 어떻게 해?' }] },
      suppliesConversation,
    ],
    initialActiveId: 'c1',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('사내 가이드에서 찾고 있어요')).toBeInTheDocument();
  },
};

/** 빈 상태에서 질문을 보내면 새 대화가 생기고 답변이 이어진다 (3 → 5쪽). */
export const AskQuestion: Story = {
  args: { answer: demoAnswer(50) },
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByRole('textbox'), '연차 이월 규정{enter}');
    await expect(args.answer).toHaveBeenCalledWith('연차 이월 규정');
    await expect(await canvas.findByText(/최대 5일까지/)).toBeInTheDocument();
    await expect(canvas.getAllByText('연차 이월 규정').length).toBeGreaterThan(0);
  },
};

/** 예시 질문과 후속 질문 칩을 누르면 그 문장을 그대로 보낸다. */
export const SelectSuggestion: Story = {
  args: { answer: demoAnswer(50) },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: '법인카드 증빙 서류' }));
    await canvas.findByText(/아래 증빙이 필요해요/);
    await userEvent.click(await canvas.findByRole('button', { name: '회식비 1인당 한도는 얼마야?' }));
    await waitFor(() => expect(args.answer).toHaveBeenLastCalledWith('회식비 1인당 한도는 얼마야?'));
  },
};

/** 답하기 어려운 질문에서 "담당 부서에 문의"로 사람에게 넘긴다 (5쪽). */
export const Handoff: Story = {
  args: { initialConversations: history, initialActiveId: 'c1' },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: '담당 부서에 문의' }));
    await expect(args.onContactDepartment).toHaveBeenCalledWith('법인카드로 회식비 냈는데 증빙은 뭐가 필요해?');
  },
};
