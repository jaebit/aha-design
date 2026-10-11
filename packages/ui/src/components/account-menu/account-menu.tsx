import { LogOut, Settings } from 'lucide-react';

import { Avatar } from '../avatar/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu/dropdown-menu';
import { cn } from '../../lib/cn';

export interface AccountMenuProps {
  /** 사용자 이름. 예: "김하마". */
  name: string;
  /** 소속 팀. 예: "팀아하". */
  team: string;
  /** 메뉴 맨 위에 보이는 회사 이메일. */
  email: string;
  /** 아바타에 보일 짧은 이름. 예: "하마". */
  initials: string;
  /** true면 아바타 옆에 이름과 팀을 보여준다 (넓은 레일, 1쪽). */
  expanded?: boolean;
  /** 생략하면 "관리자 설정" 항목을 숨긴다. 관리자에게만 넘긴다. */
  onAdminSettings?: () => void;
  /** "로그아웃"을 눌렀을 때. */
  onLogout: () => void;
}

/** 내비 레일 맨 아래 계정 버튼과 메뉴 (19쪽). */
export function AccountMenu({ name, team, email, initials, expanded = false, onAdminSettings, onLogout }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${name} 계정 메뉴`}
        className={cn(
          'flex cursor-pointer items-center gap-3 rounded-lg text-left hover:bg-accent data-[state=open]:bg-accent',
          expanded ? 'w-full p-2' : 'p-1',
        )}
      >
        <Avatar initials={initials} alt={name} />
        {expanded ? (
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-body font-semibold">{name}</span>
            <span className="truncate text-body-sm text-muted-foreground">{team}</span>
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-72">
        <DropdownMenuLabel>
          <p className="text-body font-semibold">{name}</p>
          <p className="text-body-sm text-muted-foreground">
            {team} · {email}
          </p>
        </DropdownMenuLabel>
        {onAdminSettings ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onAdminSettings}>
              <Settings /> 관리자 설정
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onLogout}>
          <LogOut /> 로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
