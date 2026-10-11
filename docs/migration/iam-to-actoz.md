# @iam/* → @actoz/* 이전 안내

IAM 디자인 시스템(`@iam/ui`, `@iam/kit-console`, `@iam/tokens`)은 AHA와 합쳐 `@actoz/*`가 됐습니다 (AHA·IAM 통합 5단계). `@iam/*`는 지금 버전(ui 0.2.1, kit-console 0.1.2, tokens 0.2.1)으로 고정하고 더 올리지 않습니다. 새 기능과 수정은 `@actoz/*`에만 들어갑니다.

부품 이름과 쓰임은 거의 같습니다. 바뀐 것은 패키지 이름, 일부 prop 이름, 브랜드를 고르는 방법(`<html data-brand="iam">`)입니다. 대부분은 코드모드가 고칩니다.

## 순서

1. **`@actoz/*`가 배포됐는지 확인한다.** 코드모드는 aha-design main의 패키지 버전을 넣으므로, 배포 뒤의 main에서 실행한다.
2. **코드모드로 미리 본다.** 고칠 파일과 "확인할 것"이 나온다. 파일은 바뀌지 않는다.
   ```sh
   node ~/workspace/aha-design/scripts/codemods/iam-to-actoz.mjs <프로젝트 폴더>
   ```
3. **고친다.** 커밋한 깨끗한 상태에서 돌리고, 결과를 diff로 본다.
   ```sh
   node ~/workspace/aha-design/scripts/codemods/iam-to-actoz.mjs <프로젝트 폴더> --write
   ```
4. **"확인할 것"을 처리한다** (아래 표).
5. `pnpm install` → 타입 검사·빌드 → 화면을 확인한다. 특히 로고, 폼 라벨, 필수 입력 검증을 본다.

코드모드는 여러 번 돌려도 된다. 이미 옮긴 곳은 다시 고치지 않고, 남은 "확인할 것"만 알려 준다.

## 코드모드가 고치는 것

| 대상 | 전 | 후 |
| --- | --- | --- |
| 패키지 (`package.json`) | `@iam/ui` | `@actoz/ui` (+ AuthLayout·OtpInput을 쓰면 `@actoz/kit-auth`) |
| | `@iam/kit-console` | `@actoz/kit-admin` |
| | `@iam/tokens` | `@actoz/tokens` |
| 레지스트리 (`.npmrc`) | `@iam:registry=…/packages/iam/npm/` | `@actoz:registry=http://localhost:3000/api/packages/actoz/npm/` |
| import | `import { AuthLayout, Button } from '@iam/ui'` | `@actoz/ui`의 Button + `@actoz/kit-auth`의 AuthLayout으로 나눔 |
| CSS | `@import "@iam/ui/styles.css"`, `"@iam/kit-console/styles.css"` | `@actoz/ui/styles.css`, `@actoz/kit-admin/styles.css` (+ 인증 키트를 쓰면 `@actoz/kit-auth/styles.css`) |
| CSS 변수 | `--iam-color-primary` | `--actoz-color-primary` (이름만 다르고 108개가 1:1) |
| 토큰 상수 | `IamColorPrimary` | `ActozColorPrimary` |
| 안내 문구 prop | `<FormField hint=…>`, `<SecretField hint=…>` | `description=…` |
| 레일 이름 | `<NavRail …>` (기본 "주 메뉴") | `<NavRail aria-label="주 메뉴" …>` (기본값이 "서비스"로 바뀜) |
| 관리 메뉴 이름 | `<AccountMenu onAdminSettings=…>` (기본 "관리 콘솔") | `adminLabel="관리 콘솔"` 추가 (기본값이 "관리자 설정"으로 바뀜) |
| 브랜드 | — | `index.html`의 `<html>`에 `data-brand="iam"` |

## 확인할 것 (사람이 정한다)

| 코드모드 메시지 | 할 일 |
| --- | --- |
| AuthLayout 기본 로고가 AHA로 바뀌었다 | IAM 로고를 넘긴다. 아래 코드 |
| NavRail 기본 로고가 AHA로 바뀌었다 | IAM 로고를 넘긴다. 아래 코드 |
| FormField required는 이제 aria-required만 건다 | 예전에는 입력에 `required`가 걸려 제출할 때 브라우저 말풍선이 떴다. 이제는 걸리지 않는다. 빈 값은 FormField `error`로 알린다. 브라우저 검증이 꼭 필요하면 입력 요소에 `required`를 직접 준다 |
| 자동으로 옮기지 못한 참조 | `import * as UI from '@iam/ui'`, `require('@iam/…')` 같은 형태. 위 대응표대로 손으로 바꾼다 |
| `<html>`에 data-brand="iam"을 단다 | `index.html`이 없는 앱(SSR 등)은 루트 `<html>`을 그리는 곳에 단다. 없으면 AHA 색(검정 primary)으로 보인다 |

IAM 로고 (예전 기본값과 같은 모양):

```tsx
import { ShieldCheck } from 'lucide-react';

// AuthLayout
<AuthLayout
  logo={
    <>
      <ShieldCheck aria-hidden className="size-7 text-primary" />
      IAM
    </>
  }
  title="로그인"
>

// NavRail (좁은 레일은 글자를 화면에서 숨긴다)
<NavRail
  aria-label="주 메뉴"
  logo={
    <span className="flex items-center gap-2 text-title font-bold tracking-wide">
      <ShieldCheck aria-hidden className="size-7 text-primary" />
      {expanded ? 'IAM' : <span className="sr-only">IAM</span>}
    </span>
  }
  expanded={expanded}
  …
/>
```

## 화면에서 달라지는 것

코드모드로 옮겨도 아래는 화면이 조금 달라집니다. 통합하면서 두 시스템 중 하나로 정한 것입니다.

| 부품 | 전 (IAM) | 후 (@actoz) |
| --- | --- | --- |
| FormField 라벨 | `text-body-sm` 중간 굵기, "(필수)" | `text-body` 굵게, 작은 회색 "필수" |
| FormField 필수 | 입력에 `required` (브라우저 검증) | `aria-required`만 |
| AuthLayout·NavRail 로고 | 기본 IAM | 기본 AHA (IAM은 `logo`로 넘김) |

색, 간격, 서체, 그 밖의 부품 동작은 `data-brand="iam"`이면 IAM과 같습니다. 통합하면서 들어온 접근성 수정(DataTable 행 선택 표시, BulkActionBar 선택 수 알림 등)은 그대로 받습니다.

## 참고

- 부품 문서와 예제: IAM 갤러리 http://localhost:4200 (MCP `iam-design`). 이제 `@actoz/*` 기준으로 보여준다.
- 통합 결정과 진행: 「AHA·IAM 디자인 시스템 통합 계획」 문서.
