// 스토리 전용 예시 데이터. 관리자 화면 템플릿이 함께 쓰는 내비게이션과 사용자 목록.
import { ChartColumn, FileText, LayoutGrid, Settings, ShieldCheck, Users } from 'lucide-react';

import { AccountMenu, NavRail, type NavRailItem, ServiceSidebar, SidebarNavItem, SidebarSection } from '@aha/ui';

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
