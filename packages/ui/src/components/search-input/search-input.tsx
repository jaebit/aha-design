import { Search } from 'lucide-react';
import type { ChangeEventHandler, ComponentProps } from 'react';

import { cn } from '../../lib/cn';

// 네이티브 input 속성은 모두 그대로 받는다. 아래에 다시 적은 속성은 문서(Storybook MCP)에 보이도록 한 것이다.
// docgen은 react 타입에서 온 속성을 문서에서 빼기 때문에, 자주 쓰는 속성은 여기서 직접 선언한다.
export interface SearchInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  /** 제어 모드 값. `onChange`와 함께 쓴다. */
  value?: string;
  /** 비제어 모드 초깃값. */
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** 입력 전 안내 문구. 예: "대화 내용 검색". 라벨을 대신하지 않으므로 `aria-label`도 준다. */
  placeholder?: string;
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
