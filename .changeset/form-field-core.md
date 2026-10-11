---
"@aha/ui": patch
"@aha/kit-admin": patch
---

FormField를 관리자 키트에서 공통 부품(`@aha/ui`)으로 옮겼다 (AHA·IAM 통합 2단계). IAM의 FormField에 있던 라벨 오른쪽 보조 요소(`labelAction`), `id` prop, ReactNode 라벨·오류를 더했다. 자식이 이미 가진 `aria-describedby`·`aria-invalid`·`aria-required`를 지우지 않고 함께 잇는다. `@aha/kit-admin`의 `FormField`는 `@aha/ui`를 다시 내보내며 deprecated다. `@aha/ui`에서 import한다.
