# @aha/tokens

## 0.2.3

### Patch Changes

- 6ca3a19: 입력 테두리(`input`)를 바탕과 3:1 이상(WCAG 1.4.11)으로 올렸다. 라이트는 새 원시 색 `neutral.450`(#8a8883), 다크는 `neutral.500`. 입력칸·선택칸·검색창 테두리와 꺼진 스위치 트랙이 조금 진해진다. `check:contrast`가 입력 테두리도 검사한다.

## 0.2.2

### Patch Changes

- 3d838d1: 포커스 링(`ring`) 대비를 3:1 이상으로 올렸다 (라이트 neutral-500, 다크 neutral-400). AccountMenu 트리거와 Composer 입력칸에 키보드 포커스 표시를 되살렸다. StackedColumnChart는 시리즈가 6개를 넘으면 6번째부터 "기타"로 묶는다. LineChart는 그리지 못한 시리즈를 콘솔에 경고한다. PeriodPicker의 기본 "오늘"을 사용자 시간대로 정하고, 날짜 칸을 비우면 안내 문구를 보여 준다. DonutChart의 아주 작은 조각이 사라지거나 활성 조각 바깥이 잘리던 문제를 고쳤다.
