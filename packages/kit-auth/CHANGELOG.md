# @actoz/kit-auth

## 0.1.0

### Minor Changes

- 6294190: 인증 키트(`@actoz/kit-auth`)를 새로 만들었다 (AHA·IAM 통합 3단계). IAM 디자인 시스템의 인증 화면 부품과 템플릿을 옮겼다.
  
  - `AuthLayout`: 로그인·2단계 인증·동의처럼 앱 밖에서 보이는 인증 화면의 틀. 기본 로고는 "AHA 💡"이고, IAM은 `logo`로 방패 아이콘 + "IAM"을 넘긴다.
  - `OtpInput`: 2단계 인증 코드 입력. FormField `required`가 넣는 `aria-required`를 칸마다 단다.
  - 템플릿: 로그인, 2단계 인증, 앱 접근 동의 (IAM 브랜드).

### Patch Changes

- Updated dependencies [919e799]
- Updated dependencies [8f80509]
- Updated dependencies [43ed70f]
- Updated dependencies [d382f3b]
- Updated dependencies [f5bad9d]
  - @actoz/ui@0.4.0
