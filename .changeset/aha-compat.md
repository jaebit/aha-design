---
"@aha/ui": patch
"@aha/tokens": patch
"@aha/kit-admin": patch
"@aha/kit-ai": patch
"@aha/kit-dashboard": patch
---

`@aha/*`는 폐기 예정이다. 새 패키지 `@actoz/*`를 다시 내보내는 호환 패키지로 배포한다 (AHA·IAM 통합 5단계). 지금 `@aha/*`를 쓰는 서비스는 업데이트만 해도 그대로 동작한다. `@aha/tokens`는 예전 CSS 변수(`--aha-*`)와 JS 상수(`Aha*`)의 별칭을 함께 준다. 새 코드는 `@actoz/*`를 쓰고, 다음 메이저에서 `@aha/*` 배포를 멈춘다.
