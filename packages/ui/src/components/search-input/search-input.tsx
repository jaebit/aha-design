import { Search } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/cn';

export interface SearchInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  /** 스크린리더용 이름. 화면에 라벨이 없으므로 필수다. 예: "대화 검색". */
  'aria-label': string;
}

/** 돋보기 아이콘이 있는 큰 검색창 (2쪽 전체 기록). */
export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div data-slot="search-input" className={cn('relative w-full', className)}>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        className="h-14 w-full rounded-lg border border-input bg-background pr-5 pl-13 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-border-strong"
        {...props}
      />
    </div>
  );
}
