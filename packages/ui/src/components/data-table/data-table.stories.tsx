import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Badge } from '../badge/badge';
import { Card } from '../card/card';
import { Pagination } from '../pagination/pagination';
import { CellText, DataTable, type DataTableColumn } from './data-table';

interface ErrorReport {
  date: string;
  mails: number;
  groups: number;
  quality: string;
  createdAt: string;
}

const reports: ErrorReport[] = [
  { date: '2026-10-06', mails: 71, groups: 26, quality: '일부 품질 저하', createdAt: '2026-10-07 09:06:44' },
  { date: '2026-10-05', mails: 47, groups: 34, quality: '일부 품질 저하', createdAt: '2026-10-06 09:03:29' },
  { date: '2026-10-04', mails: 69, groups: 35, quality: '일부 품질 저하', createdAt: '2026-10-05 09:03:44' },
  { date: '2026-10-03', mails: 132, groups: 68, quality: '일부 품질 저하', createdAt: '2026-10-04 09:07:10' },
  { date: '2026-10-02', mails: 119, groups: 48, quality: '일부 품질 저하', createdAt: '2026-10-03 09:05:20' },
];

const columns: DataTableColumn<ErrorReport>[] = [
  {
    key: 'date',
    header: '대상 날짜',
    cell: (row) => (
      <CellText
        primary={
          <a href={`#report/${row.date}`} className="font-semibold underline underline-offset-4">
            {row.date}
          </a>
        }
        secondary="일일 · 1차 생성"
      />
    ),
  },
  { key: 'mails', header: '처리 메일', cell: (row) => <CellText primary={`${row.mails}건`} strong /> },
  { key: 'groups', header: '그룹', cell: (row) => `${row.groups}개` },
  { key: 'quality', header: '보고서 품질', cell: (row) => <Badge>{row.quality}</Badge> },
  {
    key: 'createdAt',
    header: '생성 시각',
    secondary: true,
    cell: (row) => <CellText primary={row.createdAt} secondary="Korea Standard Time" />,
  },
];

// 제네릭 컴포넌트는 값으로 `DataTable<ErrorReport>`나 캐스트를 넘기면 Storybook manifest가 컴포넌트를 찾지 못한다.
// 값은 DataTable 그대로 넘기고, 행 타입은 satisfies로만 고정한다.
const meta = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  args: {
    caption: '일일 오류 보고서 목록',
    columns,
    rows: reports,
    getRowId: (row: ErrorReport) => row.date,
  },
  decorators: [
    (Story) => (
      <Card padding="none" className="max-w-6xl overflow-hidden">
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof DataTable<ErrorReport>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ITH 일일 오류 보고서 (15쪽): 두 줄 셀, 링크 셀, 배지 셀, 안내 문구와 페이지네이션. */
export const Reports: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(1);
    return (
      <DataTable
        {...args}
        footer={
          <>
            <p className="text-body-sm text-muted-foreground">
              처리 메일·그룹 수는 전체 서비스 기준입니다. 수집·제외 건수는 보고서 상세에서 확인할 수 있습니다.
            </p>
            <Pagination page={page} pageCount={1} onPageChange={setPage} />
          </>
        }
      />
    );
  },
};

/** 옆 대화 패널이 열렸을 때 (16쪽): 보조 열을 숨기고 이야기 중인 행을 강조. */
export const CompactWithSelection: Story = {
  args: { compact: true, selectedRowId: '2026-10-03' },
};

/** 조회 결과가 없을 때. */
export const Empty: Story = { args: { rows: [] } };
