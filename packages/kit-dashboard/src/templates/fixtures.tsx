// 스토리 전용 예시 데이터. 대시보드 템플릿의 내비게이션과 30일치 사용량.
import { ChartColumn, Coins, LayoutGrid, Settings, Users } from 'lucide-react';

import { AccountMenu, NavRail, type NavRailItem } from '@aha/ui';

export const dashboardMenus: NavRailItem[] = [
  { id: 'overview', label: '사용 현황', icon: <LayoutGrid />, href: '#overview' },
  { id: 'services', label: '서비스별', icon: <ChartColumn />, href: '#services' },
  { id: 'users', label: '사용자', icon: <Users />, href: '#users' },
  { id: 'cost', label: '비용', icon: <Coins />, href: '#cost' },
];

/** 스토리용 대시보드 내비 레일. */
export function dashboardRail(activeId = 'overview') {
  return (
    <NavRail
      items={dashboardMenus}
      bottomItems={[{ id: 'settings', label: '설정', icon: <Settings />, href: '#settings' }]}
      activeId={activeId}
      account={<AccountMenu name="이분석" team="데이터팀" email="data@actoz.com" initials="분석" onLogout={() => {}} />}
    />
  );
}

export const services = [
  { key: 'guide', label: '사내 가이드 챗' },
  { key: 'minutes', label: '회의록 생성' },
  { key: 'review', label: '문서 검토' },
];

/** 2026-09-11 ~ 2026-10-10 (30일). 주말에 줄어드는 예시 값. 날짜 순서. */
export const daily = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 8, 11 + i));
  const iso = date.toISOString().slice(0, 10);
  const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
  const wave = (base: number, phase: number) => Math.round(base * (weekend ? 0.25 : 1) * (1 + 0.18 * Math.sin(i * 0.7 + phase)));
  return {
    date: iso,
    label: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
    users: wave(250, 0.3),
    values: { guide: wave(360, 0), minutes: wave(95, 1), review: wave(50, 2) },
    failures: weekend ? 0 : (i * 7) % 4,
  };
});

export const teams = [
  { label: '팀아하', share: 0.31 },
  { label: '플랫폼팀', share: 0.22 },
  { label: '재무팀', share: 0.14 },
  { label: '인사팀', share: 0.11 },
  { label: '법무팀', share: 0.08 },
];

export const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
export const hours = Array.from({ length: 24 }, (_, h) => `${h}시`);

/** 요일 × 시간대 요청 수 (요청 총량에 비례하도록 scale을 곱한다). */
export function hourly(scale: number) {
  return weekdays.map((_, d) =>
    hours.map((_, h) => {
      if (d >= 5) return h >= 10 && h <= 17 ? Math.round((2 + ((h * 3) % 5)) * scale) : 0;
      if (h < 8 || h > 19) return h === 7 || h === 20 ? Math.round(3 * scale) : 0;
      return Math.round((h === 12 ? 18 : 30 + ((h * 7 + d * 5) % 25)) * scale);
    }),
  );
}
