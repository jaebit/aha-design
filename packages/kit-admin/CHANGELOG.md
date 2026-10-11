# @actoz/kit-admin

0.3.x까지(토큰은 0.2.x, 키트는 0.1.x) 이름은 `@aha/kit-admin`였다. 예전 이름은 호환 패키지(`compat/aha-kit-admin`)가 `@actoz/kit-admin`를 다시 내보내며 이어 배포한다.

## 0.2.0

### Minor Changes

- d382f3b: 패키지 범위를 `@aha`에서 `@actoz`로 바꿨다 (AHA·IAM 통합 5단계). 레지스트리는 Forgejo `actoz` 조직(`http://localhost:3000/api/packages/actoz/npm/`)이다. 쓰는 프로젝트는 `.npmrc`를 `@actoz:registry=...`로 바꾸고 import와 CSS를 `@actoz/*`로 옮긴다 (`@import "@actoz/ui/styles.css";`). API와 화면은 바뀌지 않는다.

### Patch Changes

- 8f80509: FormField를 관리자 키트에서 공통 부품(`@actoz/ui`)으로 옮겼다 (AHA·IAM 통합 2단계). IAM의 FormField에 있던 라벨 오른쪽 보조 요소(`labelAction`), `id` prop, ReactNode 라벨·오류를 더했다. 자식이 이미 가진 `aria-describedby`·`aria-invalid`·`aria-required`를 지우지 않고 함께 잇는다. `@actoz/kit-admin`의 `FormField`는 `@actoz/ui`를 다시 내보내며 deprecated다. `@actoz/ui`에서 import한다.
- 43ed70f: IAM 관리 콘솔 키트(`@iam/kit-console`)를 관리자 키트로 합쳤다 (AHA·IAM 통합 3단계).
  
  - `@actoz/kit-admin`: `SecretField`(가린 비밀값, 복사, 한 번만 보기, 재발급)와 `SessionList`(로그인 세션 목록, 끊기)를 추가했다. SecretField의 안내 문구 prop은 `description`이다.
  - `@actoz/ui`: `ScopeList`(OAuth 권한 목록)를 추가했다. 인증 화면과 관리 화면이 함께 쓰므로 공통 부품에 둔다.
  - BulkActionBar: 선택 수 알림 영역을 선택이 없을 때도 남겨 두어, 처음 고를 때도 스크린리더가 읽는다.
  - ConfirmDialog: destructive 확인 버튼이 `Button variant="destructive-solid"`를 쓴다 (모양은 같다).
  - 관리 콘솔 템플릿 5개(`Templates/Console…`: 사용자 관리·사용자 상세·OAuth 클라이언트 상세·역할 편집·감사 로그)를 IAM 브랜드로 추가했다.
- Updated dependencies [919e799]
- Updated dependencies [8f80509]
- Updated dependencies [43ed70f]
- Updated dependencies [d382f3b]
- Updated dependencies [f5bad9d]
  - @actoz/ui@0.4.0

## 0.1.2

### Patch Changes

- f8939bd: 접근성: Avatar 대체 글자, Stepper 완료·고정됨 아이콘에 `role="img"`를 더해 이름이 읽히게 했다. RiskItem 심각도는 화면에 안 보이는 "심각도" 글자로 읽는다. ThinkingIndicator는 동작 줄이기 설정에서 깜빡이지 않는다. Composer·RecipientInput·ConversationHeader는 Safari의 한글 조합 Enter(keyCode 229)를 제출로 처리하지 않는다. MessageActions는 복사에 실패하면 "복사됨"을 띄우지 않는다. Heatmap 단계 경계를 범례 글자와 맞추고 빈 범례 목록을 없앴다. GuideChatScreen은 해시가 있는 주소로 처음 열 때 그 대화를 연다. CellText·DropdownMenuSeparator·DropdownMenuLabel에 data-slot을 달고, prop 설명을 보강했다. 키트 패키지가 tailwindcss를 peer로 두고, kit-dashboard는 배포 코드에서 쓰지 않는 lucide-react를 의존성에서 뺐다.

## 0.1.1

### Patch Changes

- 스크린리더용 숨김 텍스트(sr-only)가 스크롤 영역 밖으로 빠져 문서에 스크롤바가 하나 더 생기던 문제를 고쳤다. 숨김 텍스트를 가진 부품 루트(차트, DataTable, PermissionMatrix, ChoiceCardGroup 항목, 사이드바 항목, 내비 레일 로고)에 위치 기준(relative)을 둔다.
