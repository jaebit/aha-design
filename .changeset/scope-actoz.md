---
"@actoz/ui": minor
"@actoz/tokens": minor
"@actoz/kit-admin": minor
"@actoz/kit-ai": minor
"@actoz/kit-dashboard": minor
---

패키지 범위를 `@aha`에서 `@actoz`로 바꿨다 (AHA·IAM 통합 5단계). 레지스트리는 Forgejo `actoz` 조직(`http://localhost:3000/api/packages/actoz/npm/`)이다. 쓰는 프로젝트는 `.npmrc`를 `@actoz:registry=...`로 바꾸고 import와 CSS를 `@actoz/*`로 옮긴다 (`@import "@actoz/ui/styles.css";`). API와 화면은 바뀌지 않는다.
