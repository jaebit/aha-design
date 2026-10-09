import { ChevronRight, Ellipsis, Pencil, Pin, PinOff, Trash2 } from 'lucide-react';
import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu/dropdown-menu';
import { Input } from '@/components/input/input';
import { cn } from '@/lib/cn';

export interface ConversationHeaderProps {
  /** 대화 제목. */
  title: string;
  /** 서비스 이름. 지정하면 "서비스 › 제목" 브레드크럼으로 보여준다. 사이드바를 접었을 때 쓴다 (6쪽). */
  serviceName?: string;
  /** 제목 왼쪽 버튼. 사이드바를 접었을 때 펼치기·새 대화 버튼을 둔다 (6쪽). */
  leading?: ReactNode;
  /** 제목 오른쪽, 메뉴 앞 영역. 단계 표시(Stepper, 11·13쪽)를 둔다. */
  trailing?: ReactNode;
  /** 이름 변경. 생략하면 메뉴에서 "이름 변경"을 숨긴다. */
  onRename?: (title: string) => void;
  /** 고정 여부. */
  pinned?: boolean;
  /** 고정/해제. 생략하면 메뉴에서 숨긴다. */
  onPinnedChange?: (pinned: boolean) => void;
  /** 삭제. 생략하면 메뉴에서 숨긴다. 확인 대화상자는 앱에서 띄운다. */
  onDelete?: () => void;
  className?: string;
}

/**
 * 대화 화면 상단 머리말 (5–9쪽): 제목, 더보기 메뉴(이름 변경·고정·삭제), 인라인 이름 변경.
 * 이름 변경 중에는 Enter로 저장, Esc로 취소한다 (8쪽).
 */
export function ConversationHeader({
  title,
  serviceName,
  leading,
  trailing,
  onRename,
  pinned = false,
  onPinnedChange,
  onDelete,
  className,
}: ConversationHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  // 메뉴에서 "이름 변경"을 고르면 메뉴가 닫히며 포커스를 트리거로 되돌린다. 그러면 입력창이 바로 blur되므로 이때만 막는다.
  const renameRequested = useRef(false);
  const hasMenu = onRename != null || onPinnedChange != null || onDelete != null;

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEditing = () => {
    renameRequested.current = true;
    setDraft(title);
    setEditing(true);
  };

  const commit = () => {
    const next = draft.trim();
    if (next && next !== title) onRename?.(next);
    setEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setEditing(false);
    }
  };

  return (
    <header
      data-slot="conversation-header"
      className={cn('flex h-20 shrink-0 items-center gap-3 border-b border-border px-6', className)}
    >
      {leading ? <div className="flex shrink-0 items-center gap-1">{leading}</div> : null}

      <div className="flex min-w-0 flex-1 items-center gap-3">
        {editing ? (
          <>
            <Input
              ref={inputRef}
              aria-label="대화 이름"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commit}
              className="h-11 max-w-md text-heading font-semibold"
            />
            <span className="shrink-0 text-body-sm text-muted-foreground">Enter 저장 · Esc 취소</span>
          </>
        ) : (
          <h1 className="flex min-w-0 items-center gap-1.5 text-heading font-semibold">
            {serviceName ? (
              <>
                <span className="shrink-0 font-normal text-muted-foreground">{serviceName}</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </>
            ) : null}
            <span className="truncate">{title}</span>
          </h1>
        )}
      </div>

      {trailing ? <div className="shrink-0">{trailing}</div> : null}

      {hasMenu ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="대화 메뉴" className="data-[state=open]:bg-accent">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            onCloseAutoFocus={(event) => {
              if (renameRequested.current) {
                event.preventDefault();
                renameRequested.current = false;
              }
            }}
          >
            {onRename ? (
              <DropdownMenuItem onSelect={startEditing}>
                <Pencil /> 이름 변경
              </DropdownMenuItem>
            ) : null}
            {onPinnedChange ? (
              <DropdownMenuItem onSelect={() => onPinnedChange(!pinned)}>
                {pinned ? <PinOff /> : <Pin />} {pinned ? '고정 해제' : '대화 고정'}
              </DropdownMenuItem>
            ) : null}
            {onDelete ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onSelect={onDelete}>
                  <Trash2 /> 삭제
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </header>
  );
}
