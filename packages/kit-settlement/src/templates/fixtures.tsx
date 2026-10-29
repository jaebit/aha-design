// 스토리 전용 예시 데이터와 공통 화면 틀. 정산 화면 템플릿이 함께 쓰는 내비게이션, 정산 건 머리, 정산 검토 화면, 예시 정산 건 목록.
import { ChevronLeft, ClipboardList, FileSignature, Landmark } from 'lucide-react';
import { type ReactNode, useId } from 'react';

import {
  AppShell,
  Badge,
  Button,
  Card,
  InfoSummary,
  NavRail,
  type NavRailItem,
  Stepper,
} from '@actoz/ui';
import {
  Amount,
  FileSlots,
  JudgmentSummary,
  type JudgmentItem,
  SourcedValue,
  StatusPill,
  type SettlementStatus,
  UnknownValue,
} from '@actoz/kit-settlement';

export const settlementMenus: NavRailItem[] = [
  { id: 'home', label: '정산 현황', icon: <ClipboardList />, href: '#home' },
  { id: 'contract', label: '계약 마스터', icon: <FileSignature />, href: '#contract' },
  { id: 'collection', label: 'MG·수금 현황', icon: <Landmark />, href: '#collection' },
];

/** 스토리용 정산 내비 레일. 로고는 NavRail 기본값을 쓴다. */
export function settlementRail(activeId: 'home' | 'contract' | 'collection' = 'home') {
  return <NavRail items={settlementMenus} activeId={activeId} aria-label="주 메뉴" />;
}

/** 정산 화면의 틀: 내비 레일 + 담당자 칩 + 본문. 본문만 스크롤한다. */
export function SettlementShell({ activeId = 'home', children }: { activeId?: 'home' | 'contract' | 'collection'; children: ReactNode }) {
  return (
    <AppShell rail={settlementRail(activeId)}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-10 py-10">
          <div className="flex justify-end">
            <Badge variant="soft" size="md">
              담당자 · 라테일·천년
            </Badge>
          </div>
          {children}
        </div>
      </div>
    </AppShell>
  );
}

/** 제목이 있는 한 구역. */
export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id={id} className="text-heading font-semibold">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** 정산 건 화면의 머리: 목록으로 돌아가기, `정산단위 · 정산월 · 단계` 제목, 상태, 3단계 진행. */
export function CaseHeader({ title, status, stage }: { title: string; status: SettlementStatus; stage: 0 | 1 | 2 }) {
  return (
    <header className="flex flex-col gap-3">
      <a href="#home" className="inline-flex items-center gap-1 self-start text-body-sm text-muted-foreground underline underline-offset-4">
        <ChevronLeft aria-hidden className="size-4" />
        정산 현황
      </a>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-title font-bold">{title}</h1>
          <StatusPill status={status} />
        </div>
        <Stepper steps={['추정', '정산', '발행·수금']} current={stage} />
      </div>
    </header>
  );
}

/** 결과 카드(오른쪽). 핵심 값과 출처를 담고, 맨 아래에 확정 버튼과 안내 문장을 둔다. */
export function ResultCard({ title, children, footer }: { title: string; children: ReactNode; footer?: ReactNode }) {
  const id = useId();
  return (
    <aside aria-labelledby={id}>
      <Card variant="emphasis" padding="lg" className="flex flex-col gap-5">
        <h2 id={id} className="text-heading font-semibold">
          {title}
        </h2>
        <div className="flex flex-col gap-4">{children}</div>
        {footer ? <div className="flex flex-col gap-2 border-t border-border pt-4">{footer}</div> : null}
      </Card>
    </aside>
  );
}

/** 왼쪽 근거 + 오른쪽 결과 카드의 2단 배치. */
export function SplitLayout({ children }: { children: ReactNode }) {
  return <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">{children}</div>;
}

/** 표 머리·셀 공통 클래스. 통화마다 표를 나누므로 금액은 오른쪽 정렬. */
export const th = 'px-4 py-2 text-left text-body-sm font-normal text-muted-foreground';
export const td = 'px-4 py-3 text-body align-top';

// 정산 건 목록 ----------------------------------------------------------------

export interface SettlementCase {
  id: string;
  unit: string;
  month: string;
  status: SettlementStatus;
  exceptions: number;
  /** 비고 열. 예외 코드면 ExceptionBadge로 그린다. */
  note: { code: string } | { text: string } | null;
  href: string;
}

export const settlementCases: SettlementCase[] = [
  { id: 'c1', unit: '라테일플러스 한국', month: '2026.09', status: '추정 검토', exceptions: 0, note: { text: '확인 대기' }, href: '#estimate' },
  { id: 'c2', unit: '천년 어게인', month: '2026.05', status: '정산 검토', exceptions: 1, note: { code: 'E05' }, href: '#review' },
  { id: 'c3', unit: '라테일플러스 한국', month: '2026.08', status: '송부', exceptions: 0, note: { text: '미입금 23일' }, href: '#issue' },
  { id: 'c4', unit: '라테일플러스 일본', month: '2026.08', status: '결재 종결', exceptions: 0, note: { text: '종결 (MG 미소진)' }, href: '#case' },
  { id: 'c5', unit: '영항도', month: '2026.08', status: '정산서 대기', exceptions: 0, note: null, href: '#case' },
  { id: 'c6', unit: '천년3', month: '2026.09', status: '정산서 대기', exceptions: 0, note: { text: '추정 단계 없음' }, href: '#case' },
  { id: 'c7', unit: '천년성세', month: '2026.09', status: '자료 대기', exceptions: 0, note: { text: '필수 자료 0/1' }, href: '#case' },
];

// 정산 검토 화면 ----------------------------------------------------------------

/** 정산 검토 화면 본문. 「정산 검토」 템플릿과 「예외 처리」 템플릿(배경)이 함께 쓴다. */
export function ReviewScreen({ resolved = false, onHandleException }: { resolved?: boolean; onHandleException?: () => void }) {
  const items: JudgmentItem[] = [
    {
      code: 'E05',
      situation: '재계산 로열티 ≠ 정산서 로열티',
      ...(resolved
        ? { resolved: { by: '담당자', at: '2026.06.03 14:20' } }
        : { action: { label: '처리', onClick: onHandleException } }),
    },
  ];
  return (
    <SettlementShell>
      <CaseHeader title="천년 어게인 · 2026.05 · 정산 검토" status="정산 검토" stage={1} />
      <FileSlots
        title="업로드 자료"
        slots={[
          { name: '정산서 xlsx', received: true },
          { name: '스토어 원본 6종', received: true },
          { name: '1차 예상매출', received: true },
        ]}
      />
      <SplitLayout>
        <div className="flex flex-col gap-6">
          <Section title="판정 요약">
            <JudgmentSummary items={items} />
          </Section>

          <Section title="대사">
            <Card padding="none" className="overflow-x-auto">
              <table className="w-full border-collapse">
                <caption className="sr-only">대사 결과</caption>
                <thead>
                  <tr className="border-b border-border bg-subtle">
                    <th scope="col" className={th}>구분</th>
                    <th scope="col" className={th}>결과</th>
                    <th scope="col" className={`${th} text-right`}>차이</th>
                  </tr>
                </thead>
                <tbody>
                  {['1차 ↔ 2차', '2차 ↔ 정산서'].map((name) => (
                    <tr key={name} className="border-b border-border last:border-b-0">
                      <td className={td}>{name}</td>
                      <td className={td}>✓ 일치</td>
                      <td className={`${td} text-right tabular-nums`}>0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Section>

          <Section title="로열티 검산">
            <Card padding="none" className="overflow-x-auto">
              <table className="w-full border-collapse">
                <caption className="sr-only">정산서 로열티와 재계산 로열티 비교</caption>
                <thead>
                  <tr className="border-b border-border bg-subtle">
                    <th scope="col" className={th}>정산서 원문</th>
                    <th scope="col" className={th}>재계산</th>
                    <th scope="col" className={th}>차액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>
                      <div className="flex flex-col gap-1">
                        <Amount currency="USD" value="31,240.00" />
                        <span className="text-caption text-muted-foreground">출처: 정산서 C12</span>
                      </div>
                    </td>
                    <td className={td}>
                      <Amount currency="USD" value="31,238.50" />
                    </td>
                    <td className={td}>
                      <div className="flex flex-col gap-1">
                        <span className="tabular-nums">1.50</span>
                        <span className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
                          허용 오차 <UnknownValue kind="undecided" reference="Q-02" />
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Section>

          <Section title="환율">
            <InfoSummary
              items={[
                { label: '정산서 환율', value: '1,372.4000' },
                { label: '기준환율', value: '1,372.4000' },
                { label: '결과', value: '✓ 일치' },
              ]}
            />
            <p className="text-caption text-muted-foreground">출처: 서울외국환중개 2026.05.29</p>
          </Section>
        </div>

        <ResultCard
          title="MG"
          footer={
            <>
              <Button disabled={!resolved} aria-describedby="confirm-note">
                검토 확정
              </Button>
              <p id="confirm-note" className="text-body-sm text-muted-foreground">
                예외를 처리하면 활성화됩니다. 확정하면 품의서·인보이스 초안을 만듭니다.
              </p>
            </>
          }
        >
          <SourcedValue label="MG 상태" value="소진 이후" />
          <SourcedValue label="월초 MG 잔액" source="2026.04 확정값에서 연결">
            <Amount currency="USD" value="0.00" />
          </SourcedValue>
          <SourcedValue label="청구액" source="정산서 C12 · MG 차감 없음">
            <Amount currency="USD" value="31,240.00" />
          </SourcedValue>
        </ResultCard>
      </SplitLayout>
    </SettlementShell>
  );
}

/** 예외 처리 대화상자 안 「기준과 다른 점」. */
export function Exception05Comparison() {
  return (
    <>
      <table className="w-full text-body-sm">
        <caption className="sr-only">정산서 원문과 재계산 비교</caption>
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th scope="col" className="py-1.5 pr-3 font-normal">정산서 원문</th>
            <th scope="col" className="py-1.5 pr-3 font-normal">재계산</th>
            <th scope="col" className="py-1.5 font-normal">차액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1.5 pr-3"><Amount currency="USD" value="31,240.00" /></td>
            <td className="py-1.5 pr-3"><Amount currency="USD" value="31,238.50" /></td>
            <td className="py-1.5 tabular-nums">1.50</td>
          </tr>
        </tbody>
      </table>
      <p className="text-body-sm text-muted-foreground">
        허용 오차: <UnknownValue kind="undecided" /> (완전일치 적용)
      </p>
    </>
  );
}

export const e05Reasons = [
  { id: 'r1', label: '정산서 금액을 따름 · 반올림 차이' },
  { id: 'r2', label: '정산서 금액을 따름 · 차감 항목 차이' },
  {
    id: 'r3',
    label: '정산서 오류 · 퍼블리셔 문의 후 수정본 업로드',
    resolve: {
      notice:
        '정산서 오류는 확인 후 진행하지 않습니다. 이 건은 대기 상태가 되고, 퍼블리셔에 문의한 뒤 수정 정산서를 올리면 다시 판정합니다.',
      actionLabel: '수정 정산서 업로드',
    },
  },
  { id: 'r4', label: '기타', other: true },
];
