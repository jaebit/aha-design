---
"@actoz/ui": patch
"@actoz/kit-admin": patch
---

IAM 관리 콘솔 키트(`@iam/kit-console`)를 관리자 키트로 합쳤다 (AHA·IAM 통합 3단계).

- `@actoz/kit-admin`: `SecretField`(가린 비밀값, 복사, 한 번만 보기, 재발급)와 `SessionList`(로그인 세션 목록, 끊기)를 추가했다. SecretField의 안내 문구 prop은 `description`이다.
- `@actoz/ui`: `ScopeList`(OAuth 권한 목록)를 추가했다. 인증 화면과 관리 화면이 함께 쓰므로 공통 부품에 둔다.
- BulkActionBar: 선택 수 알림 영역을 선택이 없을 때도 남겨 두어, 처음 고를 때도 스크린리더가 읽는다.
- ConfirmDialog: destructive 확인 버튼이 `Button variant="destructive-solid"`를 쓴다 (모양은 같다).
- 관리 콘솔 템플릿 5개(`Templates/Console…`: 사용자 관리·사용자 상세·OAuth 클라이언트 상세·역할 편집·감사 로그)를 IAM 브랜드로 추가했다.
