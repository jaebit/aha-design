import type { ReactNode } from 'react';

import { cn } from '@aha/ui';

export interface DescriptionItem {
  /** 항목 이름. 예: "가입일", "클라이언트 ID". */
  label: string;
  /** 값. 글자, Badge, 링크 등. 값이 없으면 "—"를 넣는다. 예: `<Badge tone="good">활성</Badge>`. */
  value: ReactNode;
  /** 한 줄 전체를 쓰는 긴 값(메모, 주소, 리디렉션 URI 목록)이면 true. */
  wide?: boolean;
}

export interface DescriptionListProps {
  /** 보여줄 항목. 화면에 보이는 순서대로 넘긴다. */
  items: DescriptionItem[];
  /** 넓은 화면의 열 수. 기본 2. 좁은 화면에서는 항상 1열. */
  columns?: 1 | 2 | 3;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

const columnClass = { 1: '', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3' } as const;

/**
 * 읽기 전용 상세 정보 (이름 → 값). 상세 화면 위쪽의 요약이나, 편집 권한이 없을 때의 보기 화면에 쓴다.
 * 값을 바꾸는 화면은 FormSection + FormField를 쓴다. 두세 개의 짧은 정보를 한 줄로 보여줄 때는 InfoSummary를 쓴다.
 */
export function DescriptionList({ items, columns = 2, className }: DescriptionListProps) {
  return (
    <dl data-slot="description-list" className={cn('grid gap-x-10 gap-y-5', columnClass[columns], className)}>
      {items.map((item) => (
        <div key={item.label} className={cn('flex min-w-0 flex-col gap-1', item.wide && 'sm:col-span-full')}>
          <dt className="text-body-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-body break-words text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
