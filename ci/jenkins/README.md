# Jenkins CI·배포

로컬 Jenkins(`forgejo-platform/jenkins-local`, http://127.0.0.1:8081)에서 돈다. 플랫폼 결정(forgejo-platform `docs/07-DECISIONS.md` D-002, D-012~D-014, D-016)을 따른다.

| job | 언제 | 하는 일 | credential |
| --- | --- | --- | --- |
| `aha-design-ci` | main 푸시 (Forgejo webhook) | install → typecheck → build → check:tokens·contrast → Storybook 띄우고 check:mcp-docs → Forgejo 커밋 상태 | 읽기, 상태 보고 |
| `aha-design-pr` | Forgejo webhook 또는 수동 실행 (D-016) | 열린 PR 중 `jenkins/aha-design-pr` 상태가 없는 head를 차례로: changeset 확인 → 격리 Agent에서 CI와 같은 검사 → 그 SHA에 커밋 상태 | 읽기·상태 보고는 신뢰 단계에서만. PR 코드 실행 단계에는 없음 |
| `aha-design-release` | 사람이 `RELEASE_TAG`를 넣어 실행 | main에 포함된 tag인지 확인 → credential 없이 빌드 → `changeset publish`(레지스트리에 없는 버전만) → 배포 확인 | 읽기, **배포는 Publish 단계에서만** |

- 파이프라인은 이 폴더의 `Jenkinsfile.ci`, `Jenkinsfile.pr`, `Jenkinsfile.release`가 원본이다. 플랫폼 규칙상 Jenkins job에는 내용을 인라인으로 넣는다 (Pipeline from SCM을 쓰지 않는다). 파일을 바꾸면 아래 `--update-jobs`로 반영한다.
- Agent는 1 executor, 메모리 4GB, pnpm 10.34.6이다. turbo는 `--concurrency=1`로 돈다.

프로젝트 이름을 `aha-design`으로 변경했다. 기존 CI 계정 `ci-design-hub`와 PAT 값은 재사용하며, 저장소·Jenkins job·credential ID·secret 파일 경로는 `aha-design`으로 맞춘다.
로컬 CI·PR job은 활성 상태다. 이름 변경 시 기존 webhook의 이벤트·분기 설정은 보존했다. 현재 두 webhook 모두 push 신호를 받으며, PR 열기·동기화 이벤트로 전환하는 절차는 아래 PR CI 계약과 플랫폼 안내를 따른다.

## 처음 한 번: 계정과 토큰 준비 (사람이 한다)

1. Forgejo 관리자로 전용 비관리자 계정 `ci-design-hub`를 만든다.
2. `jay/aha-design` 저장소 설정 → 협업자에 `ci-design-hub`를 **쓰기** 권한으로 추가한다 (커밋 상태 보고에 필요).
3. `actoz` 조직에 `ci-design-hub`가 들어간 팀을 만들고 **패키지 쓰기** 권한을 준다.
4. `ci-design-hub`로 로그인해 PAT 3개를 만든다 (설정 → 애플리케이션). 이름은 아래와 같게, 권한은 하나씩만.
   - `aha-design-read` — `read:repository`
   - `aha-design-status` — `write:repository`
   - `aha-design-package-publish` — `write:package`
5. forgejo-platform 폴더에 저장한다. 값은 명령 인자나 URL에 넣지 않는다. 입력을 받는 명령이라 **일반 터미널에서** 실행한다 (에이전트 도구나 Claude Code의 `!`로 실행하면 입력을 받지 못해 빈 파일이 된다). 마지막 줄로 크기가 0이 아닌지 확인한다.

```bash
cd ~/workspace/forgejo-platform
mkdir -p secrets/aha-design && chmod 700 secrets/aha-design
printf 'ci-design-hub' > secrets/aha-design/ci-user
for name in aha-design-read aha-design-status aha-design-package-publish; do
  read -rsp "$name 토큰: " value; echo; printf '%s' "$value" > "secrets/aha-design/$name.token"
done
chmod 600 secrets/aha-design/*
wc -c secrets/aha-design/*.token   # 0이 아니면 됨 (값은 출력하지 않음)
```

## `@actoz` 범위로 옮길 때 (AHA·IAM 통합 5단계, 한 번만, 사람이 한다)

패키지 범위를 `@aha`에서 `@actoz`로 바꿨다. 첫 배포 전에 레지스트리 조직을 만든다. 토큰은 새로 만들지 않는다 (`write:package` PAT는 계정 단위라, `ci-design-hub`가 조직 팀에 들어가면 그대로 쓴다).

1. Forgejo 관리자로 조직 `actoz`를 만든다 (오른쪽 위 `+` → 새 조직). 공개로 둔다. release job의 Verify 단계가 인증 없이 조회하므로 비공개로 두지 않는다.
2. 위 3번처럼 `actoz` 조직에 `ci-design-hub`가 들어간 팀을 만들고 **패키지 쓰기** 권한을 준다. `@aha/*` 호환 패키지는 배포하지 않는다 (한 번도 배포하지 않아 쓰는 곳이 없어 지웠다).
3. `Jenkinsfile.release`가 바뀌었으므로 아래 `--update-jobs`로 job에 반영한다.
4. 직접 배포하는 사람은 `~/.npmrc`의 토큰 줄을 `//localhost:3000/api/packages/actoz/npm/:_authToken=...`으로 바꾼다.
5. 쓰는 프로젝트는 `.npmrc`를 `@actoz:registry=http://localhost:3000/api/packages/actoz/npm/`으로 바꾸고 import를 `@actoz/*`로 옮긴다.

## 연결

```bash
cd ~/workspace/forgejo-platform
bash jenkins-local/scripts/up.sh                               # pnpm·4GB가 반영된 Agent로 다시 띄운다
python3 jenkins/setup-design-hub.py --repo-dir ../aha-design --project aha-design   # credential 3개, job 3개, main·PR webhook
```

## PR 검사 (`aha-design-pr`, D-016)

머지 전에 PR head에서 main CI와 같은 검사를 돌리고 결과를 `jenkins/aha-design-pr` 커밋 상태로 남긴다. 계약은 forgejo-platform `jenkins/README.md`의 "PR CI 계약"이다.

- **선택:** webhook은 신호일 뿐이다. job이 열린 PR을 모두 조회해, head와 base가 이 저장소인 PR(fork 제외) 중 `jenkins/aha-design-pr` 상태가 없는 head를 고른다. 상태가 이미 있으면 결과와 관계없이 다시 검사하지 않는다. 다시 검사하려면 새 커밋(빈 커밋도 된다)을 푸시한다.
- **SHA 확인:** 검사 직전에 PR을 다시 조회하고 `refs/pull/<N>/head`를 받아, checkout SHA가 고른 head SHA와 같을 때만 검사한다. 결과는 고른 SHA에만 남긴다.
- **changeset:** base와 head의 공통 조상부터 head까지 `packages/` 아래가 바뀌었으면, 그 사이에 추가·수정한 `.changeset/*.md`(README 제외)가 있어야 한다. 없으면 나머지 검사 없이 failure로 끝난다. 정확히 `chore/version-packages` 브랜치의 PR만 면제한다.
- **실행 경계:** PR 조회·fetch·changeset 확인·상태 보고는 `local-linux`(신뢰 단계)에서 하고 PR 코드를 실행하지 않는다. install과 검사는 `git archive`로 넘긴 소스로 `pr-isolated` Agent에서 credential 없이 한다.
- **한 실행의 범위:** head를 최대 8개, 하나씩 검사한다(한 PR 40분, 전체 150분). 한 PR이 실패해도 다음 PR로 넘어간다. 중단·시간 초과면 그 SHA에 error를 남기고 멈춘다. 남은 head는 다음 webhook이나 수동 실행에서 검사한다.

**신규 환경에서 필요한 것 (플랫폼):** `local-linux`와 프로세스·파일·캐시를 공유하지 않는 `pr-isolated` Agent. 이 Agent가 없으면 job이 PR 단계에서 Agent를 기다리다 시간 초과로 끝난다. Agent가 준비되면 `--update-jobs`로 job을 만들고 `--webhook-only`로 PR webhook을 단다. main 필수 상태는 아직 걸지 않는다.

## 배포

1. PR에서 `pnpm version-packages`로 버전을 올리고 머지한다 (`.changeset/README.md`).
2. 머지된 main 커밋에 `release-YYYYMMDD-N` tag를 만들고 push한다.

```bash
git tag release-20261010-1 origin/main && git push origin release-20261010-1
```

3. Jenkins에서 `aha-design-release`를 **Build with Parameters**로 실행하고 `RELEASE_TAG`에 그 tag를 넣는다.

이미 레지스트리에 있는 버전은 건너뛰므로, 버전을 올리지 않고 실행하면 아무것도 배포하지 않고 끝난다.
