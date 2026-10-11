# @actoz/tokens

0.3.x까지(토큰은 0.2.x, 키트는 0.1.x) 이름은 `@aha/tokens`였다. 예전 이름은 호환 패키지(`compat/aha-tokens`)가 `@actoz/tokens`를 다시 내보내며 이어 배포한다.

## 0.3.0

### Minor Changes

- d382f3b: 패키지 범위를 `@aha`에서 `@actoz`로 바꿨다 (AHA·IAM 통합 5단계). 레지스트리는 Forgejo `actoz` 조직(`http://localhost:3000/api/packages/actoz/npm/`)이다. 쓰는 프로젝트는 `.npmrc`를 `@actoz:registry=...`로 바꾸고 import와 CSS를 `@actoz/*`로 옮긴다 (`@import "@actoz/ui/styles.css";`). API와 화면은 바뀌지 않는다.
- f5bad9d: 토큰의 CSS 변수 접두사와 테마 설정 키를 통합 디자인 시스템 이름 `actoz`로 바꿨다 (AHA·IAM 통합 1단계 마무리). 값은 바뀌지 않는다.
  
  - CSS 변수: `--aha-color-primary` → `--actoz-color-primary` (모든 변수)
  - JS 상수: `AhaColorPrimary` → `ActozColorPrimary`
  - 테마 설정 키: `$extensions["aha.theme"]` → `$extensions["actoz.theme"]`, manifest `prefix`: `"actoz"`
  
  `@actoz/tokens/tailwind.css`의 Tailwind 클래스(`bg-primary` 등)는 그대로라, 클래스만 쓰는 앱은 바꿀 것이 없다. CSS 변수나 JS 상수를 직접 쓰는 앱은 이름을 바꾼다.

### Patch Changes

- b85c48e: IAM 브랜드 테마(`<html data-brand="iam">`)와 원시 팔레트 `color.brand.*`를 추가했다. 테마 설정에 `with`를 추가해 두 테마가 함께 적용될 때의 값(`brand-iam-dark`)을 정할 수 있다. manifest에 조합 테마의 값 찾는 순서(`fallbacks`)를 싣는다. 기존 라이트·다크·촘촘한 밀도 값은 바뀌지 않는다.
- ebc6e23: 토큰 manifest의 테마 값(예: `token["brand-iam"]`)에 테마 파일이 적은 설명(`description`)을 함께 싣는다. IAM 갤러리·MCP가 IAM 브랜드의 primary 설명을 보여줄 수 있다. CSS 변수와 값은 바뀌지 않는다.

## 0.2.3

### Patch Changes

- 6ca3a19: 입력 테두리(`input`)를 바탕과 3:1 이상(WCAG 1.4.11)으로 올렸다. 라이트는 새 원시 색 `neutral.450`(#8a8883), 다크는 `neutral.500`. 입력칸·선택칸·검색창 테두리와 꺼진 스위치 트랙이 조금 진해진다. `check:contrast`가 입력 테두리도 검사한다.

## 0.2.2

### Patch Changes

- 3d838d1: 포커스 링(`ring`) 대비를 3:1 이상으로 올렸다 (라이트 neutral-500, 다크 neutral-400). AccountMenu 트리거와 Composer 입력칸에 키보드 포커스 표시를 되살렸다. StackedColumnChart는 시리즈가 6개를 넘으면 6번째부터 "기타"로 묶는다. LineChart는 그리지 못한 시리즈를 콘솔에 경고한다. PeriodPicker의 기본 "오늘"을 사용자 시간대로 정하고, 날짜 칸을 비우면 안내 문구를 보여 준다. DonutChart의 아주 작은 조각이 사라지거나 활성 조각 바깥이 잘리던 문제를 고쳤다.
