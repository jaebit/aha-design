# @aha/tokens (폐기 예정)

새 패키지는 `@actoz/tokens`입니다. 이 패키지는 새 패키지를 다시 내보내고, 예전 이름을 쓰는 코드가 깨지지 않도록 별칭을 줍니다.

- CSS 변수: `--aha-color-primary` → `var(--actoz-color-primary)` (`tokens.css`, `aliases.css`)
- JS 상수: `AhaColorPrimary` → `ActozColorPrimary`
- `manifest.json`: 이름(`cssVar`)을 `--aha-*`로 바꾼 사본

다음 메이저에서 배포를 멈춥니다. 새 코드는 `@actoz/tokens`와 `--actoz-*`를 씁니다.
