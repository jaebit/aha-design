import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { AppShell, Badge, Card, InfoSummary, PageHeader, Switch } from '@aha/ui';

import { ahaRail, ahaUser } from './fixtures';
import { withLinkActions } from './link-actions';

/** 뉴스레터 구독 (14쪽): 수신 정보 요약 + 뉴스레터별 구독 스위치. */
function NewsletterPage() {
  const [subscribed, setSubscribed] = useState(true);
  return (
    <AppShell rail={ahaRail('newsletter')}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex max-w-5xl flex-col gap-6 px-12 py-12">
          <PageHeader title="뉴스레터 구독" description="구독을 하시면 회사 이메일로 뉴스레터를 받아볼 수 있습니다." />
          <InfoSummary
            items={[
              { label: '수신 이메일', value: ahaUser.email },
              { label: '발송 주기', value: '하루 한 번' },
            ]}
          />
          <Card variant={subscribed ? 'emphasis' : 'default'} padding="lg" className="flex items-start gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Badge className="w-fit">AI</Badge>
              <h2 className="text-heading font-semibold">AI 소식</h2>
              <p className="text-body-sm text-muted-foreground">
                생성형 AI, 주요 모델 업데이트, 실무 활용 사례와 업계 동향을 간결하게 정리합니다.
              </p>
              <ul aria-label="다루는 주제" className="flex flex-wrap gap-2 pt-1">
                {['모델 업데이트', '개발 도구', '업무 활용', '정책 동향'].map((topic) => (
                  <li key={topic}>
                    <Badge variant="soft" size="md">
                      {topic}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
            <Switch
              label="AI 소식 구독"
              checked={subscribed}
              onCheckedChange={setSubscribed}
              stateLabels={{ on: '구독 중', off: '구독 안 함' }}
            />
          </Card>
          <p className="text-center text-body-sm text-muted-foreground">발송 방식과 일정은 운영 정책에 따라 변경될 수 있습니다.</p>
        </div>
      </div>
    </AppShell>
  );
}

const meta = {
  title: 'Templates/Newsletter',
  component: NewsletterPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withLinkActions()],
} satisfies Meta<typeof NewsletterPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 스위치를 누르면 구독 상태와 카드 강조가 바로 바뀐다. */
export const Default: Story = {};
