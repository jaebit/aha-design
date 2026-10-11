import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/cn';

/** ListRow를 담는 목록. 행 사이에 구분선이 들어간다. */
export function List({ className, ...props }: ComponentProps<'ul'>) {
  return <ul data-slot="list" className={cn('flex flex-col divide-y divide-border border-y border-border', className)} {...props} />;
}

export interface ListRowProps extends Omit<ComponentProps<'a'>, 'title'> {
  /** 이동할 주소. 키보드로 열 수 있도록 필수다. */
  href: string;
  /** 첫 줄. 길면 한 줄로 자른다. */
  title: ReactNode;
  /** 제목 아래 한 줄. 예: 첫 질문 미리보기 (2쪽). */
  description?: ReactNode;
  /** 왼쪽. 보통 서비스 태그 `<Badge>`. */
  leading?: ReactNode;
  /** 오른쪽. 시간("오늘 09:40") 또는 건수("3건 ›"). */
  trailing?: ReactNode;
}

/**
 * 링크 한 줄. `List` 안에 넣는다.
 * 홈의 이어서 하기(1쪽), 전체 기록(2쪽), 관리자의 확인할 일(20쪽)에 쓴다.
 */
export function ListRow({ href, title, description, leading, trailing, className, ...props }: ListRowProps) {
  return (
    <li>
      <a
        data-slot="list-row"
        href={href}
        className={cn('flex items-center gap-4 px-2 py-4 transition-colors hover:bg-accent', className)}
        {...props}
      >
        {leading ? <span className="w-32 shrink-0">{leading}</span> : null}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-body text-foreground">{title}</span>
          {description ? <span className="truncate text-body-sm text-muted-foreground">{description}</span> : null}
        </span>
        {trailing ? <span className="shrink-0 text-body-sm text-muted-foreground">{trailing}</span> : null}
      </a>
    </li>
  );
}
