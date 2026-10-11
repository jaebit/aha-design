# @actoz/kit-dashboard

0.3.x까지(토큰은 0.2.x, 키트는 0.1.x) 이름은 `@aha/kit-dashboard`였다. 예전 이름은 호환 패키지(`compat/aha-kit-dashboard`)가 `@actoz/kit-dashboard`를 다시 내보내며 이어 배포한다.

## 0.2.0

### Minor Changes

- d382f3b: 패키지 범위를 `@aha`에서 `@actoz`로 바꿨다 (AHA·IAM 통합 5단계). 레지스트리는 Forgejo `actoz` 조직(`http://localhost:3000/api/packages/actoz/npm/`)이다. 쓰는 프로젝트는 `.npmrc`를 `@actoz:registry=...`로 바꾸고 import와 CSS를 `@actoz/*`로 옮긴다 (`@import "@actoz/ui/styles.css";`). API와 화면은 바뀌지 않는다.

### Patch Changes

- f5bad9d: 토큰의 CSS 변수 접두사와 테마 설정 키를 통합 디자인 시스템 이름 `actoz`로 바꿨다 (AHA·IAM 통합 1단계 마무리). 값은 바뀌지 않는다.
  
  - CSS 변수: `--aha-color-primary` → `--actoz-color-primary` (모든 변수)
  - JS 상수: `AhaColorPrimary` → `ActozColorPrimary`
  - 테마 설정 키: `$extensions["aha.theme"]` → `$extensions["actoz.theme"]`, manifest `prefix`: `"actoz"`
  
  `@actoz/tokens/tailwind.css`의 Tailwind 클래스(`bg-primary` 등)는 그대로라, 클래스만 쓰는 앱은 바꿀 것이 없다. CSS 변수나 JS 상수를 직접 쓰는 앱은 이름을 바꾼다.
- Updated dependencies [919e799]
- Updated dependencies [8f80509]
- Updated dependencies [43ed70f]
- Updated dependencies [d382f3b]
- Updated dependencies [f5bad9d]
  - @actoz/ui@0.4.0

## 0.1.2

### Patch Changes

- 3d838d1: 포커스 링(`ring`) 대비를 3:1 이상으로 올렸다 (라이트 neutral-500, 다크 neutral-400). AccountMenu 트리거와 Composer 입력칸에 키보드 포커스 표시를 되살렸다. StackedColumnChart는 시리즈가 6개를 넘으면 6번째부터 "기타"로 묶는다. LineChart는 그리지 못한 시리즈를 콘솔에 경고한다. PeriodPicker의 기본 "오늘"을 사용자 시간대로 정하고, 날짜 칸을 비우면 안내 문구를 보여 준다. DonutChart의 아주 작은 조각이 사라지거나 활성 조각 바깥이 잘리던 문제를 고쳤다.
- f8939bd: 접근성: Avatar 대체 글자, Stepper 완료·고정됨 아이콘에 `role="img"`를 더해 이름이 읽히게 했다. RiskItem 심각도는 화면에 안 보이는 "심각도" 글자로 읽는다. ThinkingIndicator는 동작 줄이기 설정에서 깜빡이지 않는다. Composer·RecipientInput·ConversationHeader는 Safari의 한글 조합 Enter(keyCode 229)를 제출로 처리하지 않는다. MessageActions는 복사에 실패하면 "복사됨"을 띄우지 않는다. Heatmap 단계 경계를 범례 글자와 맞추고 빈 범례 목록을 없앴다. GuideChatScreen은 해시가 있는 주소로 처음 열 때 그 대화를 연다. CellText·DropdownMenuSeparator·DropdownMenuLabel에 data-slot을 달고, prop 설명을 보강했다. 키트 패키지가 tailwindcss를 peer로 두고, kit-dashboard는 배포 코드에서 쓰지 않는 lucide-react를 의존성에서 뺐다.

## 0.1.1

### Patch Changes

- 스크린리더용 숨김 텍스트(sr-only)가 스크롤 영역 밖으로 빠져 문서에 스크롤바가 하나 더 생기던 문제를 고쳤다. 숨김 텍스트를 가진 부품 루트(차트, DataTable, PermissionMatrix, ChoiceCardGroup 항목, 사이드바 항목, 내비 레일 로고)에 위치 기준(relative)을 둔다.

## 0.1.0

### Minor Changes

- 대시보드 키트 첫 배포: LineChart, DonutChart, Heatmap, PeriodPicker, WidgetGrid·Widget, 템플릿 ServiceUsage(서비스 사용 현황).
