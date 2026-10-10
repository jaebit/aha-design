import type { ReactNode } from 'react';

import { cn } from '@aha/ui';

export interface FormActionsProps {
  /** 버튼들. 오른쪽 끝에 주요 버튼(저장)이 오도록 [취소, 저장] 순서로 둔다. */
  children: ReactNode;
  /** 왼쪽 안내. 예: "저장하지 않은 변경 2건". */
  note?: ReactNode;
  /** true면 화면 아래에 붙어 스크롤해도 보인다. 긴 편집 폼에 쓴다. */
  sticky?: boolean;
  className?: string;
}

/** 편집 폼 맨 아래의 버튼 줄 (취소 · 저장). */
export function FormActions({ children, note, sticky = false, className }: FormActionsProps) {
  return (
    <div
      data-slot="form-actions"
      className={cn(
        'flex flex-wrap items-center justify-end gap-3 border-t border-border bg-background py-4',
        sticky && 'sticky bottom-0 z-10',
        className,
      )}
    >
      {note ? <p className="mr-auto text-body-sm text-muted-foreground">{note}</p> : null}
      {children}
    </div>
  );
}
