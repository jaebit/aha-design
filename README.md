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

- 토큰: 검정 primary 무채색 팔레트, 상태색(dataviz 검증 팔레트), 차트 색, Pretendard, 글자 크기, 모서리, 그림자. **라이트·다크 테마** 지원 (`<html data-theme>` 또는 시스템 설정). 라이트·다크 모두 글자 대비 4.5:1 이상 (`pnpm check:contrast`).
- 컴포넌트: P0 24개 완료 (범용 9 · AI 대화 9 · 앱 셸 6). 링크는 `Button variant="link"`, 담당 부서 연결은 `Callout` + `action`으로 쓴다.
- 컴포넌트: P1 16개 완료 (Stepper, SidePanel, AttachmentCard, ChoiceCardGroup, Card, ResultCard, RiskItem, PreviewCard, RecipientInput, SearchInput, NativeSelect, ServiceCard, ListRow, FilterBar, DataTable, Pagination). 날짜 입력은 `Input type="date"`를 쓴다.
- 컴포넌트: P2 6개 완료 (StatCard, BarList, StackedColumnChart, Switch, MonthStepper, InfoSummary) + SidebarNavItem. 차트 색 `chart-1~6`은 dataviz 기준 팔레트(라이트·다크 검증 통과).
- 템플릿: `GuideChat`(3–9쪽, `GuideChatScreen` export), `Home`(1쪽), `AllHistory`(2쪽), `TaskConversation`(회의록 10–11쪽 · 문서 검토 12–13쪽), `IthReport`(15–16쪽), `Newsletter`(14쪽), `AdminDashboard`(20쪽)

에이전트 작업 규칙은 [AGENTS.md](AGENTS.md)를 본다.
