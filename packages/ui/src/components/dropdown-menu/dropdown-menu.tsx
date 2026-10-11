import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/cn';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/** 메뉴 패널. 대화 더보기 메뉴(8쪽), 계정 메뉴(19쪽). */
export function DropdownMenuContent({ className, sideOffset = 6, ...props }: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-48 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-popover',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export interface DropdownMenuItemProps extends ComponentProps<typeof DropdownMenuPrimitive.Item> {
  /** 삭제처럼 되돌릴 수 없는 항목. 빨간 글자로 표시하고 구분선 아래 마지막에 둔다. */
  destructive?: boolean;
}

/** 아이콘 + 라벨 메뉴 항목. */
export function DropdownMenuItem({ className, destructive, ...props }: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        'flex h-10 cursor-pointer select-none items-center gap-2.5 rounded-md px-3 text-body outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[disabled]:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0',
        destructive && 'text-destructive',
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn('mx-1.5 my-1.5 h-px bg-border', className)} {...props} />;
}

/** 메뉴 맨 위의 정보 영역. 계정 메뉴의 이름·팀·이메일 (19쪽). */
export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" className={cn('px-3 py-2', className)} {...props} />;
}
