import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button, Callout, Card, FilterField, NativeSelect } from '@actoz/ui';
import { Amount, UnknownValue } from '@actoz/kit-settlement';

import { SettlementShell } from './fixtures';
import { withLinkActions } from './link-actions';

const code = (value: string) => <span className="font-mono">{value}</span>;

const terms: { label: string; value: ReactNode }[] = [
  { label: '식별', value: 'IP 라테일 · 권역 한국 · 퍼블리셔 VFive' },
  { label: '발행 문서', value: '소재지 한국 → 전자세금계산서' },
  {
    label: '통화',
    value: <>정산 {code('USD')} · 청구 {code('USD')} · 허용 결제통화 {code('KRW, USD, CAD, AUD')}</>,
  },
  { label: '기준환율', value: '서울외국환중개 매매기준율 · 정산월 말일 (휴일이면 직전 영업일)' },
  { label: '요율', value: '단일 10% · 계산 단위 총액' },
  { label: '로열티 기준액 차감', value: '원스토어 포인트 차감 후 ÷1.1 · now.gg ÷1.1 · 애플 원화 행 ÷1.1' },
  { label: '반올림', value: <UnknownValue kind="undecided" reference="Q-01" /> },
  { label: '허용 오차', value: <UnknownValue kind="undecided" reference="완전일치 적용 · Q-02" /> },
  {
    label: 'MG · LF',
    value: (
      <span className="inline-flex flex-wrap items-baseline gap-x-2">
        MG <Amount currency="USD" value="300,000" /> · LF <Amount currency="USD" value="100,000" />
      </span>
    ),
  },
  { label: '필수 자료', value: '1차: 스토어 원본 5종 / 2차: 정산서 + 스토어 원본 5종' },
];

/** 계약 마스터 · 상세: 한 정산단위의 계약 조건을 적용 시작월 버전별로 읽는다. 확정되지 않은 조건은 UnknownValue로 보이고 질문 ID를 함께 적는다. */
function ContractMasterPage() {
  return (
    <SettlementShell activeId="contract">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-title font-bold">라테일플러스 한국</h1>
          <FilterField label="적용 시작월">
            <NativeSelect defaultValue="2024.01" className="w-44">
              <option value="2024.01">2024.01 ~ (현행)</option>
              <option value="2022.07">2022.07 ~ 2023.12</option>
              <option value="2021.03">2021.03 ~ 2022.06</option>
            </NativeSelect>
          </FilterField>
          <a href="#versions" className="text-body-sm underline underline-offset-4">
            이전 버전 <span className="tabular-nums">2</span>건
          </a>
        </div>
        <Button>
          <Plus aria-hidden />새 버전 추가
        </Button>
      </header>

      <Callout title="미확정 2개 · 반올림, 허용 오차">확정 전에는 차이가 모두 예외로 표시됩니다</Callout>

      <section aria-label="계약 조건">
        <Card padding="lg">
          <dl className="grid grid-cols-[10rem_minmax(0,1fr)] gap-x-6 gap-y-3 text-body">
            {terms.map((term) => (
              <div key={term.label} className="col-span-2 grid grid-cols-subgrid items-baseline border-b border-border pb-3 last:border-b-0 last:pb-0">
                <dt className="text-muted-foreground">{term.label}</dt>
                <dd>{term.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      <p className="text-body-sm text-muted-foreground">과거 정산월에는 그 월의 조건 버전을 적용합니다.</p>
    </SettlementShell>
  );
}

const meta = {
  title: 'Templates/ContractMaster',
  tags: ['kit:settlement'],
  component: ContractMasterPage,
  parameters: { layout: 'fullscreen', density: 'compact' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof ContractMasterPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 현행 버전의 계약 조건. 반올림과 허용 오차가 미확정이라 차이가 모두 예외로 표시된다는 안내를 위에 둔다. */
export const Default: Story = {};
