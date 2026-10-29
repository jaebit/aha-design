import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button, Card, DataTable, type DataTableColumn, FilterField, NativeSelect, PageHeader } from '@actoz/ui';
import { Amount, UnknownValue } from '@actoz/kit-settlement';

import { Section, SettlementShell } from './fixtures';
import { withLinkActions } from './link-actions';

interface MgRow {
  unit: string;
  total: ReactNode;
  used: ReactNode;
  balance: ReactNode;
  status: ReactNode;
}

const unknown = <UnknownValue kind="unknown" />;
const dash = <span className="text-muted-foreground">—</span>;

const mgRows: MgRow[] = [
  { unit: '라테일플러스 한국', total: <Amount currency="USD" value="300,000" />, used: <Amount currency="USD" value="300,000" />, balance: '0', status: '소진 이후' },
  { unit: '라테일플러스 일본', total: <Amount currency="USD" value="300,000" />, used: <Amount currency="USD" value="299,244.17" />, balance: <Amount currency="USD" value="755.83" />, status: '미소진' },
  { unit: '천년 어게인', total: <Amount currency="USD" value="200,000" />, used: <Amount currency="USD" value="200,000" />, balance: '0', status: '소진 이후' },
  { unit: '영항도', total: <Amount currency="CNY" value="4,000,000" />, used: <Amount currency="CNY" value="4,000,000" />, balance: '0', status: '소진 이후' },
  { unit: '천년성세', total: unknown, used: unknown, balance: unknown, status: unknown },
  { unit: '천년3', total: 'MG 없음', used: dash, balance: dash, status: dash },
];

const mgColumns: DataTableColumn<MgRow>[] = [
  { key: 'unit', header: '정산단위', cell: (row) => row.unit },
  { key: 'total', header: 'MG 총액', cell: (row) => row.total },
  { key: 'used', header: '누적 차감', cell: (row) => row.used },
  { key: 'balance', header: '잔액', cell: (row) => row.balance },
  { key: 'status', header: '상태', cell: (row) => row.status },
];

interface CollectionRow {
  unit: string;
  issued: string;
  paid: string;
  unpaid: string;
  subtotal?: boolean;
}

const numberCell = (value: string, bold?: boolean) => <span className={bold ? 'font-semibold tabular-nums' : 'tabular-nums'}>{value}</span>;

function collectionColumns(): DataTableColumn<CollectionRow>[] {
  return [
    { key: 'unit', header: '정산단위', cell: (row) => (row.subtotal ? <span className="font-semibold">{row.unit}</span> : row.unit) },
    { key: 'issued', header: '발행', align: 'end', cell: (row) => numberCell(row.issued, row.subtotal) },
    { key: 'paid', header: '입금', align: 'end', cell: (row) => numberCell(row.paid, row.subtotal) },
    { key: 'unpaid', header: '미입금', align: 'end', cell: (row) => numberCell(row.unpaid, row.subtotal) },
  ];
}

const usdRows: CollectionRow[] = [
  { unit: '라테일플러스 한국', issued: '86,420.10', paid: '57,504.70', unpaid: '28,915.40' },
  { unit: '천년 어게인', issued: '64,310.00', paid: '64,310.00', unpaid: '0' },
  { unit: 'USD 소계', issued: '150,730.10', paid: '121,814.70', unpaid: '28,915.40', subtotal: true },
];

const cnyRows: CollectionRow[] = [
  { unit: '영항도', issued: '1,284,000.00', paid: '1,284,000.00', unpaid: '0' },
  { unit: 'CNY 소계', issued: '1,284,000.00', paid: '1,284,000.00', unpaid: '0', subtotal: true },
];

function CurrencyTable({ currency, rows }: { currency: string; rows: CollectionRow[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-body font-semibold">{currency}</h3>
      <Card padding="none">
        <DataTable caption={`${currency} 수금 현황`} columns={collectionColumns()} rows={rows} getRowId={(row) => row.unit} />
      </Card>
    </div>
  );
}

/** MG·수금 현황: MG 현황 표와, 통화마다 나눈 수금 현황 표. 통화가 다른 금액은 합산하지 않고 소계도 통화 안에서만 낸다. */
function CollectionStatusPage() {
  return (
    <SettlementShell activeId="collection">
      <PageHeader
        title="MG·수금 현황"
        aside={
          <div className="flex items-center gap-3">
            <FilterField label="기간">
              <NativeSelect defaultValue="2026.01-2026.09" className="w-48">
                <option value="2026.01-2026.09">2026.01 ~ 2026.09</option>
                <option value="2025.01-2025.12">2025.01 ~ 2025.12</option>
              </NativeSelect>
            </FilterField>
            <Button variant="secondary">
              <Download aria-hidden />
              엑셀 내려받기
            </Button>
          </div>
        }
      />

      <Section title="MG 현황">
        <Card padding="none">
          <DataTable caption="MG 현황" columns={mgColumns} rows={mgRows} getRowId={(row) => row.unit} />
        </Card>
      </Section>

      <Section title="수금 현황">
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <CurrencyTable currency="USD" rows={usdRows} />
          <CurrencyTable currency="CNY" rows={cnyRows} />
        </div>
        <p className="text-body-sm text-muted-foreground">통화가 다른 금액은 환산 기준 없이 합산하지 않습니다.</p>
      </Section>
    </SettlementShell>
  );
}

const meta = {
  title: 'Templates/CollectionStatus',
  tags: ['kit:settlement'],
  component: CollectionStatusPage,
  parameters: { layout: 'fullscreen', density: 'compact' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof CollectionStatusPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기간별 MG 소진과 수금 현황. 값을 모르는 정산단위(천년성세)는 0이 아니라 미확인으로 보이고, 미확인이 있는 열은 합계를 내지 않는다. */
export const Default: Story = {};
