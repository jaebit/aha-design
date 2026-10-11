# AGENTS.md

AHA 사내 디자인 시스템 모노레포. 사람은 갤러리 사이트(`apps/gallery`)를 보고, 에이전트는 같은 정보를 aha-design MCP로 조회한다. 디자인 시스템을 개발할 때는 Storybook과 Storybook MCP를 쓴다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `packages/tokens` | W3C DTCG 2025.10 토큰(`tokens/**/*.json`) → Style Dictionary 빌드 → `dist/tokens.css`, `dist/tokens.js`, `dist/tokens.manifest.json`. CSS 변수 접두사와 테마 설정 키는 통합 디자인 시스템 이름 `actoz`를 쓴다 (`--actoz-color-primary`, `actoz.theme`) |
| `packages/tokens/src/tailwind.css` | 토큰 → Tailwind v4 `@theme` 매핑. 색상 이름은 shadcn/ui 규약을 따른다 |
| `packages/ui` | 공통 React 컴포넌트(`@aha/ui`) + Storybook 10 (`@storybook/addon-mcp`). Storybook은 여기 하나만 두고 키트 스토리까지 함께 싣는다. `pnpm build`로 배포용 `dist/`를 만든다 (`vite.lib.config.ts` + `tsconfig.build.json`) |
| `packages/kit-*` | 도메인 키트 패키지. `kit-ai`(`@aha/kit-ai`): AI 대화 부품과 화면 템플릿. `kit-admin`(`@aha/kit-admin`): 관리 화면의 폼·상세·일괄 작업·권한·세션·비밀값 부품과 템플릿. AHA 관리자와 IAM 관리 콘솔(`Templates/Console…`, `parameters.brand: 'iam'`) 템플릿을 함께 둔다. `kit-auth`(`@aha/kit-auth`): 로그인·2단계 인증·OAuth 동의 화면의 틀(AuthLayout)과 인증 코드 입력(OtpInput), 인증 화면 템플릿. 동의 화면의 ScopeList는 관리 화면도 쓰므로 core에 있다. `kit-dashboard`(`@aha/kit-dashboard`): 선·도넛·히트맵 차트, 기간 선택, 위젯 그리드와 대시보드 템플릿. 키트 차트도 공통 차트 규칙(chart-1부터, 범례, 표로 보기)을 따른다. 빌드 방식은 `packages/ui`와 같고, `@aha/ui`를 peer 의존성으로 둔다 |
| `packages/*/catalog.config.json` | 갤러리·MCP 카탈로그 메타데이터: 키트 목록, 분류(Storybook 제목 첫 단계 → 갤러리 분류), 템플릿 이름·설명 |
| `apps/gallery` | 갤러리 사이트(Vite + React, `@aha/ui`로 만든다) + MCP 서버(`server/`). 상단 키트 메뉴로 목록을 "공통 + 고른 키트"로 좁히고, `/kits/<id>`에 키트 소개가 있다. MCP의 `list_kits`와 `kit` 인자도 같은 카탈로그의 키트 정보를 쓴다. Storybook manifest와 토큰 manifest를 `generated/catalog.json`으로 모아 둘 다 이 파일을 읽는다. 브랜드마다 사이트를 하나씩 띄운다: AHA(4100, aha-design MCP)와 IAM(4200, iam-design MCP). 사이트별 이름·로고·브랜드·보여줄 키트·npm 범위·MCP 이름·레지스트리·포트·화면 문구는 `apps/gallery/site.config.ts` 한 곳에 두고, 환경변수 `SITE`(aha | iam)로 고른다. 카탈로그는 사이트의 키트와 같은 브랜드의 템플릿(catalog.config.json `templates[].brand`, 없으면 aha)만 담고 토큰 값도 사이트 브랜드 값으로 쓴다. 미리보기는 스토리의 `parameters.brand`, 없으면 사이트 브랜드로 그린다. 갤러리·MCP 코드에 브랜드 문구를 직접 쓰지 않는다 |
| `ci/jenkins/` | 로컬 Jenkins 파이프라인 원본(`Jenkinsfile.ci` main 검사, `Jenkinsfile.pr` PR 검사(D-016, 격리 Agent 준비 뒤 켬), `Jenkinsfile.release` 수동 배포). job에는 인라인으로 들어가므로 바꾸면 forgejo-platform의 `setup-design-hub.py --update-jobs`로 반영한다 |
| `Dockerfile`, `compose.yaml` | 두 사이트의 갤러리 + MCP + Storybook 정적 빌드를 한 이미지로 만들고, compose가 `SITE=aha`(4100)와 `SITE=iam`(4200) 두 서비스로 띄운다 |
| `scripts/check-tokens.mjs` | 하드코딩 색상 검사 |
| `docs/` | 와이어프레임 원본 (aha.actoz.com v0.2.0) |

## 명령

pnpm은 corepack으로 실행한다 (`packageManager`: pnpm 10).

- `pnpm install`
- `pnpm dev` — 토큰을 빌드하고 Storybook을 http://localhost:6006 에 띄운다. MCP 엔드포인트는 http://localhost:6006/mcp
- `pnpm typecheck`
- `pnpm check:tokens` — 컴포넌트에 하드코딩된 색상이 없는지 검사
- `pnpm check:mcp-docs` — Storybook을 띄운 상태에서, MCP가 내보내는 예제 코드의 import와 설명을 검사
- `pnpm check:contrast` — 토큰을 빌드하고 라이트·다크의 글자/배경 대비(4.5:1)를 검사. 토큰 값을 바꾸면 반드시 돌린다
- `pnpm build-storybook` — Storybook 정적 빌드 (갤러리 카탈로그의 원본)
- `pnpm gallery` — Storybook 정적 빌드 후 AHA 갤러리 개발 서버 http://localhost:5180. IAM 갤러리는 `pnpm gallery:iam` (http://localhost:5280)
- `pnpm docker:up` — 갤러리 + MCP를 Docker로 띄운다. AHA http://localhost:4100, IAM http://localhost:4200. MCP는 각각 `/mcp`
- `pnpm version-packages` / `pnpm release` — Changesets로 버전을 올리고, 레지스트리(`aha` 조직)에 없는 버전만 배포한다. `packages/*`를 바꾸는 PR에는 `.changeset/<이름>.md` 변경 기록을 넣는다 (형식과 흐름은 `.changeset/README.md`). `package.json`의 `version`을 손으로 올리지 않는다. `@aha/ui`가 minor로 오르면 키트는 Changesets가 patch로 올려 peer 범위를 맞춘다

## 테마와 기본 결정 (2026-10-09 확정)

- **브랜드:** 검정 primary를 유지하고 별도 브랜드 강조색은 두지 않는다. 브랜드는 로고(💡)로만 드러낸다.
- **서체:** Pretendard. `@aha/ui/styles.css`가 `pretendard` 패키지의 dynamic subset 웹폰트를 불러온다. 외부 CDN을 쓰지 않는다.
- **다크 모드:** 시스템 설정을 따르고, `<html data-theme="light|dark">`로 고정할 수 있다. 다크 값은 `packages/tokens/tokens/themes/dark.json`에 있으며 시맨틱 토큰만 덮어쓴다. 컴포넌트에서 테마별 분기를 쓰지 않는다 (시맨틱 토큰이 알아서 바뀐다).
- **브랜드 테마:** IAM 통합 준비로 `<html data-brand="iam">` 브랜드 테마가 있다 (`tokens/themes/brand-iam.json`, 다크 조합은 `brand-iam-dark.json`). `primary`, `primary-hover`, `ring`만 IAM 파랑(원시 `color.brand.*`)으로 바꾼다. 컴포넌트에서 브랜드별 분기(`data-brand` 선택자 포함)를 쓰지 않는다. 브랜드마다 다른 문구·로고는 기본값을 AHA로 둔 prop으로 받는다 (예: AccountMenu `adminLabel`, NavRail `logo`·`aria-label`). Storybook 툴바의 브랜드 전환으로 모든 스토리를 두 브랜드로 볼 수 있고, 스토리의 기본 브랜드는 `parameters.brand`에 적는다.
- **테마 추가:** `tokens/themes/<이름>.json`을 만들고 `$extensions["actoz.theme"]`에 적용 조건(`attribute`, `value`, 선택: `colorScheme`, `media`, `mediaUnless`, `label`, `with`)을 적는다. 두 테마가 같은 토큰을 덮어써서 조합마다 값이 달라야 하면 조합 테마를 따로 만들고 `with`에 함께 쓰는 테마 이름을 적는다 (예: `brand-iam-dark`는 `"with": "dark"`). 빌드가 파일을 자동으로 찾아 CSS 블록과 manifest의 `<이름>` 값을 만들고, `check:contrast`도 색을 바꾸는 모든 테마를 검사한다. 다른 축의 테마는 다른 attribute를 쓴다 (예: 밀도는 `data-density`).
- **밀도:** 기본 밀도와 촘촘한 밀도(`<html data-density="compact">`, `tokens/themes/compact.json`) 두 가지. 테마 속성은 `<html>`이 아닌 요소에 달아도 그 안쪽에만 적용된다 (갤러리 미리보기가 쓴다). 키트의 기본 밀도는 `catalog.config.json`의 `kits[].density`, 스토리의 기본 밀도는 `parameters.density`에 적는다. 간격 단위 토큰 `space.unit`(Tailwind `--spacing`)만 4px → 3.5px로 줄여 모든 간격·크기 클래스가 함께 줄어든다. 글자 크기와 색은 그대로다. 관리자 화면은 compact로 쓴다. 컴포넌트에 밀도별 분기나 작은 크기 클래스를 따로 넣지 않는다.
- **키트:** 공통 부품(core) 위에 도메인 키트(AI 서비스, 관리자, CMS 등)를 얹는다. 키트는 core만 참조하고 키트끼리는 참조하지 않는다. 두 키트 이상에서 쓰는 부품만 core에 둔다. 확장 계획은 「AHA 디자인 시스템 다중 디자인 확장 검토」 문서를 따른다.
- **상태색:** `status-good|warning|serious|critical`은 아이콘·마크용, `status-*-foreground`는 글자용이다. 상태는 색만으로 전달하지 않고 아이콘 + 라벨과 함께 쓴다 (`<Badge tone="warning">일부 품질 저하</Badge>`). 라이트 모드의 warning·serious 아이콘은 배경 대비가 3:1 미만이므로, 라벨 글자가 반드시 상태를 말해야 한다.

## UI 작업 규칙

1. **먼저 조회한다.** 컴포넌트를 쓰거나 만들기 전에 Storybook MCP의 `docs-list`로 이미 있는 컴포넌트를 확인하고, `docs-show`로 props와 예제를 읽는다. 있는 것을 새로 만들지 않는다.
2. **시맨틱 토큰만 쓴다.** 색상은 `bg-primary`, `text-muted-foreground`, `border-border` 같은 토큰 클래스만 쓴다. hex, `rgb()`, `bg-[#...]` 같은 임의값은 금지다 (`pnpm check:tokens`가 막는다). 원시 팔레트(`--actoz-color-neutral-*`)를 컴포넌트에서 직접 참조하지 않는다.
3. **글자 크기는 의미 이름을 쓴다.** `text-caption`, `text-body-sm`, `text-body`, `text-heading`, `text-title`, `text-display`. Tailwind 기본 크기(`text-sm`, `text-lg`)는 쓰지 않는다.
4. **모서리는 토큰 스케일만 쓴다.** `rounded-sm|md|lg|xl|full`. 각 단계의 용도는 `packages/tokens/tokens/primitive/shape.json`의 `$description`에 있다.
5. **상태는 `tone`으로 표시한다.** Badge·RiskItem은 `tone`, StatCard 변화량은 `delta.tone`을 쓴다. 상태색 클래스를 직접 조합하지 않는다.
6. **차트 색은 `chart-1`부터 순서대로 배정한다.** 시리즈는 6개까지, 넘으면 "기타"로 묶는다. 시리즈 색을 텍스트에 쓰지 않고, 차트에는 범례와 표 보기를 함께 둔다. 차트 팔레트를 바꾸면 dataviz 검증 스크립트(`validate_palette.js`)로 라이트(#ffffff)·다크(#1a1a19) 배경 모두 다시 검증한다.
7. **새 토큰이 필요하면** 컴포넌트에 값을 넣지 말고 `packages/tokens/tokens/semantic/*.json`에 `$description`(용도)과 함께 추가하고, 다크 값이 다르면 `tokens/themes/dark.json`에도 넣은 뒤 `src/tailwind.css`에 매핑한다. 원시 토큰과 시맨틱 토큰의 CSS 변수 이름이 겹치면 빌드가 실패한다. 글자색 토큰을 추가하면 `packages/tokens/check-contrast.mjs`의 검사 목록에도 넣는다.

## 컴포넌트 작성 규칙

- 위치: 공통 부품은 `packages/ui/src/components/<name>/`, 키트 부품은 `packages/kit-<id>/src/components/<name>/`에 `<name>.tsx` + `<name>.stories.tsx`를 둔다. 각 패키지의 `src/index.ts`에서 export한다.
- 공통 부품은 키트를 참조하지 않는다. 공통 부품의 스토리도 키트 부품을 쓰지 않는다 (키트와 함께 쓰는 예시는 키트의 템플릿에 둔다).
- shadcn/ui 방식: `cva`로 변형을 정의하고 `cn()`으로 클래스를 합친다. 루트 요소에 `data-slot="<name>"`을 단다.
- 컴포넌트와 각 prop에 한국어 JSDoc을 쓴다. 이 주석이 MCP manifest의 설명이 된다. 와이어프레임의 쪽 번호를 함께 적는다 (예: "대화 화면 하단 입력창 (5쪽)").
- 변형과 상태마다 스토리를 하나씩 만들고, 스토리에도 JSDoc 한 줄을 단다. 스토리가 에이전트가 보는 사용 예제다.
- 아이콘만 있는 버튼에는 `aria-label`을 준다. Storybook a11y 검사가 오류로 처리한다.
- 텍스트 입력은 한글 IME 조합 중의 Enter(`event.nativeEvent.isComposing`)를 제출로 처리하지 않는다. Safari는 조합을 끝내는 Enter에 `isComposing`이 false라 `event.keyCode === 229`도 함께 본다.
- 아이콘은 `lucide-react`를 쓴다.
- 네이티브 요소 속성(`ComponentProps<'input'>` 등)만 받는 컴포넌트도 `XxxProps` 인터페이스를 만들고, 자주 쓰는 속성(`value`, `onChange`, `aria-label` 등)을 JSDoc과 함께 다시 선언한다. docgen은 react 타입에서 온 속성을 문서에서 빼기 때문에, 선언하지 않으면 MCP 문서의 props가 비어 보인다.
- **스토리 import 규칙 (MCP 예제 코드용):** meta의 `component`만 같은 폴더에서 상대 경로로 import하고, 스토리에서 쓰는 다른 컴포넌트와 보조 컴포넌트는 모두 패키지 이름(`@aha/ui`, 키트 부품이면 `@aha/kit-<id>`)으로 import한다. Storybook은 args에 쓴 식별자의 import를 원래 경로 그대로 예제에 싣기 때문에, 상대 경로로 import하면 에이전트가 존재하지 않는 경로를 보게 된다. `templates/fixtures` 같은 스토리 전용 데이터도 컴포넌트 스토리에서 import하지 말고 예시 값을 직접 적는다. 스토리를 바꾼 뒤에는 Storybook을 띄운 상태에서 `pnpm check:mcp-docs`로 확인한다.
- 주석에 `kit-*/src` 같은 글롭 경로를 쓰지 않는다. `*/`가 주석(`/* */`, `/** */`)을 닫아 빌드가 깨진다. "키트 패키지(packages/kit-이름)"처럼 풀어 쓴다.
- 대화상자처럼 화면 전체를 덮는 부품의 스토리는 `defaultOpen`으로 연다 (갤러리가 iframe으로 격리한다). meta에 `parameters.docs.story.inline: false`를 줘서 Storybook 문서 페이지에서도 iframe으로 그린다.
- 컴포넌트 소스는 같은 패키지 안이면 상대 경로로 import한다 (`../../lib/cn`). 배포용 타입 선언(`.d.ts`)이 경로 별칭을 풀지 못하기 때문이다. 키트 소스가 공통 부품을 쓸 때는 `@aha/ui`에서 import한다 (`cn`도 `@aha/ui`에서).
- 템플릿은 키트 패키지의 `src/templates/`에 둔다. 템플릿 스토리도 컴포넌트를 `@aha/ui`·`@aha/kit-<id>`에서 import한다. MCP `get_template`이 이 파일을 그대로 에이전트에 준다.
- 키트에 속한 컴포넌트는 스토리 meta에 `tags: ['autodocs', 'kit:<id>']`를, 템플릿은 `tags: ['kit:<id>']`를 단다 (템플릿은 화면 전체라 문서 페이지를 만들지 않는다). 예: `packages/kit-admin`의 부품은 `kit:admin`. 태그가 없으면 core다. 키트 id는 그 키트 패키지의 `catalog.config.json`의 `kits`에 있어야 하며, 없으면 카탈로그 빌드가 실패한다.
- 새 키트 패키지를 만들 때: `packages/kit-ai`를 본떠 `package.json`(peer `@aha/ui`), `vite.lib.config.ts`, `tsconfig*.json`, `src/styles.css`(`@source "./";`), `catalog.config.json`(키트·분류·템플릿)을 두고, 갤러리(`apps/gallery`)의 devDependencies와 `src/styles.css`에 키트를 추가한다. Storybook, 카탈로그, `check:tokens`, 배포 스크립트는 `packages/kit-*`를 자동으로 찾는다.
- 새 템플릿을 만들면 그 키트의 `catalog.config.json`의 `templates`에 이름(`label`), 묶음(`group`), 한 줄 설명을 추가한다. 키트 밀도와 다른 화면이면 `density`(`compact` 등)를 함께 적는다 (갤러리 권장 밀도·프롬프트·MCP 안내에 쓰인다).
- 갤러리는 스토리를 직접 렌더링한다. `layout: 'fullscreen'` 스토리와 `defaultOpen`처럼 화면 위에 뜨는 요소가 있는 스토리는 Storybook iframe으로 보여준다. 스토리에서 `storybook/test`의 `fn`·`expect` 외의 Storybook 런타임 API를 쓰면 `apps/gallery/src/shims/`에 대체 구현을 추가한다.
- 제네릭 컴포넌트(DataTable 등)의 스토리 meta에는 `component: DataTable`처럼 값을 그대로 넘기고, 행 타입은 `satisfies Meta<typeof DataTable<Row>>`로만 고정한다. `DataTable<Row>`나 `as` 캐스트를 값으로 넘기면 MCP manifest에서 설명과 props가 빠진다.

## 버전 메모

- TypeScript는 6.0.x로 고정한다. TS 7(네이티브 컴파일러)은 `react-docgen-typescript`와의 호환을 확인하기 전까지 올리지 않는다.
- Storybook MCP 도구 이름은 10.6 기준 `docs-list`, `docs-show`, `docs-show-story`, `stories-find-by-component` 등이다.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
