import { ChevronDown } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

/**
 * 브라우저 기본 select에 AHA 스타일을 입힌 선택 상자 (15쪽 서비스군 · 서비스 필터).
 * 모바일과 스크린리더에서 기본 동작을 그대로 쓰기 위해 커스텀 드롭다운 대신 네이티브 요소를 쓴다.
 * 옵션은 `<option>` 자식으로 넣는다. 라벨이 화면에 없으면 `aria-label`을 준다.
 */
export function NativeSelect({ className, children, ...props }: ComponentProps<'select'>) {
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
