import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

import { AppShell, Badge, Chip, List, ListRow, PageHeader, SearchInput } from '@actoz/ui';

import { ahaRail } from './fixtures';
import { withLinkActions } from './link-actions';

const services = ['전체', '사내 가이드 챗', '회의록 생성', '문서 검토', 'ITH', 'IP 로열티 정산', '자금 일보'];

const records = [
  { id: 'r1', service: 'ITH', title: '10/03 처리 메일 급증 원인', preview: '10월 3일 처리 메일이 왜 이렇게 많아?', at: '오늘 10:12' },
  { id: 'r2', service: '사내 가이드 챗', title: '연차 이월 · 회식비 증빙 문의', preview: '올해 못 쓴 연차, 내년으로 이월할 수 있어?', at: '오늘 09:40' },
  { id: 'r3', service: '회의록 생성', title: '9/21 회의 액션아이템 정리', preview: '이 회의 녹음으로 회의록 만들어줘', at: '어제' },
  { id: 'r4', service: '문서 검토', title: '계약서 해지 조항 검토', preview: '이 계약서 검토해줘', at: '어제' },
  { id: 'r5', service: 'IP 로열티 정산', title: '정산 관련 질문', preview: '9월 정산 금액이 왜 달라?', at: '10/06' },
  { id: 'r6', service: '자금 일보', title: '자금 일보 관련 질문', preview: '어제 입금 내역 정리해줘', at: '10/05' },
  { id: 'r7', service: '사내 가이드 챗', title: '사무용품 신청 방법', preview: '사무용품은 어디서 신청해?', at: '10/02' },
];

/** 전체 기록 (2쪽): 좁은 레일, 페이지 머리말, 검색, 서비스 필터 칩, 기록 목록. */
function AllHistoryPage() {
  const [service, setService] = useState('전체');
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      records.filter(
        (record) =>
          (service === '전체' || record.service === service) &&
          (query === '' || `${record.title} ${record.preview}`.includes(query)),
      ),
    [service, query],
  );

  return (
    <AppShell rail={ahaRail('history')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex max-w-5xl flex-col gap-6 px-12 py-12">
          <PageHeader title="전체 기록" description="모든 서비스에서 나눈 대화를 한곳에서 찾아보세요." />
          <SearchInput
            aria-label="대화 검색"
            placeholder="대화 제목이나 내용으로 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div role="group" aria-label="서비스 필터" className="flex flex-wrap gap-2">
            {services.map((item) => (
              <Chip key={item} selected={service === item} onClick={() => setService(item)}>
                {item}
              </Chip>
            ))}
          </div>
          <List>
            {filtered.map((record) => (
              <ListRow
                key={record.id}
                href={`#${record.id}`}
                leading={<Badge>{record.service}</Badge>}
                title={<span className="font-semibold">{record.title}</span>}
                description={record.preview}
                trailing={record.at}
              />
            ))}
          </List>
          {filtered.length === 0 ? <p className="py-8 text-center text-body text-muted-foreground">찾는 기록이 없어요.</p> : null}
        </div>
      </div>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/AllHistory',
  tags: ['kit:ai'],
  component: AllHistoryPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof AllHistoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 검색어를 입력하거나 서비스 칩을 누르면 목록이 걸러진다. */
export const Default: Story = {};
