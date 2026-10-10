import { ExternalLink, PanelLeftClose, Pin, Plus } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { Button } from '../button/button';
import { cn } from '../../lib/cn';

export interface ServiceSidebarProps {
  /** 서비스 이름. 예: "사내 가이드 챗". */
  title: string;
  /** 접기 버튼. 생략하면 버튼을 숨긴다. 접힌 상태에서는 ConversationHeader의 `leading`에 펼치기 버튼을 둔다 (6쪽). */
  onCollapse?: () => void;
  /** 맨 위 주 액션. 예: { label: "새 대화" }, { label: "새 회의록" }, { label: "새 검토" }. */
  newAction?: { label: string; onClick: () => void };
  /** `SidebarSection` 목록. */
  children?: ReactNode;
  /** 사이드바 맨 아래 고정 영역. 예: 외부 시스템 링크 (20쪽 "IAM 및 관리자"). */
  footer?: ReactNode;
  className?: string;
}

/** 서비스별 사이드바: 제목, 새로 만들기, 고정됨·최근 기록 (3쪽). */
export function ServiceSidebar({ title, onCollapse, newAction, children, footer, className }: ServiceSidebarProps) {
  return (
    <aside
      data-slot="service-sidebar"
      aria-label={title}
      className={cn('flex h-full w-75 shrink-0 flex-col border-r border-border bg-subtle', className)}
    >
      <div className="flex h-24 shrink-0 items-center justify-between border-b border-border px-6">
        <h2 className="truncate text-title font-bold">{title}</h2>
        {onCollapse ? (
          <Button variant="ghost" size="icon" aria-label="사이드바 접기" onClick={onCollapse}>
            <PanelLeftClose />
          </Button>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-5">
        {newAction ? (
          <Button variant="secondary" className="justify-start border-border" onClick={newAction.onClick}>
            <Plus /> {newAction.label}
          </Button>
        ) : null}
        {children}
      </div>
      {footer ? <ul className="shrink-0 border-t border-border px-4 py-3">{footer}</ul> : null}
    </aside>
  );
}

export interface SidebarSectionProps {
  /** 섹션 이름. 예: "고정됨", "최근 기록", "보고서". */
  title: string;
  /** 섹션 오른쪽 링크. 예: "전체 기록" 링크. */
  action?: ReactNode;
  children: ReactNode;
}

/** 사이드바의 묶음 하나 (고정됨 / 최근 기록, 8쪽). */
export function SidebarSection({ title, action, children }: SidebarSectionProps) {
  return (
    <section data-slot="sidebar-section" className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-2 pb-1">
        <h3 className="text-body-sm font-medium text-muted-foreground">{title}</h3>
        {action}
      </div>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </section>
  );
}

export interface HistoryItemProps extends Omit<ComponentProps<'a'>, 'title' | 'href'> {
  title: string;
  /** 기록 주소. 키보드로 열 수 있도록 필수다. 클라이언트 라우터를 쓰면 `onClick`에서 기본 이동을 막고 처리한다. */
  href: string;
  /** 날짜나 상태. 예: "오늘 09:40", "어제 · 메일 발송 완료". */
  meta?: string;
  /** 지금 보고 있는 기록이면 true. */
  active?: boolean;
  /** 고정된 기록이면 true. 메타 앞에 핀 아이콘이 붙는다. */
  pinned?: boolean;
  /**
   * 메타 위치. 사내 가이드 챗은 날짜를 위에(`top`, 3쪽),
   * 회의록·문서 검토·ITH는 상태를 아래에(`bottom`, 10쪽) 둔다.
   */
  metaPosition?: 'top' | 'bottom';
}

/** 사이드바의 기록 한 줄. `SidebarSection` 안에 넣는다. */
export function HistoryItem({
  title,
  meta,
  active = false,
  pinned = false,
  metaPosition = 'top',
  className,
  ...props
}: HistoryItemProps) {
  const metaLine = meta ? (
    <span className="flex items-center gap-1 text-caption text-muted-foreground">
      {pinned ? <Pin className="size-3" aria-label="고정됨" /> : null}
      {meta}
    </span>
  ) : null;

  return (
    <li>
      <a
        data-slot="history-item"
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex cursor-pointer flex-col gap-0.5 rounded-md px-3 py-2.5 transition-colors hover:bg-accent aria-[current=page]:bg-muted',
          className,
        )}
        {...props}
      >
        {metaPosition === 'top' ? metaLine : null}
        <span className="truncate text-body text-foreground">{title}</span>
        {metaPosition === 'bottom' ? metaLine : null}
      </a>
    </li>
  );
}

export interface SidebarNavItemProps extends Omit<ComponentProps<'a'>, 'children'> {
  href: string;
  label: string;
  /** lucide-react 아이콘 요소. */
  icon?: ReactNode;
  /** 지금 보고 있는 메뉴면 true. */
  active?: boolean;
  /** 처리할 건수. 0보다 크면 오른쪽에 검정 배지로 보여준다 (20쪽 "사내 가이드 챗 관리"). */
  count?: number;
  /** 다른 시스템으로 이동하는 링크면 true. 새 탭으로 열고 바깥 화살표를 붙인다 (20쪽 "IAM 및 관리자"). */
  external?: boolean;
}

/** 아이콘이 있는 사이드바 메뉴 (20쪽 관리자 설정, 15쪽 ITH 보고서 목록). `SidebarSection` 안이나 사이드바 맨 아래에 둔다. */
export function SidebarNavItem({ href, label, icon, active = false, count, external = false, className, ...props }: SidebarNavItemProps) {
  return (
    <li className="list-none">
      <a
        data-slot="sidebar-nav-item"
        href={href}
        aria-current={active ? 'page' : undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className={cn(
          'flex h-11 items-center gap-3 rounded-md px-3 text-body text-foreground transition-colors hover:bg-accent aria-[current=page]:bg-muted aria-[current=page]:font-semibold [&_svg]:size-4.5 [&_svg]:shrink-0',
          className,
        )}
        {...props}
      >
        {icon}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {count != null && count > 0 ? (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-caption font-semibold text-primary-foreground">
            <span className="sr-only">처리할 건수 </span>
            {count}
          </span>
        ) : null}
        {external ? (
          <>
            <ExternalLink aria-hidden className="text-muted-foreground" />
            <span className="sr-only">(새 탭)</span>
          </>
        ) : null}
      </a>
    </li>
  );
}
