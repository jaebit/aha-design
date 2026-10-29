import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button, Card } from '@actoz/ui';
import { ExceptionBadge, ExceptionPanel, SourcedValue } from '@actoz/kit-settlement';

import { CaseHeader, e05Reasons, Exception05Comparison, ReviewScreen, SettlementShell } from './fixtures';
import { withLinkActions } from './link-actions';

interface ExceptionHandlingPageProps {
  /** 처음에 골라 둘 사유 id. */
  defaultReasonId?: string;
}

/** 예외 처리: 정산 검토 화면 위에 E05(확인 후 진행) 처리 대화상자를 연다. 기준과 다른 점을 먼저 보이고, 사유를 고르게 한다. */
function ExceptionHandlingPage({ defaultReasonId }: ExceptionHandlingPageProps) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <ReviewScreen onHandleException={() => setOpen(true)} />
      <ExceptionPanel
        open={open}
        onOpenChange={setOpen}
        code="E05"
        situation="재계산 로열티 ≠ 정산서 로열티"
        comparison={<Exception05Comparison />}
        reasons={e05Reasons}
        defaultReasonId={defaultReasonId}
      />
    </>
  );
}

/** 진행 불가(E06) 예시 화면. 해제·무시 버튼은 없고, 원인을 푸는 동작 하나만 둔다. */
function BlockedExceptionPage() {
  return (
    <SettlementShell activeId="home">
      <CaseHeader title="천년3 · 2026.08 · 정산 검토" status="정산 검토" stage={1} />
      <section aria-labelledby="blocked-title" className="max-w-xl">
        <Card variant="emphasis" padding="lg" className="flex flex-col gap-4">
          <p className="text-body-sm text-muted-foreground">다른 정산 건 예시 · 천년3 · 2026.08</p>
          <header className="flex flex-col gap-1.5">
            <ExceptionBadge code="E06" />
            <h2 id="blocked-title" className="text-heading font-semibold">
              정산서 환율 ≠ 기준환율
            </h2>
          </header>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <SourcedValue label="정산서 환율" value="7.1820" />
              <SourcedValue label="기준환율" value="7.1586" />
            </div>
            <p className="text-caption text-muted-foreground">출처: CFETS 中间价 2026.08.31</p>
          </div>
          <p className="text-body text-foreground">해제할 수 없습니다. 퍼블리셔에 문의한 뒤 수정 정산서를 올리면 다시 판정합니다.</p>
          <Button className="self-start">수정 정산서 업로드</Button>
        </Card>
      </section>
    </SettlementShell>
  );
}

const meta = {
  title: 'Templates/ExceptionHandling',
  tags: ['kit:settlement'],
  component: ExceptionHandlingPage,
  // 대화상자가 열려 화면 전체를 덮으므로 갤러리가 iframe으로 격리한다.
  parameters: { layout: 'fullscreen', density: 'compact', docs: { story: { inline: false, height: '720px' } } },
  decorators: [withLinkActions()],
} satisfies Meta<typeof ExceptionHandlingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 열린 E05 처리 대화상자. 기본 사유는 「정산서 금액을 따름」이고 주 버튼은 「확인 후 진행」이다. */
export const Default: Story = {};

/** 「정산서 오류」를 고른 상태. 확인 후 진행하지 않고 주 버튼이 「수정 정산서 업로드」로 바뀐다. */
export const ServiceError: Story = { args: { defaultReasonId: 'r3' } };

/** 진행 불가(E06) 예시. 해제 버튼이 없다. */
export const Blocked: Story = { render: () => <BlockedExceptionPage /> };
