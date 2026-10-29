import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge, Card, FormField, Input } from '@actoz/ui';
import { Amount, SourcedValue, Timeline, UnknownValue } from '@actoz/kit-settlement';

import { CaseHeader, Section, SettlementShell, SplitLayout } from './fixtures';
import { withLinkActions } from './link-actions';

const lockedLabel = (name: string) => (
  <>
    {name}
    <Badge variant="soft">잠김</Badge>
  </>
);

/** 발행·수금 · 송부: 진행 기록(Timeline)과 발급 내역(왼쪽), 정산 건 자료와 청구(오른쪽). 입금은 재무팀만 입력하므로 담당자 화면에서는 잠긴다. */
function IssueCollectionPage() {
  return (
    <SettlementShell activeId="home">
      <CaseHeader title="라테일플러스 한국 · 2026.08 · 발행·수금" status="송부" stage={2} />
      <SplitLayout>
        <div className="flex flex-col gap-6">
          <Section title="진행 기록">
            <Card padding="lg">
              <Timeline
                steps={[
                  { name: '초안 생성', meta: '2026.09.20 · 시스템 · 문서 생성은 발행이 아닙니다', status: 'done' },
                  { name: '결재 종결', meta: '2026.09.24 · 담당자', status: 'done' },
                  { name: '발급', meta: '2026.09.26 · 재무팀', status: 'done' },
                  { name: '송부', meta: '2026.09.30 · 담당자', status: 'done' },
                  { name: '입금', meta: '미입금 23일 (송부 후 경과)', status: 'current' },
                ]}
              />
            </Card>
          </Section>

          <Section title="발급 내역">
            <Card padding="lg" className="flex flex-col gap-3">
              <dl className="grid grid-cols-[9rem_minmax(0,1fr)] gap-x-4 gap-y-2 text-body">
                <dt className="text-muted-foreground">발행일</dt>
                <dd className="tabular-nums">2026.09.26</dd>
                <dt className="text-muted-foreground">증빙 번호</dt>
                <dd className="tabular-nums">20260926-41000012</dd>
                <dt className="text-muted-foreground">증빙 유형</dt>
                <dd>전자세금계산서 (원화 발행)</dd>
                <dt className="text-muted-foreground">원화 공급가액</dt>
                <dd><Amount currency="KRW" value="40,481,560" /></dd>
                <dt className="text-muted-foreground">세액</dt>
                <dd><Amount currency="KRW" value="4,048,156" /></dd>
                <dt className="text-muted-foreground">원화 환산 기준</dt>
                <dd><UnknownValue kind="undecided" reference="Q-12" /></dd>
              </dl>
              <p className="text-caption text-muted-foreground">
                출처: 재무팀 기록 (발급된 세금계산서). 청구액은 USD, 세금계산서는 원화로 발행합니다.
              </p>
            </Card>
          </Section>

          <Section title="입금">
            <Card padding="lg" className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label={lockedLabel('입금일')}>
                  <Input disabled placeholder="YYYY.MM.DD" aria-describedby="lock-note" />
                </FormField>
                <FormField label={lockedLabel('입금액')}>
                  <Input disabled placeholder="입금 통화 미정 · Q-12" aria-describedby="lock-note" />
                </FormField>
              </div>
              <p id="lock-note" className="text-body-sm text-muted-foreground">
                재무팀만 입력합니다
              </p>
            </Card>
          </Section>
        </div>

        <div className="flex flex-col gap-6">
          <Section title="정산 건 자료">
            <Card padding="lg">
              <ul className="flex flex-col gap-2 text-body">
                {['정산서 원본', '스토어 원본 5종', '검산 결과', '환율 근거', '품의서', '세금계산서용 자료'].map((name) => (
                  <li key={name}>
                    <a href="#docs" className="underline underline-offset-4">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </Section>

          <Section title="청구">
            <Card padding="lg" className="flex flex-col gap-4">
              <SourcedValue label="청구 통화" value="USD" />
              <SourcedValue label="청구액" source="정산서 C12">
                <Amount currency="USD" value="28,915.40" />
              </SourcedValue>
            </Card>
          </Section>
        </div>
      </SplitLayout>
    </SettlementShell>
  );
}

const meta = {
  title: 'Templates/IssueCollection',
  tags: ['kit:settlement'],
  component: IssueCollectionPage,
  parameters: { layout: 'fullscreen', density: 'compact' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof IssueCollectionPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 송부까지 끝나고 입금을 기다리는 건. 초안 생성은 발행이 아니라는 안내와 미확정 값(원화 환산 기준)을 함께 보인다. */
export const Default: Story = {};
