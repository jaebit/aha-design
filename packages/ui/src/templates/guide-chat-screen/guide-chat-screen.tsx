import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { PanelLeftOpen, SquarePen } from 'lucide-react';
import {
  AccountMenu,
  AppShell,
  Button,
  Callout,
  Citation,
  Composer,
  ConversationEmptyState,
  ConversationHeader,
  HistoryItem,
  Message,
  MessageActions,
  MessageContent,
  NavRail,
  ServiceSidebar,
  SidebarSection,
  Suggestions,
  ThinkingIndicator,
  TooltipTerm,
} from '../../index';

type NavItems = ComponentProps<typeof NavRail>['items'];
type Feedback = ComponentProps<typeof MessageActions>['feedback'];

/** AI 답변 한 개. 본문 → 근거 → 담당 부서 연결 → 후속 질문 순서로 그린다 (5쪽). */
export interface GuideAnswer {
  /** 첫 문단 요약. */
  summary: string;
  /** 요약 아래 목록. */
  points?: string[];
  /** 근거 문서. 등록된 문서 안에서 찾은 답이면 반드시 넣는다. */
  source?: { name: string; href?: string };
  /** 사내 가이드만으로 판단이 어려우면 true. 담당 부서 연결을 붙인다. */
  handoff?: boolean;
  /** 후속 질문 2~3개. */
  followUps?: string[];
}

/** 질문 하나와 그 답변. `answer`가 없으면 응답을 만드는 중이다. */
export interface GuideTurn {
  id: string;
  question: string;
  answer?: GuideAnswer;
  feedback?: Feedback;
}

/** 사이드바의 대화 기록 한 개. */
export interface GuideConversation {
  id: string;
  title: string;
  /** 기록 위의 날짜. 예: "오늘 09:40", "10/02". */
  meta: string;
  pinned?: boolean;
  turns: GuideTurn[];
}

export interface GuideChatScreenProps {
  /** 로그인한 사용자. 내비 레일 맨 아래 계정 메뉴에 보인다 (19쪽). */
  user: { name: string; team: string; email: string; initials: string };
  /** 내비 레일 서비스 목록. */
  navItems: NavItems;
  /** 내비 레일 아래쪽 항목 ("전체 기록"). */
  navBottomItems?: NavItems;
  /** 질문을 받아 답변을 돌려준다. 실제 앱에서는 가이드 챗 API를 부른다. */
  answer: (question: string) => Promise<GuideAnswer>;
  /** 처음 보여줄 대화 기록. */
  initialConversations?: GuideConversation[];
  /** 처음 열어 둘 대화 id. 생략하면 빈 상태(3쪽)로 시작한다. */
  initialActiveId?: string;
  /** false면 사이드바를 접은 상태로 시작한다 (6쪽). */
  initialSidebarOpen?: boolean;
  /** 빈 상태의 예시 질문 (3쪽). */
  exampleQuestions?: string[];
  /** 첨부 버튼 클릭. 생략하면 입력창에 첨부 버튼을 표시하지 않는다. */
  onAttach?: () => void;
  /** 전체 기록 화면(2쪽) 주소. 지정하면 "최근 기록" 옆에 "전체 기록" 링크를 둔다. */
  historyHref?: string;
  /** 대화 삭제 확인. 기본은 브라우저 확인 창. */
  confirmDelete?: (title: string) => boolean | Promise<boolean>;
  /** 내비 레일 항목을 눌렀을 때. */
  onNavigate?: (id: string) => void;
  /** "담당 부서에 문의"를 눌렀을 때 (5쪽). */
  onContactDepartment?: (question: string) => void;
  /** 생략하면 계정 메뉴에서 "관리자 설정"을 숨긴다. */
  onAdminSettings?: () => void;
  onLogout: () => void;
}

const HASH_PREFIX = '#guide-chat/';

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const todayMeta = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `오늘 ${hh}:${mm}`;
};

const answerText = (a: GuideAnswer) =>
  [a.summary, ...(a.points ?? []).map((p) => `- ${p}`), a.source ? `근거: ${a.source.name}` : '']
    .filter(Boolean)
    .join('\n');

const composerHelper = (
  <>
    등록된{' '}
    <TooltipTerm term="사내 가이드">
      <strong>사규 · 매뉴얼 · FAQ</strong>처럼 회사에 등록된 문서예요. 답변은 이 문서 안에서만 찾고 근거를 함께
      보여드려요.
    </TooltipTerm>{' '}
    안에서만 답해요. 최종 확인은 담당 부서에 해 주세요.
  </>
);

/**
 * 사내 가이드 챗 화면 (3–8쪽).
 * 내비 레일 · 서비스 사이드바 · 대화 영역으로 이루어진다.
 * 대화가 없으면 빈 상태(3쪽), 있으면 머리말 + 메시지 목록 + 하단 입력창(5쪽)을 보여준다.
 */
export function GuideChatScreen({
  user,
  navItems,
  navBottomItems,
  answer,
  initialConversations = [],
  initialActiveId,
  initialSidebarOpen = true,
  exampleQuestions = ['연차 이월 규정', '법인카드 증빙 서류', '사무용품 신청 방법'],
  onAttach,
  historyHref,
  confirmDelete = (title) => window.confirm(`"${title}" 대화를 삭제할까요?`),
  onNavigate,
  onContactDepartment,
  onAdminSettings,
  onLogout,
}: GuideChatScreenProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | undefined>(initialActiveId);
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId);
  const busy = active?.turns.some((t) => !t.answer) ?? false;
  const pinned = useMemo(() => conversations.filter((c) => c.pinned), [conversations]);
  const recent = useMemo(() => conversations.filter((c) => !c.pinned), [conversations]);

  // 사이드바 기록은 href 해시로 대화를 바꾼다.
  useEffect(() => {
    const sync = () => {
      if (window.location.hash.startsWith(HASH_PREFIX)) {
        setActiveId(window.location.hash.slice(HASH_PREFIX.length));
      }
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo?.({ top: scrollRef.current.scrollHeight });
  }, [active?.turns]);

  const updateConversation = useCallback((id: string, patch: (c: GuideConversation) => GuideConversation) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? patch(c) : c)));
  }, []);

  const updateTurn = useCallback(
    (conversationId: string, turnId: string, patch: Partial<GuideTurn>) => {
      updateConversation(conversationId, (c) => ({
        ...c,
        turns: c.turns.map((t) => (t.id === turnId ? { ...t, ...patch } : t)),
      }));
    },
    [updateConversation],
  );

  const ask = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || busy) return;

      const turn: GuideTurn = { id: newId(), question: text };
      let conversationId = activeId;
      if (active) {
        updateConversation(active.id, (c) => ({ ...c, turns: [...c.turns, turn] }));
      } else {
        conversationId = newId();
        const created: GuideConversation = { id: conversationId, title: text, meta: todayMeta(), turns: [turn] };
        setConversations((prev) => [created, ...prev]);
        setActiveId(conversationId);
      }

      let result: GuideAnswer;
      try {
        result = await answer(text);
      } catch {
        result = {
          summary: '답변을 가져오지 못했어요. 잠시 후 다시 물어봐 주세요.',
          handoff: true,
        };
      }
      updateTurn(conversationId!, turn.id, { answer: result, feedback: null });
    },
    [active, activeId, answer, busy, updateConversation, updateTurn],
  );

  const startNew = () => {
    setActiveId(undefined);
    if (window.location.hash.startsWith(HASH_PREFIX)) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const remove = async (c: GuideConversation) => {
    if (!(await confirmDelete(c.title))) return;
    setConversations((prev) => prev.filter((x) => x.id !== c.id));
    startNew();
  };

  const historyItem = (c: GuideConversation) => (
    <HistoryItem
      key={c.id}
      href={`${HASH_PREFIX}${c.id}`}
      meta={c.meta}
      title={c.title}
      pinned={c.pinned}
      active={c.id === activeId}
    />
  );

  const expandButtons = sidebarOpen ? undefined : (
    <>
      <Button variant="ghost" size="icon" aria-label="사이드바 펼치기" onClick={() => setSidebarOpen(true)}>
        <PanelLeftOpen />
      </Button>
      <Button variant="ghost" size="icon" aria-label="새 대화" onClick={startNew}>
        <SquarePen />
      </Button>
    </>
  );

  const historyLink = historyHref ? (
    <Button variant="link" size="sm" asChild className="text-caption text-muted-foreground">
      <a href={historyHref}>전체 기록</a>
    </Button>
  ) : undefined;

  return (
    <AppShell
      rail={
        <NavRail
          items={navItems}
          bottomItems={navBottomItems}
          activeId="guide-chat"
          onNavigate={onNavigate}
          account={<AccountMenu {...user} onAdminSettings={onAdminSettings} onLogout={onLogout} />}
        />
      }
      sidebar={
        sidebarOpen ? (
          <ServiceSidebar
            title="사내 가이드 챗"
            onCollapse={() => setSidebarOpen(false)}
            newAction={{ label: '새 대화', onClick: startNew }}
          >
            {pinned.length > 0 && <SidebarSection title="고정됨">{pinned.map(historyItem)}</SidebarSection>}
            {(recent.length > 0 || historyLink) && (
              <SidebarSection title="최근 기록" action={historyLink}>
                {recent.map(historyItem)}
              </SidebarSection>
            )}
          </ServiceSidebar>
        ) : undefined
      }
    >
      {active ? (
        <>
          <ConversationHeader
            title={active.title}
            serviceName={sidebarOpen ? undefined : '사내 가이드 챗'}
            leading={expandButtons}
            pinned={active.pinned}
            onRename={(title) => updateConversation(active.id, (c) => ({ ...c, title }))}
            onPinnedChange={(next) => updateConversation(active.id, (c) => ({ ...c, pinned: next }))}
            onDelete={() => remove(active)}
          />

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div role="log" aria-label="대화 내용" className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-10">
              {active.turns.map((turn, i) => {
                const isLast = i === active.turns.length - 1;
                return (
                  <div key={turn.id} className="flex flex-col gap-10">
                    <Message from="user">
                      <MessageContent>{turn.question}</MessageContent>
                    </Message>
                    <Message from="assistant">
                      {turn.answer ? (
                        <>
                          <MessageContent>
                            <p>{turn.answer.summary}</p>
                            {turn.answer.points && turn.answer.points.length > 0 && (
                              <ul>
                                {turn.answer.points.map((p) => (
                                  <li key={p}>{p}</li>
                                ))}
                              </ul>
                            )}
                          </MessageContent>
                          {turn.answer.source && (
                            <Citation source={turn.answer.source.name} href={turn.answer.source.href} />
                          )}
                          {turn.answer.handoff && (
                            <Callout
                              action={
                                <Button variant="secondary" onClick={() => onContactDepartment?.(turn.question)}>
                                  담당 부서에 문의
                                </Button>
                              }
                            >
                              사내 가이드만으로 판단이 어려우면 담당 부서에 바로 문의할 수 있어요.
                            </Callout>
                          )}
                          <MessageActions
                            onCopy={() => navigator.clipboard?.writeText(answerText(turn.answer!))}
                            feedback={turn.feedback ?? null}
                            onFeedbackChange={(feedback) => updateTurn(active.id, turn.id, { feedback })}
                          />
                          {isLast && !busy && turn.answer.followUps && turn.answer.followUps.length > 0 && (
                            <Suggestions items={turn.answer.followUps} onSelect={ask} />
                          )}
                        </>
                      ) : (
                        <ThinkingIndicator label="사내 가이드에서 찾고 있어요" />
                      )}
                    </Message>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto w-full max-w-3xl shrink-0 px-6 pb-6">
            <Composer
              variant="docked"
              placeholder="사내 가이드에 대해 물어보세요"
              busy={busy}
              onAttach={onAttach}
              onSubmit={ask}
              helper={composerHelper}
            />
          </div>
        </>
      ) : (
        <>
          {expandButtons && <div className="flex items-center gap-1 px-4 py-3">{expandButtons}</div>}
          <div className="flex flex-1 items-center justify-center overflow-y-auto px-6">
            <ConversationEmptyState
              title="사내 가이드에서 찾아드려요"
              composer={
                <Composer
                  variant="hero"
                  placeholder="사내 가이드에 대해 물어보세요"
                  onAttach={onAttach}
                  onSubmit={ask}
                  helper={composerHelper}
                />
              }
            >
              <Suggestions align="center" items={exampleQuestions} onSelect={ask} />
            </ConversationEmptyState>
          </div>
        </>
      )}
    </AppShell>
  );
}
