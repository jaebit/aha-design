import type { ReactNode } from 'react';

import { Button, cn } from '@aha/ui';

export interface PreviewCardProps {
  /** 미리보기 제목. 예: "음성 원문 미리보기". */
  title: string;
  /** 처음 몇 줄. 여러 줄이면 배열로 넘긴다. */
  lines: string[];
  /** "전체 보기" 링크 문구. 예: "원문 전체 보기". */
  moreLabel?: string;
  /** 전체 보기 링크 주소. `onMore`와 함께 쓰지 않는다. */
  moreHref?: string;
  /** 전체 보기를 화면 안에서 열 때 (다이얼로그, 패널). */
  onMore?: () => void;
  className?: string;
  children?: ReactNode;
}

/**
 * 긴 중간 결과의 앞부분만 보여주는 카드 (11쪽 음성 원문 미리보기).
 * 사용자가 내용을 확인하고 다음 단계로 넘어가게 할 때 쓴다.
 */
export function PreviewCard({ title, lines, moreLabel = '전체 보기', moreHref, onMore, className, children }: PreviewCardProps) {
  return (
    <div data-slot="preview-card" className={cn('flex flex-col gap-3 rounded-lg border border-border p-5', className)}>
      <h3 className="text-body-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-1 text-body-sm text-muted-foreground">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
        <p aria-hidden>…</p>
      </div>
      {children}
      {moreHref || onMore ? (
        moreHref ? (
          <Button variant="link" size="sm" asChild className="w-fit text-body-sm">
            <a href={moreHref}>{moreLabel}</a>
          </Button>
        ) : (
          <Button variant="link" size="sm" onClick={onMore} className="w-fit text-body-sm">
            {moreLabel}
          </Button>
        )
      ) : null}
    </div>
  );
}
