import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** 앱 루트(또는 AppShell)에 한 번 둔다. 툴팁이 뜨기까지의 지연을 공유한다. */
export function TooltipProvider({ delayDuration = 200, ...props }: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * 어두운 툴팁 (3쪽 "사내 가이드" 용어 설명).
 * 한두 문장의 보충 설명에만 쓴다. 꼭 알아야 하는 정보는 툴팁에 숨기지 않는다.
 */
export function TooltipContent({ className, sideOffset = 6, children, ...props }: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 max-w-xs rounded-md bg-tooltip px-3 py-2 text-body-sm text-tooltip-foreground shadow-popover [&_strong]:font-semibold',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-tooltip" width={10} height={5} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export interface TooltipTermProps {
  /** 점선 밑줄로 표시할 용어. */
  term: string;
  /** 툴팁 내용. */
  children: ReactNode;
}

/** 문장 속 용어에 점선 밑줄을 긋고, 포커스·호버 시 설명을 보여준다 (3쪽 입력창 아래 안내 문구). */
export function TooltipTerm({ term, children }: TooltipTermProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="cursor-help font-semibold text-foreground underline decoration-dotted underline-offset-4"
        >
          {term}
        </button>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}
