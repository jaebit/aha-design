# design-hub

AHA 사내 디자인 시스템. 토큰, React 컴포넌트, Storybook 갤러리를 한 저장소에서 관리하고, 같은 정보를 MCP로 AI 에이전트에 제공한다.

## 시작하기

```sh
corepack enable pnpm   # 처음 한 번
pnpm install
pnpm dev               # http://localhost:6006 (갤러리), http://localhost:6006/mcp (MCP)
```

## 에이전트에서 쓰기

Storybook을 띄운 상태에서 MCP 클라이언트에 `http://localhost:6006/mcp`를 등록한다. Claude Code는 이 저장소의 `.mcp.json`으로 자동 등록된다.

```sh
# 다른 프로젝트에서 등록할 때 (Claude Code)
claude mcp add --transport http aha-storybook http://localhost:6006/mcp
```

에이전트는 `docs-list`로 컴포넌트 목록을, `docs-show`로 props와 예제 코드를 조회한다. 토큰의 용도는 `@aha/tokens/manifest.json`에 있다.

## 현재 상태 (0.1.0)

- 토큰: 와이어프레임 v0.2.0 기준 무채색 팔레트, 글자 크기, 모서리, 그림자. **브랜드 색·상태색·서체는 임시값**이다.
- 컴포넌트: P0 24개 완료 (범용 9 · AI 대화 9 · 앱 셸 6). 링크는 `Button variant="link"`, 담당 부서 연결은 `Callout` + `action`으로 쓴다.
- 컴포넌트: P1 16개 완료 (Stepper, SidePanel, AttachmentCard, ChoiceCardGroup, Card, ResultCard, RiskItem, PreviewCard, RecipientInput, SearchInput, NativeSelect, ServiceCard, ListRow, FilterBar, DataTable, Pagination). 날짜 입력은 `Input type="date"`를 쓴다.
- 템플릿: `GuideChat`(3–9쪽, `GuideChatScreen` export), `Home`(1쪽), `AllHistory`(2쪽), `TaskConversation`(회의록 10–11쪽 · 문서 검토 12–13쪽), `IthReport`(15–16쪽)

에이전트 작업 규칙은 [AGENTS.md](AGENTS.md)를 본다.
