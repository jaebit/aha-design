import { Badge, Button, cn } from '@actoz/ui';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SessionItem {
  /** 세션 id. 로그아웃 콜백에 넘어간다. */
  id: string;
  /** 기기와 브라우저. 예: "Windows · Chrome 141". */
  device: string;
  /** 기기 종류. 왼쪽 아이콘을 정한다. 기본 `desktop`. */
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  /** 접속 IP. 예: "10.20.31.7". */
  ip: string;
  /** 대략의 위치. 예: "서울". */
  location?: string;
  /** 마지막 활동 (표시 문자열). 예: "방금 전", "2시간 전". */
  lastActive: string;
  /** 로그인한 때 (표시 문자열). 예: "2026-10-08 09:12". */
  signedInAt?: string;
  /** 지금 이 화면을 보고 있는 기기의 세션이면 true. "이 기기" 배지가 붙는다. */
  current?: boolean;
  /** OAuth 앱으로 연결된 세션이면 앱 이름. 예: "Claude Desktop". */
  client?: string;
}

export interface SessionListProps {
  /** 세션 목록. 이 기기 세션을 맨 앞에 둔다. */
  sessions: SessionItem[];
  /** 세션 하나를 로그아웃할 때. 주면 행마다 "로그아웃" 버튼이 생긴다 (이 기기 세션은 `allowRevokeCurrent`일 때만). */
  onRevoke?: (id: string) => void;
  /** 이 기기를 뺀 모든 세션을 로그아웃할 때. 주면 목록 위에 "다른 기기 모두 로그아웃" 버튼이 생긴다. */
  onRevokeAll?: () => void;
  /** 이 기기 세션에도 로그아웃 버튼을 둘지. 관리자가 다른 사용자의 세션을 볼 때 true. 기본 false. */
  allowRevokeCurrent?: boolean;
  /** 세션이 없을 때 문구. 기본 "활성 세션이 없습니다." */
  emptyText?: ReactNode;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

const deviceIcons = { desktop: Monitor, mobile: Smartphone, tablet: Tablet } as const;

/**
 * 활성 로그인 세션 목록. 관리 콘솔의 사용자 상세와 계정 설정 > 보안에서 쓴다.
 * 행마다 기기, 접속 위치·IP, 마지막 활동을 보여주고, OAuth 앱 세션은 앱 이름을 함께 적는다.
 * 로그아웃처럼 되돌릴 수 없는 일괄 작업(`onRevokeAll`)은 ConfirmDialog로 한 번 더 묻는다.
 */
export function SessionList({
  sessions,
  onRevoke,
  onRevokeAll,
  allowRevokeCurrent = false,
  emptyText = '활성 세션이 없습니다.',
  className,
}: SessionListProps) {
  const others = sessions.filter((s) => !s.current).length;
  return (
    <div data-slot="session-list" className={cn('flex flex-col rounded-lg border border-border', className)}>
      {onRevokeAll ? (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <span className="text-body-sm text-muted-foreground">활성 세션 {sessions.length}개</span>
          <Button variant="secondary" size="sm" onClick={onRevokeAll} disabled={others === 0}>
            다른 기기 모두 로그아웃
          </Button>
        </div>
      ) : null}
      {sessions.length === 0 ? (
        <p className="px-4 py-6 text-center text-body-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {sessions.map((session) => {
            const Icon = deviceIcons[session.deviceType ?? 'desktop'];
            const canRevoke = onRevoke && (!session.current || allowRevokeCurrent);
            const place = [session.location, session.ip].filter(Boolean).join(' · ');
            return (
              <li key={session.id} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-5">
                  <Icon aria-hidden />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-body font-medium text-foreground">{session.device}</span>
                    {session.current ? <Badge tone="good">이 기기</Badge> : null}
                    {session.client ? <Badge variant="soft">{session.client}</Badge> : null}
                  </div>
                  <p className="text-body-sm text-muted-foreground">
                    {place} · 마지막 활동 {session.lastActive}
                  </p>
                  {session.signedInAt ? (
                    <p className="text-caption text-muted-foreground">로그인 {session.signedInAt}</p>
                  ) : null}
                </div>
                {canRevoke ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    aria-label={`${session.device} 세션 로그아웃`}
                    onClick={() => onRevoke(session.id)}
                  >
                    로그아웃
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
