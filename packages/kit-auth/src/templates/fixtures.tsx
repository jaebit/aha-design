// 스토리 전용 예시 데이터. 인증 화면 템플릿(로그인, 2단계 인증, 동의)이 함께 쓰는 IAM 로고와 권한 목록.
import { ShieldCheck } from 'lucide-react';

import type { ScopeItem } from '@actoz/ui';

/** IAM 로고. AuthLayout의 기본 로고는 AHA라서 IAM 화면은 이 로고를 넘긴다. */
export const iamLogo = (
  <>
    <ShieldCheck aria-hidden className="size-7 text-primary" />
    IAM
  </>
);

/** 동의 화면 예시: 앱이 요청한 권한. 필수 권한을 먼저 둔다. */
export const requestedScopes: ScopeItem[] = [
  { scope: 'openid', label: '내 신원 확인', description: '로그인한 사람이 누구인지 확인합니다.', required: true },
  { scope: 'profile', label: '이름과 소속 보기', description: '이름, 부서, 직급을 읽습니다.' },
  { scope: 'work.my.read', label: '내 업무 목록 보기', description: '업무요청게시판에서 내가 담당한 업무만 읽습니다.' },
];
