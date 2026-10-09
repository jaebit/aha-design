import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { fn } from 'storybook/test';

import { AppShell } from '@/components/app-shell/app-shell';
import { AttachmentCard } from '@/components/attachment-card/attachment-card';
import { Button } from '@/components/button/button';
import { Card } from '@/components/card/card';
import { Chip } from '@/components/chip/chip';
import { ChoiceCardGroup } from '@/components/choice-card/choice-card';
import { Composer } from '@/components/composer/composer';
import { ConversationHeader } from '@/components/conversation-header/conversation-header';
import { Message, MessageContent } from '@/components/message/message';
import { PreviewCard } from '@/components/preview-card/preview-card';
import { RecipientInput } from '@/components/recipient-input/recipient-input';
import { ResultCard, ResultSection } from '@/components/result-card/result-card';
import { RiskItem } from '@/components/risk-item/risk-item';
import { HistoryItem, ServiceSidebar, SidebarSection } from '@/components/service-sidebar/service-sidebar';
import { Stepper } from '@/components/stepper/stepper';
import { Suggestions } from '@/components/suggestions/suggestions';

import { ahaRail } from './fixtures';
import { withLinkActions } from './link-actions';

interface TaskFrameProps {
  activeId: string;
  service: string;
  newLabel: string;
  history: { id: string; title: string; meta: string }[];
  title: string;
  steps: string[];
  current: number;
  composerPlaceholder: string;
  children: ReactNode;
}

/** 단계형 작업 대화의 공통 뼈대 (10–13쪽): 사이드바 + 머리말의 단계 표시 + 대화 + 하단 입력창. */
function TaskFrame({ activeId, service, newLabel, history, title, steps, current, composerPlaceholder, children }: TaskFrameProps) {
  return (
    <AppShell
      rail={ahaRail(activeId)}
      sidebar={
        <ServiceSidebar title={service} onCollapse={fn()} newAction={{ label: newLabel, onClick: fn() }}>
          <SidebarSection title="최근 기록">
            {history.map((item, index) => (
              <HistoryItem key={item.id} href={`#${item.id}`} title={item.title} meta={item.meta} metaPosition="bottom" active={index === 0} />
            ))}
          </SidebarSection>
        </ServiceSidebar>
      }
    >
      <ConversationHeader
        title={title}
        trailing={<Stepper steps={steps} current={current} />}
        onRename={fn()}
        onPinnedChange={fn()}
        onDelete={fn()}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-10">{children}</div>
      </div>
      <div className="mx-auto w-full max-w-3xl shrink-0 px-6 pb-6">
        <Composer variant="docked" placeholder={composerPlaceholder} onAttach={fn()} onSubmit={fn()} />
      </div>
    </AppShell>
  );
}

/** 회의록 생성 (11쪽): 녹음 첨부 → 음성 원문 미리보기 + 템플릿 선택 → 회의록 → 메일 발송. */
function MeetingMinutesPage() {
  const [template, setTemplate] = useState('기본 회의록');
  const [recipients, setRecipients] = useState(['이아하', '박팀장']);
  return (
    <TaskFrame
      activeId="meeting-minutes"
      service="회의록 생성"
      newLabel="새 회의록"
      history={[
        { id: 'm1', title: '[주간 회의] 회의록', meta: '지금 · 메일 발송 대기' },
        { id: 'm2', title: '9/21 회의 액션아이템 정리', meta: '어제 · 메일 발송 완료' },
        { id: 'm3', title: '주간 회의 회의록', meta: '10/01 · 회의록 생성 완료' },
      ]}
      title="[주간 회의] 회의록"
      steps={['음성 원문', '회의록', '메일 발송']}
      current={2}
      composerPlaceholder="수정할 내용을 입력하세요"
    >
      <Message from="user">
        <AttachmentCard kind="audio" name="새로운 녹음 192.m4a" meta="48MB · 32분" />
        <MessageContent>이 회의 녹음으로 회의록 만들어줘</MessageContent>
      </Message>

      <Message from="assistant" step="1/3 음성 원문">
        <MessageContent>
          <p>음성 원문을 만들었어요. 내용을 확인해 주세요.</p>
        </MessageContent>
        <PreviewCard
          title="음성 원문 미리보기"
          lines={['[화자 A] 지난주 베타 피드백부터 정리할게요.', '[화자 B] 가이드 챗 근거 표시가 좋다는 의견이 많았어요.']}
          moreLabel="원문 전체 보기"
          onMore={fn()}
        />
        <MessageContent>
          <p>어떤 템플릿으로 회의록을 만들까요?</p>
        </MessageContent>
        <div role="group" aria-label="회의록 템플릿" className="flex flex-wrap gap-2">
          {['기본 회의록', '주간 회의', '1:1 미팅'].map((item) => (
            <Chip key={item} selected={template === item} onClick={() => setTemplate(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </Message>

      <Message from="user">
        <MessageContent>{template}</MessageContent>
      </Message>

      <Message from="assistant" step="2/3 회의록">
        <MessageContent>
          <p>회의록을 만들었어요. 고칠 부분이 있으면 말씀해 주세요.</p>
        </MessageContent>
        <ResultCard
          title="주간 회의 회의록"
          meta="2026-10-08 · 김하마, 이아하, 박팀장"
          actions={
            <>
              <Button variant="secondary" size="sm">
                <Copy /> 복사
              </Button>
              <Button variant="secondary" size="sm">
                <Download /> 다운로드
              </Button>
              <Button variant="secondary" size="sm">
                <RotateCcw /> 다른 템플릿으로 다시 만들기
              </Button>
            </>
          }
        >
          <ResultSection title="논의 내용">
            <p>AHA 가이드 챗 베타 피드백과 회의록 메일 발송 일정을 논의했어요.</p>
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
        </ResultCard>
      </Message>

      <Message from="assistant" step="3/3 메일 발송">
        <MessageContent>
          <p>회의록을 메일로 보낼까요? 받는 사람을 확인해 주세요.</p>
        </MessageContent>
        <Card variant="emphasis" className="flex flex-col gap-4">
          <RecipientInput label="받는 사람" value={recipients} onValueChange={setRecipients} />
          <div className="flex gap-2">
            <Button disabled={recipients.length === 0}>메일 보내기</Button>
            <Button variant="secondary">나중에 보내기</Button>
          </div>
        </Card>
      </Message>
    </TaskFrame>
  );
}

/** 문서 검토 (13쪽): 문서 첨부 → 검토 기준 선택(카드 + 결과 언어 칩) → 검토 결과. */
function DocumentReviewPage() {
  const [criterion, setCriterion] = useState('contract-risk');
  const [language, setLanguage] = useState('한국어');
  return (
    <TaskFrame
      activeId="document-review"
      service="문서 검토"
      newLabel="새 검토"
      history={[
        { id: 'd1', title: '용역계약서 검토', meta: '지금' },
        { id: 'd2', title: '계약서 해지 조항 검토', meta: '어제' },
        { id: 'd3', title: '제안서 리스크 확인', meta: '09/30' },
      ]}
      title="용역계약서 검토"
      steps={['문서 읽기', '검토 결과']}
      current={2}
      composerPlaceholder="이어서 물어보세요"
    >
      <Message from="user">
        <AttachmentCard kind="document" name="용역계약서.pdf" meta="2.1MB · 18쪽" />
        <MessageContent>이 계약서 검토해줘</MessageContent>
      </Message>

      <Message from="assistant" step="1/2 문서 읽기">
        <MessageContent>
          <p>문서를 읽었어요. 18쪽 분량의 IT 용역계약서예요.</p>
          <p>어떤 기준으로 검토할까요?</p>
        </MessageContent>
        <ChoiceCardGroup
          label="검토 기준"
          value={criterion}
          onValueChange={setCriterion}
          options={[
            { value: 'summary', eyebrow: '일반 문서용', label: '핵심 내용 요약' },
            { value: 'contract-risk', eyebrow: '계약서용', label: '계약 리스크 검토' },
            { value: 'playbook', eyebrow: '법무팀', label: '용역계약 플레이북' },
          ]}
        />
        <div role="group" aria-label="결과 언어" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-body-sm text-muted-foreground">결과 언어</span>
          {['한국어', '中文', 'English'].map((item) => (
            <Chip key={item} selected={language === item} onClick={() => setLanguage(item)} className="h-8 px-3">
              {item}
            </Chip>
          ))}
        </div>
      </Message>

      <Message from="user">
        <MessageContent>계약 리스크 검토로 해줘. 해지 조항이랑 비용 부담 위주로 봐줘.</MessageContent>
      </Message>

      <Message from="assistant" step="2/2 검토 결과">
        <MessageContent>
          <p>해지 조항과 비용 부담을 중심으로 검토했어요.</p>
        </MessageContent>
        <ResultCard
          actions={
            <>
              <Button variant="secondary" size="sm">
                <Copy /> 복사
              </Button>
              <Button variant="secondary" size="sm">
                <Download /> Word로 다운로드
              </Button>
              <Button variant="secondary" size="sm">
                <RotateCcw /> 다른 기준으로 다시 검토
              </Button>
            </>
          }
        >
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
            <p>지체상금 비율이 사내 표준과 같은지 법무팀 확인이 필요해요.</p>
          </ResultSection>
        </ResultCard>
        <Suggestions items={['해지 조항 수정안 문구도 써줘', '놓친 리스크가 있는지 다시 봐줘']} onSelect={fn()} />
      </Message>
    </TaskFrame>
  );
}

const meta = {
  title: 'Templates/TaskConversation',
  parameters: { layout: 'fullscreen' },
  decorators: [withLinkActions()],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 회의록 생성 3단계 흐름 (10–11쪽). */
export const MeetingMinutes: Story = { render: () => <MeetingMinutesPage /> };

/** 문서 검토 2단계 흐름 (12–13쪽). */
export const DocumentReview: Story = { render: () => <DocumentReviewPage /> };
