// 인증 키트. 공통 부품(@aha/ui) 위에 로그인·2단계 인증·OAuth 동의처럼 앱 밖에서 보이는 인증 화면의 부품을 둔다.
// 동의 화면의 권한 목록(ScopeList)은 관리 화면도 쓰므로 공통 부품에 있다.

export { AuthLayout, type AuthLayoutProps } from './components/auth-layout/auth-layout';
export { OtpInput, type OtpInputProps } from './components/otp-input/otp-input';
