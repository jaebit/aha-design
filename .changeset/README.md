# 변경 기록 (Changesets)

`packages/*`(`@actoz/tokens`, `@actoz/ui`, `@actoz/kit-*`)를 바꾸는 PR에는 변경 기록 파일을 하나 넣는다. 버전과 CHANGELOG는 이 파일들로 정해진다.

## 1. PR에서: 변경 기록 추가

`pnpm changeset`은 대화형이다. 에이전트나 스크립트는 이 폴더에 파일을 직접 만든다 (파일 이름은 아무거나, 예: `admin-form-hint.md`).

```md
---
"@actoz/kit-admin": minor
"@actoz/ui": patch
---

FormField에 글자 수 표시를 추가했다. Textarea의 포커스 테두리를 고쳤다.
```

- 1.0 전이라 **부품을 빼거나 이름·props를 바꾸면 minor**, 추가·수정은 patch로 적는다. 1.0 이후에는 일반 semver를 따른다.
- 키트의 `@actoz/ui` peer 범위는 Changesets가 맞춘다. `@actoz/ui`가 minor로 오르면 모든 키트가 자동으로 patch가 올라 새 범위(`^0.N.0`)로 다시 배포된다. 키트를 따로 적지 않아도 된다.
- 갤러리(`apps/gallery`)만 바꾼 PR, 문서만 바꾼 PR에는 필요 없다.

## 2. 배포할 때: 버전 올리기

```sh
pnpm version-packages   # .changeset/*.md를 모아 package.json 버전과 CHANGELOG.md를 갱신하고 파일을 지운다
```

결과를 PR로 올리고 머지한다.

## 3. 배포

```sh
pnpm release            # 패키지를 빌드하고, 레지스트리에 없는 버전만 배포한다 (이미 있는 버전은 건너뜀)
pnpm changeset publish-plan   # 배포 전에 무엇이 올라갈지 확인
```

`~/.npmrc`(또는 CI 비밀값)에 `//localhost:3000/api/packages/actoz/npm/:_authToken=<write:package 토큰>`이 있어야 한다. 레지스트리 주소는 저장소의 `.npmrc`에 있다.
