---
"@aha/ui": patch
---

IAM 디자인 시스템의 공통 부품 변경을 합쳤다 (AHA·IAM 통합 2단계).

- Button: `destructive-solid` 변형을 추가했다. `link` 변형은 primary 색 글자를 쓰고, 크기의 높이·여백을 `compoundVariants`로 지워 `size`와 함께 써도 깨지지 않는다.
- AccountMenu: 관리자 메뉴 이름 `adminLabel`(기본 "관리자 설정")을 추가하고 트리거에 `data-slot`을 달았다.
- NavRail: 내비게이션 이름 `aria-label`(기본 "서비스")을 받는다.
- DataTable: 표 행에 지원되지 않는 `aria-selected` 대신 `data-state="selected"`를 단다. Checkbox: `label`이 없으면 `aria-describedby`를 달지 않는다.
- TooltipTerm에 `data-slot`을 달고, 여러 부품의 props 설명을 보강해 두 브랜드의 예시를 함께 적었다.
