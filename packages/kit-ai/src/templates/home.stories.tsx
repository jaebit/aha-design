import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileSearch, MessageSquareText, Mic } from 'lucide-react';

import { AppShell, Badge, Button, List, ListRow, ServiceCard } from '@aha/ui';

import { ahaRail } from './fixtures';
import { withLinkActions } from './link-actions';

/** 홈 화면 (1쪽): 넓은 내비 레일, 인사말, 서비스 카드 3개, 이어서 하기. */
function HomePage() {
  return (
    <AppShell rail={ahaRail(undefined, true)}>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-20">
          <div className="flex flex-col items-center gap-4">
            <span aria-hidden className="text-display">
              💡
            </span>
            <h1 className="text-display font-normal">안녕하세요, 하마님</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ServiceCard
              icon={<MessageSquareText />}
              title="사내 가이드 챗"
              description="등록된 사내 가이드에서 답을 찾아드려요."
              tag="질문 입력"
              href="#guide-chat"
            />
            <ServiceCard
              icon={<Mic />}
              title="회의록 생성"
              description="회의 녹음으로 회의록을 만들고 메일로 보내요."
              tag="녹음 파일"
              href="#meeting-minutes"
            />
            <ServiceCard
              icon={<FileSearch />}
              title="문서 검토"
              description="계약서와 문서의 조항, 리스크를 검토해요."
              tag="문서 파일"
              href="#document-review"
            />
          </div>

          <section className="flex flex-col gap-3" aria-labelledby="continue-heading">
            <div className="flex items-center justify-between">
              <h2 id="continue-heading" className="text-heading font-semibold">
                이어서 하기
              </h2>
              <Button variant="link" size="sm" asChild>
                <a href="#history">전체 기록 보기</a>
              </Button>
            </div>
            <List>
              <ListRow href="#c1" leading={<Badge>사내 가이드 챗</Badge>} title="연차 이월 · 회식비 증빙 문의" trailing="오늘 09:40" />
              <ListRow href="#m1" leading={<Badge>회의록 생성</Badge>} title="[주간 회의] 회의록" trailing="어제" />
              <ListRow href="#d1" leading={<Badge>문서 검토</Badge>} title="용역계약서 검토" trailing="어제" />
            </List>
          </section>
        </div>
      </div>
      <footer className="py-4 text-center text-caption tracking-wide text-muted-foreground">
        COPYRIGHT © ACTOZ SOFT CO., LTD. ALL RIGHTS RESERVED.
      </footer>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/Home',
  tags: ['kit:ai'],
  component: HomePage,
  parameters: { layout: 'fullscreen' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 로그인 후 첫 화면: 서비스 카드와 이어서 하기 목록 (1쪽). */
export const Default: Story = {};
