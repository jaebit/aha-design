import type { ReactNode } from 'react';

import { cn } from '@aha/ui';

export interface FormSectionProps {
  /** 묶음 이름. 예: "기본 정보", "역할과 권한". */
  title: string;
  /** 묶음 설명. 무엇을 정하는 곳인지, 바꾸면 어떻게 되는지. */
  description?: ReactNode;
  /** FormField 목록이나 PermissionMatrix. */
  children: ReactNode;
  className?: string;
}

/**
 * 편집 폼의 묶음 하나. 넓은 화면에서는 왼쪽에 제목·설명, 오른쪽에 항목을 두고, 좁은 화면에서는 위아래로 쌓는다.
 * 여러 묶음을 이어 두면 사이에 구분선이 생긴다. 폼 맨 아래에는 FormActions를 둔다.
 */
export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section
      data-slot="form-section"
      aria-label={title}
      className={cn(
        'grid gap-6 border-b border-border py-8 first:pt-0 last:border-b-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-heading font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="flex min-w-0 max-w-2xl flex-col gap-6">{children}</div>
    </section>
  );
}
