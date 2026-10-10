// 스토리 전용 예시 데이터. 와이어프레임 v0.2.0의 서비스 구성을 따른다.
import { ChartColumn, FileSearch, History, Mail, MessageSquareText, Mic, ReceiptText, Wallet } from 'lucide-react';

import { AccountMenu } from '../components/account-menu/account-menu';
import { NavRail, type NavRailItem } from '../components/nav-rail/nav-rail';

export const ahaServices: NavRailItem[] = [
  { id: 'guide-chat', label: '사내 가이드 챗', icon: <MessageSquareText />, href: '#guide-chat' },
  { id: 'meeting-minutes', label: '회의록 생성', icon: <Mic />, href: '#meeting-minutes' },
  { id: 'document-review', label: '문서 검토', icon: <FileSearch />, href: '#document-review' },
  { id: 'newsletter', label: '뉴스레터 구독', icon: <Mail />, href: '#newsletter' },
  { id: 'ith', label: 'ITH', icon: <ChartColumn />, href: '#ith' },
  { id: 'ip-royalty', label: 'IP 로열티 정산', icon: <ReceiptText />, href: '#ip-royalty' },
  { id: 'daily-cash', label: '자금 일보', icon: <Wallet />, href: '#daily-cash' },
];

export const ahaBottomItems: NavRailItem[] = [{ id: 'history', label: '전체 기록', icon: <History />, href: '#history' }];

export const ahaUser = {
  name: '김하마',
  team: '팀아하',
  email: 'hama@actoz.com',
  initials: '하마',
};

/** 스토리용 내비 레일. 템플릿마다 같은 레일과 계정 메뉴를 쓴다. */
export function ahaRail(activeId?: string, expanded = false) {
  return (
    <NavRail
      items={ahaServices}
      bottomItems={ahaBottomItems}
      activeId={activeId}
      expanded={expanded}
      account={<AccountMenu {...ahaUser} expanded={expanded} onAdminSettings={() => {}} onLogout={() => {}} />}
    />
  );
}
