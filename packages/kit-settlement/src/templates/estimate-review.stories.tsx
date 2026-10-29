import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Card } from '@actoz/ui';
import { Amount, FileSlots, JudgmentSummary, SourcedValue } from '@actoz/kit-settlement';

import { CaseHeader, ResultCard, Section, SettlementShell, SplitLayout, td, th } from './fixtures';
import { withLinkActions } from './link-actions';

const rows = [
  { store: '구글', currency: 'KRW', sales: '182,450,000' },
  { store: '애플', currency: 'KRW', sales: '95,120,000' },
  { store: '애플', currency: 'USD', sales: '1,820.50' },
  { store: '원스토어', currency: 'KRW', sales: '41,300,000' },
  { store: '갤럭시', currency: 'KRW', sales: '12,880,000' },
  { store: 'now.gg', currency: 'KRW', sales: '8,210,000' },
];

/** 추정 검토: 1차 자료 → 판정 요약 → 스토어·통화별 집계(왼쪽), 추정 결과와 전달 확정(오른쪽). 확정 버튼은 주 버튼 하나. */
function EstimateReviewPage() {
  return (
    <SettlementShell activeId="home">
      <CaseHeader title="라테일플러스 한국 · 2026.09 · 추정 검토" status="추정 검토" stage={0} />
      <SplitLayout>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <FileSlots
              title="1차 자료"
              slots={['구글', '갤럭시', '원스토어', '애플', 'now.gg'].map((name) => ({ name, received: true }))}
            />
            <Button variant="link" size="sm" className="self-start">
              파일 추가·교체
            </Button>
          </div>

          <Section title="판정 요약">
            <JudgmentSummary items={[]} />
          </Section>

          <Section title="스토어·통화별 집계">
            <Card padding="none" className="overflow-x-auto">
              <table className="w-full border-collapse">
                <caption className="sr-only">스토어·통화별 매출 집계</caption>
                <thead>
                  <tr className="border-b border-border bg-subtle">
                    <th scope="col" className={th}>스토어</th>
                    <th scope="col" className={th}>결제통화</th>
                    <th scope="col" className={`${th} text-right`}>매출</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.store}-${row.currency}`} className="border-b border-border last:border-b-0">
                      <td className={td}>{row.store}</td>
                      <td className={`${td} font-mono`}>{row.currency}</td>
                      <td className={`${td} text-right tabular-nums`}>{row.sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <p className="text-body-sm text-muted-foreground">통화가 다른 금액은 합산하지 않습니다</p>
          </Section>
        </div>

        <ResultCard
          title="추정 결과"
          footer={
            <>
              <Button>전달 확정</Button>
              <p className="text-body-sm text-muted-foreground">확정하면 재무팀 전달본을 만들고 추정치를 고정합니다.</p>
            </>
          }
        >
          <SourcedValue label="기준환율" value="1,380.2000" source="서울외국환중개 2026.09.30" />
          <SourcedValue label="로열티 기준액" source="계약 마스터 기준액 정의">
            <div className="flex flex-col gap-2">
              <Amount currency="USD" value="237,302.18" />
              <table aria-label="차감 내역" className="w-full text-body-sm">
                <tbody>
                  <tr>
                    <th scope="row" className="py-1 pr-2 text-left font-normal text-muted-foreground">매출 합계</th>
                    <td className="py-1 text-right"><Amount currency="KRW" value="339,960,000" /></td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-1 pr-2 text-left font-normal text-muted-foreground">원스토어 포인트 차감</th>
                    <td className="py-1 text-right tabular-nums">− 1,980,000</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-1 pr-2 text-left font-normal text-muted-foreground">
                      ÷1.1 차감 3건
                      <span className="block text-caption">애플 원화 행 · 원스토어(포인트 차감 후) · now.gg</span>
                    </th>
                    <td className="py-1 text-right tabular-nums">− 12,968,181.82</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-1 pr-2 text-left font-normal text-muted-foreground">차감 후</th>
                    <td className="py-1 text-right"><Amount currency="KRW" value="325,011,818.18" /></td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-1 pr-2 text-left font-normal text-muted-foreground">USD 환산</th>
                    <td className="py-1 text-right tabular-nums">
                      ÷ 1,380.2000 + <Amount currency="USD" value="1,820.50" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SourcedValue>
          <SourcedValue label="요율" value="10%" source="계약 마스터 2024.01~" />
          <SourcedValue label="추정 로열티">
            <Amount size="lg" currency="USD" value="23,730.22" />
          </SourcedValue>
        </ResultCard>
      </SplitLayout>
    </SettlementShell>
  );
}

const meta = {
  title: 'Templates/EstimateReview',
  tags: ['kit:settlement'],
  component: EstimateReviewPage,
  parameters: { layout: 'fullscreen', density: 'compact' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof EstimateReviewPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 예외가 없는 추정 검토. 담당자는 결과를 보고 「전달 확정」만 누른다. 통화가 다른 금액은 합산하지 않는다. */
export const Default: Story = {};
