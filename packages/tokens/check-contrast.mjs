// 빌드된 manifest로 기본(라이트)과 모든 테마(tokens/themes/*.json)의 대비를 검사한다.
// 글자/배경은 WCAG AA 4.5:1, 포커스 링 같은 글자 아닌 요소/배경은 WCAG 1.4.11 3:1.
// 테마가 덮어쓰지 않은 토큰은 기본값으로 검사한다. 조합 테마는 함께 쓰는 테마의 값을 먼저 본다.
// 토큰 값을 바꾸면 pnpm build 후 이 검사를 돌린다. 새 글자색 토큰을 추가하면 아래 pairs에도 추가한다.
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('./dist/tokens.manifest.json', import.meta.url), 'utf8'));
const MIN = 4.5;
const MIN_NON_TEXT = 3;

const pairs = [
  ['foreground', ['background', 'subtle', 'muted', 'card', 'popover']],
  ['muted-foreground', ['background', 'subtle', 'muted', 'card', 'popover']],
  ['primary-foreground', ['primary', 'primary-hover']],
  ['secondary-foreground', ['secondary']],
  ['accent-foreground', ['accent']],
  ['destructive', ['background', 'popover', 'accent']],
  ['tooltip-foreground', ['tooltip']],
  ['card-foreground', ['card']],
  ['popover-foreground', ['popover']],
  ['status-good-foreground', ['background', 'muted']],
  ['status-warning-foreground', ['background', 'muted']],
  ['status-serious-foreground', ['background', 'muted']],
  ['status-critical-foreground', ['background', 'muted']],
  ['destructive-foreground', ['destructive']],
];

// 글자가 아닌 요소. 상태 아이콘(status-*)은 라이트 warning·serious가 3:1 미만이라 라벨 글자와 함께 쓰는 규칙으로 대신한다 (AGENTS.md).
const nonTextPairs = [
  ['ring', ['background', 'subtle', 'muted', 'card', 'popover']],
  ['input', ['background', 'subtle', 'card', 'popover']],
];

function color(name, mode) {
  const token = manifest.tokens.find((t) => t.name === `color.${name}`);
  if (!token) throw new Error(`토큰 없음: color.${name}`);
  // 조합 테마(예: brand-iam-dark)는 덮어쓰지 않은 토큰을 manifest.fallbacks 순서(dark → brand-iam)로 찾는다.
  for (const m of [mode, ...(manifest.fallbacks?.[mode] ?? [])]) {
    if (token[m]) return token[m].value;
  }
  return token.value;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const failures = [];
// 색을 바꾸지 않는 테마(밀도 등)는 라이트와 같으므로 건너뛴다.
const colorThemes = manifest.themes.filter(
  (mode) => mode === 'light' || manifest.tokens.some((t) => t.type === 'color' && t[mode]),
);
for (const mode of colorThemes) {
  const check = (list, threshold) => {
    let min = Infinity;
    for (const [fg, backgrounds] of list) {
      for (const bg of backgrounds) {
        const ratio = contrast(color(fg, mode), color(bg, mode));
        min = Math.min(min, ratio);
        if (ratio < threshold) failures.push(`[${mode}] ${fg} on ${bg}: ${ratio.toFixed(2)}:1 (기준 ${threshold}:1)`);
      }
    }
    return min;
  };
  const text = check(pairs, MIN);
  const nonText = check(nonTextPairs, MIN_NON_TEXT);
  console.log(`[${mode}] 최소 대비 글자 ${text.toFixed(2)}:1, 글자 아닌 요소(포커스 링·입력 테두리) ${nonText.toFixed(2)}:1`);
}

if (failures.length > 0) {
  console.error(`\n대비 부족 ${failures.length}건\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('대비 검사 통과');
