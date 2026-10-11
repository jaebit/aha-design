import type { ReactNode } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/tooltip';
import { cn } from '../../lib/cn';

export interface NavRailItem {
  id: string;
  label: string;
  /** lucide-react 아이콘 요소. 예: `<MessageSquareText />` */
  icon: ReactNode;
  /** 지정하면 `<a>`로 렌더링한다. 라우터를 쓰면 `onNavigate`로 처리한다. */
  href?: string;
}

export interface NavRailProps {
  /** 서비스 목록 (사내 가이드 챗, 회의록 생성 …). */
  items: NavRailItem[];
  /** 레일 아래쪽 항목. 와이어프레임은 "전체 기록" 하나 (1쪽). */
  bottomItems?: NavRailItem[];
  /** 현재 화면의 항목 id. */
  activeId?: string;
  /**
   * - `true`: 로고와 라벨을 함께 보여주는 넓은 레일. 홈 화면 (1, 19쪽).
   * - `false`: 아이콘만 있는 좁은 레일. 서비스 화면 (2쪽 이후). 라벨은 툴팁으로 보여준다.
   */
  expanded?: boolean;
  /** 항목을 눌렀을 때. `href`와 함께 쓰면 기본 이동 전에 호출된다. */
  onNavigate?: (id: string) => void;
  /** 맨 아래 계정 영역. `AccountMenu`. */
  account?: ReactNode;
  /** 로고 영역. 기본은 "AHA 💡". */
  logo?: ReactNode;
  className?: string;
}

/** 왼쪽 글로벌 내비게이션 레일. 모든 화면에 있다. 좁은 레일은 라벨을 툴팁으로 보여주므로 `TooltipProvider`(AppShell에 포함) 안에서 쓴다. */
export function NavRail({
  items,
  bottomItems = [],
  activeId,
  expanded = false,
  onNavigate,
  account,
  logo,
  className,
}: NavRailProps) {
  return (
    <nav
      data-slot="nav-rail"
      aria-label="서비스"
      data-expanded={expanded}
      className={cn(
        'flex h-full shrink-0 flex-col border-r border-border bg-subtle',
        expanded ? 'w-62 px-4' : 'w-20 items-center px-3',
        className,
      )}
    >
      <div className={cn('relative flex h-24 items-center', expanded ? 'px-3' : 'justify-center')}>
        {logo ?? (
          <span className="text-title font-bold tracking-wide">
            {expanded ? 'AHA ' : null}
            <span aria-hidden>💡</span>
            {expanded ? null : <span className="sr-only">AHA</span>}
          </span>
        )}
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <RailLink item={item} active={item.id === activeId} expanded={expanded} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-1 pb-4">
        <ul className="flex flex-col gap-1">
          {bottomItems.map((item) => (
            <li key={item.id}>
              <RailLink item={item} active={item.id === activeId} expanded={expanded} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
        {account ? <div className={cn('pt-3', expanded && '-mx-4 border-t border-border px-4')}>{account}</div> : null}
      </div>
    </nav>
  );
}

function RailLink({
  item,
  active,
  expanded,
  onNavigate,
}: {
  item: NavRailItem;
  active: boolean;
  expanded: boolean;
  onNavigate?: (id: string) => void;
}) {
  const Comp = item.href ? 'a' : 'button';
  const link = (
    <Comp
      href={item.href}
      type={item.href ? undefined : 'button'}
      aria-current={active ? 'page' : undefined}
      aria-label={expanded ? undefined : item.label}
      onClick={() => onNavigate?.(item.id)}
      className={cn(
        'flex cursor-pointer items-center rounded-lg text-body text-foreground transition-colors hover:bg-accent aria-[current=page]:bg-muted [&_svg]:size-5 [&_svg]:shrink-0',
        expanded ? 'h-12 w-full gap-3 px-3' : 'size-12 justify-center',
      )}
    >
      {item.icon}
      {expanded ? <span className="truncate">{item.label}</span> : null}
    </Comp>
  );

  if (expanded) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
