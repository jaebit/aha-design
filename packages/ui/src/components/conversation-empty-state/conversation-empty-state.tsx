import type { ReactNode } from 'react';

import { Badge } from '@/components/badge/badge';
import { cn } from '@/lib/cn';

export interface ConversationEmptyStateProps {
  /** 무엇을 할 수 있는지 한 문장. 예: "사내 가이드에서 찾아드려요" (3쪽). */
  title: string;
  /** `variant="hero"` Composer를 넣는다. */
  composer: ReactNode;
  /** 입력 제약 정보. 예: ["mp3, wav, m4a", "최대 512MB · 3시간"] (10쪽). */
  constraints?: string[];
  /** 아래쪽 보조 영역. 예시 질문(Suggestions)이나 팁(Callout). */
  children?: ReactNode;
  className?: string;
}

/**
 * AI 서비스의 빈 상태 화면 (3, 10, 12쪽).
 * 제목 → 입력창 → 제약 정보 → 예시 질문 또는 팁 순서로 화면 가운데에 놓는다.
 */
export function ConversationEmptyState({ title, composer, constraints, children, className }: ConversationEmptyStateProps) {
  return (
    <div
      data-slot="conversation-empty-state"
      className={cn('mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6', className)}
    >
      <h1 className="text-center text-display font-normal text-foreground">{title}</h1>
      {composer}
      {constraints && constraints.length > 0 ? (
        <ul className="flex flex-wrap justify-center gap-2" aria-label="입력 조건">
          {constraints.map((constraint) => (
            <li key={constraint}>
              <Badge variant="soft" size="md">
                {constraint}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}
      {children ? <div className="w-full">{children}</div> : null}
    </div>
  );
}
