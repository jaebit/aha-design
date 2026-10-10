// 갤러리·MCP 서버의 디자인 시스템별 설정. 화면 문구, 이름, 주소를 여기에만 둔다.
// 다른 디자인 시스템(예: iam-design)은 이 갤러리 코드를 그대로 가져가 이 파일만 바꾼다.
// 그 밖에 저장소마다 다른 것: 컴포넌트 import 범위(@aha/ui), src/styles.css의 키트 CSS, package.json, Dockerfile·compose.yaml.
// 갤러리 화면(src)과 MCP 서버(server)가 함께 읽으므로 Node가 바로 실행할 수 있는 문법(타입 표기만)으로 쓴다.

/** 머리글·파비콘 로고. 이모지 한 글자, 또는 24×24 아이콘의 SVG 내용(path 등, stroke는 currentColor). */
export type SiteLogo = { emoji: string } | { svg: string };

export interface SiteConfig {
  /** 짧은 영문 id. 브라우저 저장소 키 접두사에 쓴다. */
  id: string;
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
  /** npm 범위. 예: "@aha". */
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

export const site: SiteConfig = {
  id: 'aha',
  name: 'AHA',
  title: 'AHA 디자인',
  fullName: 'AHA 사내 디자인 시스템',
  description: 'AHA 사내 디자인 시스템. 컴포넌트와 화면을 보고, 에이전트로 바로 가져다 씁니다.',
  logo: { emoji: '💡' },
  faviconColor: '#111110',
  scope: '@aha',
  mcpName: 'aha-design',
  registry: 'http://localhost:3000/api/packages/aha/npm/',
  repoUrl: 'http://localhost:3000/jay/design-hub',
  port: 4100,
  devPort: 5180,
  homeIntro:
    'AHA의 사내 시스템은 같은 버튼, 같은 입력창, 같은 색을 씁니다. 마음에 드는 화면을 고르면 에이전트가 똑같은 디자인으로 만들어 줍니다.',
  foundationsSummary: 'Pretendard 서체, 검정 기본색, 접근성 대비 4.5:1 이상. 다크 모드는 자동으로 따라옵니다.',
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
  usageExample: `import { Badge, Button } from '@aha/ui';

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
    '관리자 화면처럼 한 화면에 많은 행과 입력을 보여야 하면 `<html data-density="compact">`로 촘촘한 밀도를 켠다. 간격만 줄고 글자 크기와 색은 그대로다. 관리자 키트(@aha/kit-admin) 템플릿은 이 밀도 기준이다. 컴포넌트에 간격을 따로 줄이는 클래스를 넣지 않는다.',
  extraRules: [],
};
