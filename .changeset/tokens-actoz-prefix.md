---
"@actoz/tokens": minor
"@actoz/ui": patch
"@actoz/kit-dashboard": patch
---

토큰의 CSS 변수 접두사와 테마 설정 키를 통합 디자인 시스템 이름 `actoz`로 바꿨다 (AHA·IAM 통합 1단계 마무리). 값은 바뀌지 않는다.

- CSS 변수: `--aha-color-primary` → `--actoz-color-primary` (모든 변수)
- JS 상수: `AhaColorPrimary` → `ActozColorPrimary`
- 테마 설정 키: `$extensions["aha.theme"]` → `$extensions["actoz.theme"]`, manifest `prefix`: `"actoz"`

`@actoz/tokens/tailwind.css`의 Tailwind 클래스(`bg-primary` 등)는 그대로라, 클래스만 쓰는 앱은 바꿀 것이 없다. CSS 변수나 JS 상수를 직접 쓰는 앱은 이름을 바꾼다.
