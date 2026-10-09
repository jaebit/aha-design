# AGENTS.md

AHA 사내 디자인 시스템 모노레포. 사람은 Storybook 갤러리를 보고, 에이전트는 같은 정보를 Storybook MCP로 조회한다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `packages/tokens` | W3C DTCG 2025.10 토큰(`tokens/**/*.json`) → Style Dictionary 빌드 → `dist/tokens.css`, `dist/tokens.js`, `dist/tokens.manifest.json` |
| `packages/tokens/src/tailwind.css` | 토큰 → Tailwind v4 `@theme` 매핑. 색상 이름은 shadcn/ui 규약을 따른다 |
| `packages/ui` | React 컴포넌트 + Storybook 10 (`@storybook/addon-mcp`) |
| `scripts/check-tokens.mjs` | 하드코딩 색상 검사 |
| `docs/` | 와이어프레임 원본 (aha.actoz.com v0.2.0) |

## 명령

pnpm은 corepack으로 실행한다 (`packageManager`: pnpm 10).

- `pnpm install`
- `pnpm dev` — 토큰을 빌드하고 Storybook을 http://localhost:6006 에 띄운다. MCP 엔드포인트는 http://localhost:6006/mcp
- `pnpm typecheck`
- `pnpm check:tokens` — 컴포넌트에 하드코딩된 색상이 없는지 검사
- `pnpm build-storybook` — 정적 갤러리 빌드

## UI 작업 규칙

1. **먼저 조회한다.** 컴포넌트를 쓰거나 만들기 전에 Storybook MCP의 `docs-list`로 이미 있는 컴포넌트를 확인하고, `docs-show`로 props와 예제를 읽는다. 있는 것을 새로 만들지 않는다.
2. **시맨틱 토큰만 쓴다.** 색상은 `bg-primary`, `text-muted-foreground`, `border-border` 같은 토큰 클래스만 쓴다. hex, `rgb()`, `bg-[#...]` 같은 임의값은 금지다 (`pnpm check:tokens`가 막는다). 원시 팔레트(`--aha-color-neutral-*`)를 컴포넌트에서 직접 참조하지 않는다.
3. **글자 크기는 의미 이름을 쓴다.** `text-caption`, `text-body-sm`, `text-body`, `text-heading`, `text-title`, `text-display`. Tailwind 기본 크기(`text-sm`, `text-lg`)는 쓰지 않는다.
4. **모서리는 토큰 스케일만 쓴다.** `rounded-sm|md|lg|xl|full`. 각 단계의 용도는 `packages/tokens/tokens/primitive/shape.json`의 `$description`에 있다.
5. **새 토큰이 필요하면** 컴포넌트에 값을 넣지 말고 `packages/tokens/tokens/semantic/*.json`에 `$description`(용도)과 함께 추가한 뒤 `src/tailwind.css`에 매핑한다.

## 컴포넌트 작성 규칙

- 위치: `packages/ui/src/components/<name>/<name>.tsx` + `<name>.stories.tsx`. `src/index.ts`에서 export한다.
- shadcn/ui 방식: `cva`로 변형을 정의하고 `cn()`으로 클래스를 합친다. 루트 요소에 `data-slot="<name>"`을 단다.
- 컴포넌트와 각 prop에 한국어 JSDoc을 쓴다. 이 주석이 MCP manifest의 설명이 된다. 와이어프레임의 쪽 번호를 함께 적는다 (예: "대화 화면 하단 입력창 (5쪽)").
- 변형과 상태마다 스토리를 하나씩 만들고, 스토리에도 JSDoc 한 줄을 단다. 스토리가 에이전트가 보는 사용 예제다.
- 아이콘만 있는 버튼에는 `aria-label`을 준다. Storybook a11y 검사가 오류로 처리한다.
- 텍스트 입력은 한글 IME 조합 중의 Enter(`event.nativeEvent.isComposing`)를 제출로 처리하지 않는다.
- 아이콘은 `lucide-react`를 쓴다.
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
