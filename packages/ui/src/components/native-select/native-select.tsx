import { ChevronDown } from 'lucide-react';
import type { ChangeEventHandler, ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/cn';

// 네이티브 select 속성은 모두 그대로 받는다. 아래에 다시 적은 속성은 문서(Storybook MCP)에 보이도록 한 것이다.
// docgen은 react 타입에서 온 속성을 문서에서 빼기 때문에, 자주 쓰는 속성은 여기서 직접 선언한다.
export interface NativeSelectProps extends ComponentProps<'select'> {
  /** `<option>` 요소들. 첫 옵션은 보통 "전체 …"이며 `value=""`로 둔다. */
  children: ReactNode;
  /** 제어 모드 값. `onChange`와 함께 쓴다. */
  value?: string;
  /** 비제어 모드 초깃값. */
  defaultValue?: string;
  /** 선택이 바뀌면 호출된다. 새 값은 `event.target.value`. */
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  /** 화면에 라벨이 없을 때 스크린리더용 이름. 라벨이 있으면 FilterField로 감싼다. */
  'aria-label'?: string;
  disabled?: boolean;
  /** 바깥 상자의 너비 조정용 (select가 아니라 감싸는 div에 붙는다). 예: `w-56`. */
  className?: string;
}

/**
 * 브라우저 기본 select에 AHA 스타일을 입힌 선택 상자 (15쪽 서비스군 · 서비스 필터).
 * 모바일과 스크린리더에서 기본 동작을 그대로 쓰기 위해 커스텀 드롭다운 대신 네이티브 요소를 쓴다.
 * 옵션은 `<option>` 자식으로 넣는다. 라벨이 화면에 없으면 `aria-label`을 준다.
 */
export function NativeSelect({ className, children, ...props }: NativeSelectProps) {
  return (
    <div data-slot="native-select" className={cn('relative w-full min-w-40', className)}>
      <select
        className="h-12 w-full cursor-pointer appearance-none rounded-md border border-input bg-background pr-10 pl-4 text-body text-foreground outline-none transition-colors focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-40"
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
