import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface PageHeaderProps {
  title: string;
  /** 제목 아래 한 줄 설명. 예: "모든 서비스에서 나눈 대화를 한곳에서 찾아보세요." */
  description?: string;
  /** 오른쪽 영역. 예: 시간대 표시 (15쪽), 월 이동 (20쪽). */
  aside?: ReactNode;
  className?: string;
}

/** 대화형이 아닌 페이지의 머리말: 전체 기록(2쪽), 뉴스레터(14쪽), ITH 보고서(15쪽), 관리자(20쪽). */
export function PageHeader({ title, description, aside, className }: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn('flex items-end justify-between gap-6', className)}>
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="text-title font-bold text-foreground">{title}</h1>
        {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
      </div>
      {aside ? <div className="shrink-0 text-body-sm text-muted-foreground">{aside}</div> : null}
    </header>
  );
}
