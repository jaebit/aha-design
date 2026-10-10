# Jenkins CI·배포

로컬 Jenkins(`forgejo-platform/jenkins-local`, http://127.0.0.1:8081)에서 돈다. 플랫폼 결정(forgejo-platform `docs/07-DECISIONS.md` D-002, D-012~D-014)을 따른다.

| job | 언제 | 하는 일 | credential |
| --- | --- | --- | --- |
| `design-hub-ci` | main 푸시 (Forgejo webhook) | install → typecheck → build → check:tokens·contrast → Storybook 띄우고 check:mcp-docs → Forgejo 커밋 상태 | 읽기, 상태 보고 |
| `design-hub-release` | 사람이 `RELEASE_TAG`를 넣어 실행 | main에 포함된 tag인지 확인 → credential 없이 빌드 → `changeset publish`(레지스트리에 없는 버전만) → 배포 확인 | 읽기, **배포는 Publish 단계에서만** |

- 파이프라인은 이 폴더의 `Jenkinsfile.ci`, `Jenkinsfile.release`가 원본이다. 플랫폼 규칙상 Jenkins job에는 내용을 인라인으로 넣는다 (Pipeline from SCM을 쓰지 않는다). 파일을 바꾸면 아래 `--update-jobs`로 반영한다.
- Agent는 1 executor, 메모리 4GB, pnpm 10.34.6이다. turbo는 `--concurrency=1`로 돈다.

## 처음 한 번: 계정과 토큰 준비 (사람이 한다)

1. Forgejo 관리자로 전용 비관리자 계정 `ci-design-hub`를 만든다.
2. `jay/design-hub` 저장소 설정 → 협업자에 `ci-design-hub`를 **쓰기** 권한으로 추가한다 (커밋 상태 보고에 필요).
3. `aha` 조직에 `ci-design-hub`가 들어간 팀을 만들고 **패키지 쓰기** 권한을 준다.
4. `ci-design-hub`로 로그인해 PAT 3개를 만든다 (설정 → 애플리케이션). 이름은 아래와 같게, 권한은 하나씩만.
   - `design-hub-read` — `read:repository`
   - `design-hub-status` — `write:repository`
   - `design-hub-package-publish` — `write:package`
5. forgejo-platform 폴더에 저장한다. 값은 명령 인자나 URL에 넣지 않는다. 입력을 받는 명령이라 **일반 터미널에서** 실행한다 (에이전트 도구나 Claude Code의 `!`로 실행하면 입력을 받지 못해 빈 파일이 된다). 마지막 줄로 크기가 0이 아닌지 확인한다.

```bash
cd ~/workspace/forgejo-platform
mkdir -p secrets/design-hub && chmod 700 secrets/design-hub
printf 'ci-design-hub' > secrets/design-hub/ci-user
for name in design-hub-read design-hub-status design-hub-package-publish; do
  read -rsp "$name 토큰: " value; echo; printf '%s' "$value" > "secrets/design-hub/$name.token"
done
chmod 600 secrets/design-hub/*
wc -c secrets/design-hub/*.token   # 0이 아니면 됨 (값은 출력하지 않음)
```

## 연결

```bash
cd ~/workspace/forgejo-platform
bash jenkins-local/scripts/up.sh                               # pnpm·4GB가 반영된 Agent로 다시 띄운다
python3 jenkins/setup-design-hub.py --repo-dir ../design-hub   # credential 3개, job 2개, main 푸시 webhook
```

## 배포

1. PR에서 `pnpm version-packages`로 버전을 올리고 머지한다 (`.changeset/README.md`).
2. 머지된 main 커밋에 `release-YYYYMMDD-N` tag를 만들고 push한다.

```bash
git tag release-20261010-1 origin/main && git push origin release-20261010-1
```

3. Jenkins에서 `design-hub-release`를 **Build with Parameters**로 실행하고 `RELEASE_TAG`에 그 tag를 넣는다.

이미 레지스트리에 있는 버전은 건너뛰므로, 버전을 올리지 않고 실행하면 아무것도 배포하지 않고 끝난다.
