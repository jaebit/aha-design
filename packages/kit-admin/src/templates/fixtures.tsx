// 스토리 전용 예시 데이터. 관리자 화면 템플릿이 함께 쓰는 내비게이션과 사용자 목록.
import { AppWindow, ChartColumn, FileClock, FileText, LayoutGrid, Settings, ShieldCheck, UserRound, Users } from 'lucide-react';

import {
  AccountMenu,
  type BadgeTone,
  NavRail,
  type NavRailItem,
  type ScopeItem,
  ServiceSidebar,
  SidebarNavItem,
  SidebarSection,
} from '@actoz/ui';
import type { PermissionAction, PermissionResource, SessionItem } from '@actoz/kit-admin';

export const adminMenus: NavRailItem[] = [
  { id: 'dashboard', label: '대시보드', icon: <LayoutGrid />, href: '#dashboard' },
  { id: 'users', label: '사용자', icon: <Users />, href: '#users' },
  { id: 'content', label: '공지와 문서', icon: <FileText />, href: '#content' },
  { id: 'stats', label: '통계', icon: <ChartColumn />, href: '#stats' },
];

/** 스토리용 관리자 내비 레일. */
export function adminRail(activeId = 'users') {
  return (
    <NavRail
      items={adminMenus}
      bottomItems={[{ id: 'settings', label: '시스템 설정', icon: <Settings />, href: '#settings' }]}
      activeId={activeId}
      account={<AccountMenu name="박관리" team="정보보안팀" email="admin@actoz.com" initials="관리" onLogout={() => {}} />}
    />
  );
}

/** 스토리용 "사용자" 메뉴 사이드바. */
export function usersSidebar(active: 'list' | 'roles' | 'audit' = 'list') {
  return (
    <ServiceSidebar title="사용자">
      <SidebarSection title="메뉴">
        <SidebarNavItem href="#users" label="사용자 목록" icon={<Users />} active={active === 'list'} count={128} />
        <SidebarNavItem href="#roles" label="역할과 권한" icon={<ShieldCheck />} active={active === 'roles'} />
        <SidebarNavItem href="#audit" label="변경 기록" icon={<FileText />} active={active === 'audit'} />
      </SidebarSection>
    </ServiceSidebar>
  );
}

export type UserStatus = 'active' | 'invited' | 'inactive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  team: string;
  role: '관리자' | '운영자' | '조회 전용';
  status: UserStatus;
  lastSeen: string;
}

export const statusBadge: Record<UserStatus, { label: string; tone: 'good' | 'warning' | 'critical' }> = {
  active: { label: '활성', tone: 'good' },
  invited: { label: '초대됨', tone: 'warning' },
  inactive: { label: '비활성', tone: 'critical' },
};

export const adminUsers: AdminUser[] = [
  { id: 'u1', name: '김하마', email: 'hama@actoz.com', team: '팀아하', role: '관리자', status: 'active', lastSeen: '2026-10-10 09:12' },
  { id: 'u2', name: '이수달', email: 'sudal@actoz.com', team: '플랫폼팀', role: '운영자', status: 'active', lastSeen: '2026-10-10 08:47' },
  { id: 'u3', name: '박해달', email: 'haedal@actoz.com', team: '플랫폼팀', role: '운영자', status: 'active', lastSeen: '2026-10-09 18:30' },
  { id: 'u4', name: '최너구리', email: 'raccoon@actoz.com', team: '재무팀', role: '조회 전용', status: 'invited', lastSeen: '—' },
  { id: 'u5', name: '정다람', email: 'daram@actoz.com', team: '인사팀', role: '조회 전용', status: 'active', lastSeen: '2026-10-08 14:05' },
  { id: 'u6', name: '한고래', email: 'whale@actoz.com', team: '보안팀', role: '운영자', status: 'inactive', lastSeen: '2026-08-31 11:20' },
  { id: 'u7', name: '윤펭귄', email: 'penguin@actoz.com', team: '팀아하', role: '조회 전용', status: 'active', lastSeen: '2026-10-07 10:41' },
  { id: 'u8', name: '오여우', email: 'fox@actoz.com', team: '법무팀', role: '조회 전용', status: 'active', lastSeen: '2026-10-06 16:02' },
];

// ── 관리 콘솔(IAM) 템플릿 예시 데이터: 사용자, 세션, OAuth 클라이언트, 역할 권한, 감사 로그 ──
/** 관리 콘솔 주 메뉴. */
export const consoleMenus: NavRailItem[] = [
  { id: 'overview', label: '개요', icon: <LayoutGrid />, href: '#overview' },
  { id: 'users', label: '사용자', icon: <UserRound />, href: '#users' },
  { id: 'groups', label: '그룹', icon: <Users />, href: '#groups' },
  { id: 'roles', label: '역할', icon: <ShieldCheck />, href: '#roles' },
  { id: 'clients', label: '클라이언트', icon: <AppWindow />, href: '#clients' },
  { id: 'audit', label: '감사 로그', icon: <FileClock />, href: '#audit' },
];

/** 스토리용 관리 콘솔 내비 레일. 표가 넓은 화면이라 좁은 레일을 쓴다. */
export function consoleRail(activeId = 'users') {
  return (
    <NavRail
      aria-label="주 메뉴"
      logo={
        <span className="flex items-center gap-2 text-title font-bold tracking-wide">
          <ShieldCheck aria-hidden className="size-7 text-primary" />
          <span className="sr-only">IAM</span>
        </span>
      }
      items={consoleMenus}
      bottomItems={[{ id: 'settings', label: '설정', icon: <Settings />, href: '#settings' }]}
      activeId={activeId}
      account={<AccountMenu name="박관리" team="보안플랫폼팀" email="admin@actoz.com" initials="관리" onLogout={() => {}} />}
    />
  );
}

export type IamUserStatus = 'active' | 'locked' | 'invited' | 'disabled';

export interface IamUser {
  id: string;
  name: string;
  email: string;
  team: string;
  role: '관리자' | '감사 담당' | '일반 사용자';
  status: IamUserStatus;
  mfa: boolean;
  lastLogin: string;
  createdAt: string;
}

/** 계정 상태 → 배지 라벨과 tone. 상태는 색만으로 전달하지 않고 라벨과 함께 쓴다. */
export const iamStatusBadge: Record<IamUserStatus, { label: string; tone: BadgeTone }> = {
  active: { label: '활성', tone: 'good' },
  locked: { label: '잠김', tone: 'serious' },
  invited: { label: '초대 대기', tone: 'warning' },
  disabled: { label: '비활성', tone: 'critical' },
};

export const iamUsers: IamUser[] = [
  { id: 'u1', name: '김하마', email: 'hama@actoz.com', team: '보안플랫폼팀', role: '관리자', status: 'active', mfa: true, lastLogin: '2026-10-10 09:12', createdAt: '2025-03-02' },
  { id: 'u2', name: '이수달', email: 'sudal@actoz.com', team: '플랫폼팀', role: '일반 사용자', status: 'active', mfa: true, lastLogin: '2026-10-10 08:47', createdAt: '2025-06-17' },
  { id: 'u3', name: '박해달', email: 'haedal@actoz.com', team: '플랫폼팀', role: '일반 사용자', status: 'locked', mfa: false, lastLogin: '2026-10-09 18:30', createdAt: '2025-09-01' },
  { id: 'u4', name: '최너구리', email: 'raccoon@actoz.com', team: '재무팀', role: '일반 사용자', status: 'invited', mfa: false, lastLogin: '—', createdAt: '2026-10-08' },
  { id: 'u5', name: '정다람', email: 'daram@actoz.com', team: '인사팀', role: '감사 담당', status: 'active', mfa: true, lastLogin: '2026-10-08 14:05', createdAt: '2025-01-20' },
  { id: 'u6', name: '한고래', email: 'whale@actoz.com', team: '보안팀', role: '일반 사용자', status: 'disabled', mfa: true, lastLogin: '2026-08-31 11:20', createdAt: '2024-11-11' },
  { id: 'u7', name: '윤펭귄', email: 'penguin@actoz.com', team: '사업개발팀', role: '일반 사용자', status: 'active', mfa: false, lastLogin: '2026-10-07 10:41', createdAt: '2026-02-03' },
  { id: 'u8', name: '오여우', email: 'fox@actoz.com', team: '법무팀', role: '감사 담당', status: 'active', mfa: true, lastLogin: '2026-10-06 16:02', createdAt: '2025-12-09' },
];

/** 사용자 상세의 로그인 세션 (관리자가 보는 화면이라 "이 기기"가 없다). */
export const userSessions: SessionItem[] = [
  { id: 's1', device: 'Windows · Chrome 141', deviceType: 'desktop', ip: '10.20.31.45', location: '서울 (사내망)', lastActive: '방금 전', signedInAt: '2026-10-10 08:40' },
  { id: 's2', device: 'iPhone · Safari', deviceType: 'mobile', ip: '211.36.141.7', location: '서울', lastActive: '2시간 전', signedInAt: '2026-10-09 21:13' },
  { id: 's3', device: 'macOS · Claude Desktop', deviceType: 'desktop', ip: '10.20.31.45', location: '서울 (사내망)', lastActive: '어제', signedInAt: '2026-10-02 10:05', client: 'Claude Desktop' },
];

/** OAuth 클라이언트 예시. */
export const oauthClient = {
  name: 'MCP Gateway',
  clientId: 'mcp-gateway-7f3a9c2e',
  secret: 'iam_sk_live_9fK2xQ7mVb4LpR8tZ1wN6cHs3dYeA0uJ',
  newSecret: 'iam_sk_live_4Hq8nT2zWc6Rv0xL9pB3mKs7dFeY1aJu',
  type: '기밀 클라이언트',
  owner: '김하마 (보안플랫폼팀)',
  createdAt: '2026-09-22',
  secretCreatedAt: '2026-09-22',
  redirectUris: ['https://gateway.actoz.com/oauth/callback', 'http://127.0.0.1:33418/callback'],
};

/** 클라이언트에 허용한 scope. 관리 콘솔에서는 scope 값을 함께 보여준다. */
export const clientScopes: ScopeItem[] = [
  { scope: 'openid', label: '사용자 신원 확인', required: true },
  { scope: 'profile', label: '이름과 소속 보기' },
  { scope: 'work.my.read', label: '내 업무 목록 보기', description: '업무요청게시판에서 로그인한 사람이 담당한 업무만 읽습니다.' },
];

/** 역할 권한 표의 리소스와 동작. 감사 로그는 쓰기 동작이 없다. */
export const permissionResources: PermissionResource[] = [
  { key: 'users', label: '사용자', description: '계정, 상태, 2단계 인증' },
  { key: 'groups', label: '그룹' },
  { key: 'roles', label: '역할', description: '역할과 권한' },
  { key: 'clients', label: '클라이언트', description: 'OAuth 클라이언트와 비밀값' },
  { key: 'audit', label: '감사 로그', unavailable: ['create', 'update', 'delete'] },
];

export const permissionActions: PermissionAction[] = [
  { key: 'read', label: '보기' },
  { key: 'create', label: '만들기' },
  { key: 'update', label: '수정' },
  { key: 'delete', label: '삭제' },
];

/** 감사 담당 역할의 기본 권한. */
export const auditorPermissions: Record<string, string[]> = {
  users: ['read'],
  groups: ['read'],
  roles: ['read'],
  clients: ['read'],
  audit: ['read'],
};

export type AuditResult = 'success' | 'failure';

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  actorEmail: string;
  event: string;
  summary: string;
  result: AuditResult;
  ip: string;
}

export const auditResultBadge: Record<AuditResult, { label: string; tone: BadgeTone }> = {
  success: { label: '성공', tone: 'good' },
  failure: { label: '실패', tone: 'critical' },
};

export const auditEvents: AuditEvent[] = [
  { id: 'a1', at: '2026-10-10 09:12:04', actor: '김하마', actorEmail: 'hama@actoz.com', event: 'login.succeeded', summary: '비밀번호 + 인증 앱', result: 'success', ip: '10.20.31.45' },
  { id: 'a2', at: '2026-10-10 09:05:51', actor: '박해달', actorEmail: 'haedal@actoz.com', event: 'login.failed', summary: '비밀번호 불일치 (5회째, 계정 잠김)', result: 'failure', ip: '211.36.141.7' },
  { id: 'a3', at: '2026-10-10 08:58:13', actor: '김하마', actorEmail: 'hama@actoz.com', event: 'client.secret.rotated', summary: 'MCP Gateway 비밀값 재발급', result: 'success', ip: '10.20.31.45' },
  { id: 'a4', at: '2026-10-10 08:47:30', actor: '이수달', actorEmail: 'sudal@actoz.com', event: 'mfa.enrolled', summary: '인증 앱 등록', result: 'success', ip: '10.20.31.52' },
  { id: 'a5', at: '2026-10-09 18:30:02', actor: '박해달', actorEmail: 'haedal@actoz.com', event: 'login.failed', summary: '비밀번호 불일치 (4회째)', result: 'failure', ip: '211.36.141.7' },
  { id: 'a6', at: '2026-10-09 17:02:44', actor: '정다람', actorEmail: 'daram@actoz.com', event: 'role.updated', summary: '감사 담당 역할에 클라이언트 보기 권한 추가', result: 'success', ip: '10.20.31.77' },
  { id: 'a7', at: '2026-10-09 15:20:18', actor: '오여우', actorEmail: 'fox@actoz.com', event: 'login.succeeded', summary: '비밀번호 + 인증 앱', result: 'success', ip: '10.20.31.88' },
];
