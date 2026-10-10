# design-hub

AHA 사내 디자인 시스템. 토큰, React 컴포넌트, Storybook 갤러리를 한 저장소에서 관리하고, 같은 정보를 MCP로 AI 에이전트에 제공한다.

## 구성

| 대상 | 보는 곳 |
| --- | --- |
| 누구나 (비개발자 포함) | **갤러리** http://localhost:4100 — 컴포넌트·화면 템플릿을 보고 "에이전트용 프롬프트 복사" |
| AI 에이전트 | **aha-design MCP** http://localhost:4100/mcp — 컴포넌트 검색, props·예제, 템플릿 소스, 토큰, 설치 방법 |
| 프로젝트 | **npm 패키지** `@aha/ui`(공통), `@aha/kit-admin`(관리자 키트), `@aha/kit-ai`(AI 서비스 키트), `@aha/tokens` — 사내 Forgejo 레지스트리 (`aha` 조직) |
| 디자인 시스템 개발자 | **Storybook** http://localhost:6006 (개발), 갤러리의 `/storybook/` (정적) |

## 갤러리 + MCP 띄우기 (Docker)

```sh
pnpm docker:up         # = docker compose up -d --build → http://localhost:4100
```

이미지 하나에 갤러리, MCP 서버, Storybook 정적 빌드가 들어 있다. 사내 서버로 옮길 때는 `compose.yaml`의 `PUBLIC_URL`, `NPM_REGISTRY`(와 빌드 인자 `VITE_NPM_REGISTRY`)만 바꾼다.

## 개발

```sh
corepack enable pnpm   # 처음 한 번
pnpm install
pnpm dev               # Storybook http://localhost:6006 (Storybook MCP: /mcp)
pnpm gallery           # 갤러리 개발 서버 http://localhost:5180 (Storybook 정적 빌드 후)
```

## 에이전트에서 쓰기

MCP 클라이언트에 `http://localhost:4100/mcp`를 등록한다. 이 저장소에서는 `.mcp.json`으로 자동 등록된다.

```sh
# 다른 프로젝트에서 등록할 때 (Claude Code)
claude mcp add --transport http aha-design http://localhost:4100/mcp
```

도구: `list_components`, `search`, `get_component`, `list_templates`, `get_template`, `get_tokens`, `get_setup_guide`. 갤러리의 "시작하기"에 Cursor·VS Code 설정도 있다.

## 패키지 배포

```sh
pnpm publish:packages  # @aha/tokens, @aha/ui, @aha/kit-* 빌드 후 Forgejo npm 레지스트리에 배포
```

`~/.npmrc`에 `//localhost:3000/api/packages/aha/npm/:_authToken=<write:package 권한 토큰>`이 있어야 한다. 버전은 각 `package.json`의 `version`을 올린다. 사용하는 프로젝트는 `.npmrc`에 `@aha:registry=http://localhost:3000/api/packages/aha/npm/`를 두고 `@import "@aha/ui/styles.css";` 한 줄로 시작한다. 키트를 쓰면 다음 줄에 `@import "@aha/kit-ai/styles.css";`처럼 키트 CSS를 더한다.

## 현재 상태 (@aha/tokens 0.2.0 · @aha/ui 0.3.0 · @aha/kit-admin 0.1.0 · @aha/kit-ai 0.1.1)

- 패키지: 공통 부품은 `@aha/ui`, AI 대화 부품 13개와 화면 템플릿은 `@aha/kit-ai`에 있다. 0.2.0에서 AI 부품이 `@aha/ui`에서 빠졌으므로, 0.1.0을 쓰던 프로젝트는 `@aha/kit-ai`를 설치하고 해당 import를 옮긴다.
- 관리자 키트 `@aha/kit-admin`: FormSection, FormField, FormActions, DescriptionList, BulkActionBar, ConfirmDialog, PermissionMatrix + 템플릿 `UserManagement`(사용자 관리), `UserEdit`(사용자 편집). 공통에 Checkbox, Textarea, DataTable 행 선택(`selectedIds`)을 더했다.
- 밀도: `<html data-density="compact">`로 촘촘한 밀도를 켠다 (간격만 4px → 3.5px). 관리자 화면 기준이다.

- 토큰: 검정 primary 무채색 팔레트, 상태색(dataviz 검증 팔레트), 차트 색, Pretendard, 글자 크기, 모서리, 그림자. **라이트·다크 테마** 지원 (`<html data-theme>` 또는 시스템 설정). 라이트·다크 모두 글자 대비 4.5:1 이상 (`pnpm check:contrast`).
- 컴포넌트: P0 24개 완료 (범용 9 · AI 대화 9 · 앱 셸 6). 링크는 `Button variant="link"`, 담당 부서 연결은 `Callout` + `action`으로 쓴다.
- 컴포넌트: P1 16개 완료 (Stepper, SidePanel, AttachmentCard, ChoiceCardGroup, Card, ResultCard, RiskItem, PreviewCard, RecipientInput, SearchInput, NativeSelect, ServiceCard, ListRow, FilterBar, DataTable, Pagination). 날짜 입력은 `Input type="date"`를 쓴다.
- 컴포넌트: P2 6개 완료 (StatCard, BarList, StackedColumnChart, Switch, MonthStepper, InfoSummary) + SidebarNavItem. 차트 색 `chart-1~6`은 dataviz 기준 팔레트(라이트·다크 검증 통과).
- 템플릿: `GuideChat`(3–9쪽, `GuideChatScreen` export), `Home`(1쪽), `AllHistory`(2쪽), `TaskConversation`(회의록 10–11쪽 · 문서 검토 12–13쪽), `IthReport`(15–16쪽), `Newsletter`(14쪽), `AdminDashboard`(20쪽)

에이전트 작업 규칙은 [AGENTS.md](AGENTS.md)를 본다.
