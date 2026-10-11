// 갤러리·MCP 서버의 브랜드별 설정. 화면 문구, 이름, 주소를 여기에만 둔다.
// 한 코드로 브랜드마다 사이트를 하나씩 띄운다 (AHA·IAM 통합 4단계). 환경변수 SITE(aha | iam)로 고르고, 없으면 aha.
//   갤러리 빌드: SITE=iam pnpm --filter @actoz/gallery build   서버: SITE=iam node server/index.ts
// 사이트마다 자기 브랜드(<html data-brand>)로 미리보기를 그리고, kits에 적은 키트와 자기 브랜드의 템플릿만 보여준다.
// 갤러리 화면(src)과 MCP 서버(server), 카탈로그 빌드(scripts)가 함께 읽으므로 Node가 바로 실행할 수 있는 문법(타입 표기만)으로 쓴다.

/** 머리글·파비콘 로고. 이모지 한 글자, 또는 24×24 아이콘의 SVG 내용(path 등, stroke는 currentColor). */
export type SiteLogo = { emoji: string } | { svg: string };

export interface SiteConfig {
  /** 짧은 영문 id. 환경변수 SITE 값이고, 브라우저 저장소 키 접두사에 쓴다. */
  id: string;
  /**
   * 브랜드. 미리보기와 갤러리 화면에 `<html data-brand>`로 건다 (aha는 기본값이라 속성을 달지 않는다).
   * 스토리에 `parameters.brand`가 있으면 그 브랜드로 그린다. 템플릿은 catalog.config.json의 `brand`(없으면 aha)가 같은 것만 보여준다.
   */
  brand: 'aha' | 'iam';
  /** 공통(core) 말고 이 사이트에 보여줄 키트 id. 키트 메뉴, 컴포넌트·템플릿 목록, MCP가 이 키트만 다룬다. */
  kits: string[];
  /** 디자인 시스템 이름. 예: "AHA". 문장 속에 들어간다 ("AHA 디자인 시스템"). */
  name: string;
  /** 사이트 제목. 머리글과 브라우저 탭. */
  title: string;
  /** 바닥글과 MCP 안내문 첫 줄. */
  fullName: string;
  /** 검색 결과·링크 미리보기 설명. */
  description: string;
  logo: SiteLogo;
  /** SVG 로고를 파비콘으로 쓸 때의 선 색 (hex). 파비콘은 페이지 CSS 변수를 못 쓴다. 이모지 로고면 쓰지 않는다. */
  faviconColor: string;
  /** npm 범위. 예: "@actoz". */
  scope: string;
  /** MCP 서버 이름. 에이전트 설정에 이 이름으로 등록한다. */
  mcpName: string;
  /** 패키지 레지스트리 기본값. 환경변수 NPM_REGISTRY(서버), VITE_NPM_REGISTRY(갤러리 빌드)가 우선한다. */
  registry: string;
  /** 바닥글의 저장소 링크. */
  repoUrl: string;
  /** 운영 서버 포트 기본값 (환경변수 PORT가 우선). */
  port: number;
  /** 갤러리 개발 서버 포트. */
  devPort: number;
  /** 홈 첫 화면 소개 문장. */
  homeIntro: string;
  /** 홈 "디자인 기초" 카드의 한 줄. */
  foundationsSummary: string;
  /** 서체 이름. 디자인 기초·시작하기·MCP 설치 안내에 쓴다. */
  fontName: string;
  /** 디자인 기초 "행동" 색 묶음 설명 (primary를 어떻게 쓰는지). */
  primaryDescription: string;
  /** 디자인 기초 글자 크기 예시 문장. */
  typeSample: string;
  /** 키트 페이지 소개 문단의 두 번째 문장 (화면 종류별로 어느 키트를 고르는지). */
  kitsIntro: string;
  /** 컴포넌트 목록 페이지 소개. */
  componentsIntro: string;
  /** 홈에 보여줄 대표 컴포넌트 (slug, 스토리 export 이름). 키트를 고르지 않았을 때. */
  featuredComponents: { slug: string; story?: string }[];
  /** 홈에 보여줄 대표 템플릿 slug. 키트를 고르지 않았을 때. */
  featuredTemplates: string[];
  /** 시작하기의 "이렇게 바로 말해도 됩니다" 예시 프롬프트. */
  examplePrompts: string[];
  /** 시작하기 "사용" 단계의 예제 코드. */
  usageExample: string;
  /** MCP 설치 안내의 상태 표시 예 (마크다운). */
  statusExample: string;
  /** MCP 설치 안내의 밀도 항목 (한 문단). */
  densityGuide: string;
  /** MCP 설치 안내 끝에 붙는 이 디자인 시스템만의 규칙 (제목 + 항목). 없으면 빈 배열. */
  extraRules: { title: string; items: string[] }[];
}

const aha: SiteConfig = {
  id: 'aha',
  brand: 'aha',
  kits: ['admin', 'ai', 'dashboard'],
  name: 'AHA',
  title: 'AHA 디자인',
  fullName: 'AHA 사내 디자인 시스템',
  description: 'AHA 사내 디자인 시스템. 컴포넌트와 화면을 보고, 에이전트로 바로 가져다 씁니다.',
  logo: { emoji: '💡' },
  faviconColor: '#111110',
  scope: '@actoz',
  mcpName: 'aha-design',
  registry: 'http://localhost:3000/api/packages/actoz/npm/',
  repoUrl: 'http://localhost:3000/jay/aha-design',
  port: 4100,
  devPort: 5180,
  homeIntro:
    'AHA의 사내 시스템은 같은 버튼, 같은 입력창, 같은 색을 씁니다. 마음에 드는 화면을 고르면 에이전트가 똑같은 디자인으로 만들어 줍니다.',
  foundationsSummary: 'Pretendard 서체, 검정 기본색, 접근성 대비 4.5:1 이상. 다크 모드는 자동으로 따라옵니다.',
  fontName: 'Pretendard',
  primaryDescription: '주요 버튼은 검정(다크 모드에서는 흰색) 하나만 씁니다. 따로 브랜드 강조색을 두지 않습니다.',
  typeSample: '사내 가이드에서 찾아드려요',
  kitsIntro: '관리자 화면이면 관리자 키트, AI 대화 화면이면 AI 서비스 키트, 지표 화면이면 대시보드 키트입니다.',
  componentsIntro: 'AHA 사내 시스템 화면을 이루는 부품입니다. 카드를 누르면 쓰임새, 변형별 예제, 에이전트용 프롬프트를 볼 수 있습니다.',
  featuredComponents: [
    { slug: 'badge', story: 'StatusTones' },
    { slug: 'composer' },
    { slug: 'stat-card' },
    { slug: 'result-card' },
  ],
  featuredTemplates: ['guide-chat', 'service-usage', 'user-management'],
  examplePrompts: [
    '사내 가이드 챗 템플릿을 바탕으로 "법무 상담 챗" 화면을 만들어 줘. 예시 질문은 계약서 검토 관련으로 바꿔 줘.',
    '관리자 대시보드 템플릿으로 우리 팀 서비스의 월별 사용량 화면을 만들어 줘. 통계 카드는 요청 수, 사용자 수, 실패율 세 개.',
    'DataTable과 Pagination으로 신청 내역 목록을 만들고, 상태 열은 Badge tone으로 표시해 줘.',
  ],
  usageExample: `import { Badge, Button } from '@actoz/ui';

export function Example() {
  return (
    <div className="flex items-center gap-2 p-6">
      <Button>보고서 조회</Button>
      <Badge tone="warning">일부 품질 저하</Badge>
    </div>
  );
}`,
  statusExample: '`<Badge tone="warning">일부 품질 저하</Badge>`, StatCard `delta.tone`',
  densityGuide:
    '관리자 화면처럼 한 화면에 많은 행과 입력을 보여야 하면 `<html data-density="compact">`로 촘촘한 밀도를 켠다. 간격만 줄고 글자 크기와 색은 그대로다. 관리자 키트(@actoz/kit-admin) 템플릿은 이 밀도 기준이다. 컴포넌트에 간격을 따로 줄이는 클래스를 넣지 않는다.',
  extraRules: [],
};

const iam: SiteConfig = {
  id: 'iam',
  brand: 'iam',
  kits: ['admin', 'auth'],
  name: 'IAM',
  title: 'IAM 디자인',
  fullName: 'IAM 디자인 시스템',
  description: 'IAM(사내 통합 인증) 디자인 시스템. 로그인, 2단계 인증, 동의, 관리 콘솔 화면을 보고 에이전트로 바로 가져다 씁니다.',
  // lucide ShieldCheck
  logo: {
    svg: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  },
  // color.brand.600
  faviconColor: '#2458db',
  // 패키지는 AHA와 같다 (공통 부품과 키트를 함께 쓴다).
  scope: '@actoz',
  mcpName: 'iam-design',
  registry: 'http://localhost:3000/api/packages/actoz/npm/',
  repoUrl: 'http://localhost:3000/jay/aha-design',
  port: 4200,
  devPort: 5280,
  homeIntro:
    '로그인, 2단계 인증, 앱 동의, 관리 콘솔이 모두 같은 버튼, 같은 입력창, 같은 색을 씁니다. 화면을 고르면 에이전트가 똑같은 디자인으로 만들어 줍니다.',
  foundationsSummary: 'Pretendard 서체, IAM 파랑 기본색, 접근성 대비 4.5:1 이상. 다크 모드는 자동으로 따라옵니다.',
  fontName: 'Pretendard',
  primaryDescription: '주요 버튼과 링크는 IAM 파랑(다크 모드에서는 밝은 파랑)을 씁니다. 화면마다 주요 버튼은 하나만 둡니다.',
  typeSample: '회사 계정으로 로그인하세요',
  kitsIntro: '로그인·2단계 인증·동의 같은 인증 화면이면 인증 키트, 사용자·그룹·역할·클라이언트를 다루는 관리 화면이면 관리자 키트를 얹습니다.',
  componentsIntro: 'IAM 화면을 이루는 부품입니다. 카드를 누르면 쓰임새, 변형별 예제, 에이전트용 프롬프트를 볼 수 있습니다.',
  featuredComponents: [
    { slug: 'form-field', story: 'WithError' },
    { slug: 'otp-input', story: 'Partial' },
    { slug: 'scope-list' },
    { slug: 'badge', story: 'StatusTones' },
  ],
  featuredTemplates: ['login', 'console-user-management', 'consent'],
  examplePrompts: [
    '로그인 템플릿을 바탕으로 "비밀번호 재설정" 화면을 만들어 줘. 이메일을 받고, 보낸 뒤에는 안내 문구를 보여 줘.',
    '관리 콘솔 사용자 관리 템플릿으로 OAuth 클라이언트 목록 화면을 만들어 줘. 열은 앱 이름, 클라이언트 id, 유형(기밀/공개), 허용 scope, 만든 날.',
    'ScopeList와 Button으로 계정 설정의 "연결된 앱" 화면을 만들고, 앱마다 접근 취소 버튼을 둬 줘.',
  ],
  usageExample: `import { Button, FormField, Input } from '@actoz/ui';
import { AuthLayout } from '@actoz/kit-auth';

// <html data-brand="iam">이 있어야 IAM 파랑으로 보인다.
export function LoginPage() {
  return (
    <AuthLayout title="로그인" description="회사 계정으로 로그인하세요.">
      <form className="flex flex-col gap-5">
        <FormField label="이메일">
          <Input type="email" autoComplete="username" />
        </FormField>
        <FormField label="비밀번호">
          <Input type="password" autoComplete="current-password" />
        </FormField>
        <Button type="submit" size="lg" className="w-full">로그인</Button>
      </form>
    </AuthLayout>
  );
}`,
  statusExample: '`<Badge tone="critical">잠김</Badge>`',
  densityGuide:
    '관리 콘솔(사용자·그룹·역할·클라이언트·감사 로그)은 `<html data-density="compact">`로 촘촘한 밀도를 켠다. 관리자 키트(@actoz/kit-admin)의 관리 콘솔 템플릿은 이 밀도 기준이다. 로그인·2단계 인증·동의 같은 인증 화면은 기본 밀도로 둔다. 간격만 줄고 글자 크기와 색은 그대로다. 컴포넌트에 간격을 따로 줄이는 클래스를 넣지 않는다.',
  extraRules: [
    {
      title: 'IAM 브랜드',
      items: [
        '모든 IAM 화면의 `<html>`에 `data-brand="iam"`을 단다. 없으면 AHA 색(검정 primary)으로 보인다. 다크(`data-theme`)·밀도(`data-density`) 속성과 함께 쓸 수 있다.',
        '부품은 AHA와 같은 패키지(`@actoz/ui`, `@actoz/kit-admin`, `@actoz/kit-auth`)를 쓴다. 브랜드마다 다른 것은 prop으로 넘긴다: AuthLayout `logo`, NavRail `logo`·`aria-label="주 메뉴"`, AccountMenu `adminLabel="관리 콘솔"`.',
      ],
    },
    {
      title: '인증 화면 규칙',
      items: [
        '로그인·2단계 인증·비밀번호 재설정·동의 화면은 `AuthLayout` 하나에 폼 하나를 둔다. 주요 버튼(`variant="primary"`)은 화면당 하나다.',
        '입력은 항상 `FormField`로 감싼다 (라벨, 안내 문구 `description`·오류 문구 `error`, `aria-describedby`). placeholder로 라벨을 대신하지 않는다.',
        '`autoComplete`: 이메일은 `username`, 현재 비밀번호는 `current-password`, 새 비밀번호는 `new-password`. 인증 코드는 `OtpInput`.',
        '로그인 실패는 어느 칸이 틀렸는지 밝히지 않고 "이메일 또는 비밀번호가 맞지 않습니다."처럼 한 문구로 쓴다. 계정이 있는지 드러내지 않는다. 잠금 정책(횟수·시간)은 알려 준다.',
        'OAuth 동의 화면은 앱 이름, 로그인한 계정, `ScopeList`, 거부(secondary) + 허용(primary)을 둔다. scope 값이 아니라 사람이 읽는 권한 이름을 보여준다.',
      ],
    },
  ],
};

const sites: Record<string, SiteConfig> = { aha, iam };

// 서버·카탈로그 빌드(Node)는 SITE, 갤러리 번들은 vite.config.ts가 넣는 VITE_SITE를 읽는다.
const siteId =
  (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.SITE ??
  import.meta.env?.VITE_SITE ??
  'aha';
if (!sites[siteId]) throw new Error(`SITE="${siteId}": site.config.ts에 없는 사이트입니다 (${Object.keys(sites).join(', ')})`);

export const site: SiteConfig = sites[siteId];
