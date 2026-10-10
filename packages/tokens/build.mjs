// DTCG 토큰(tokens/**/*.json)을 CSS 변수, JS/TS 상수, 에이전트용 manifest로 빌드한다.
// - 기본(라이트): tokens/primitive + tokens/semantic → :root
// - 테마: tokens/themes/<이름>.json이 semantic 값을 덮어쓴다. 적용 조건은 각 파일의 $extensions["aha.theme"]에 적는다.
//     attribute, value   <html attribute="value">일 때 적용 (필수)
//     colorScheme        light | dark. 네이티브 요소(날짜 입력, 스크롤바)의 색 체계
//     media, mediaUnless 시스템 설정(media)을 따르되, attribute="mediaUnless"로 고정한 페이지는 제외
//   테마는 서로 다른 attribute를 쓰면 함께 적용된다 (예: data-theme="dark" + data-density="compact").
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';

import StyleDictionary from 'style-dictionary';
import { formattedVariables } from 'style-dictionary/utils';

const baseSource = ['tokens/primitive/**/*.json', 'tokens/semantic/**/*.json'];
const tmpDir = 'dist/.themes/';

const manifestEntry = (token) => ({
  name: token.path.join('.'),
  cssVar: `--${token.name}`,
  type: token.$type,
  value: token.$value,
  ...(typeof token.original.$value === 'string' && token.original.$value.startsWith('{')
    ? { reference: token.original.$value }
    : {}),
  ...(token.$description ? { description: token.$description } : {}),
});

const cssVariables = (dictionary) =>
  formattedVariables({ format: 'css', dictionary, outputReferences: true, usesDtcg: true });

StyleDictionary.registerFormat({
  name: 'aha/css-light',
  format: async ({ dictionary }) =>
    `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n:root {\n  color-scheme: light;\n${cssVariables(dictionary)}\n}\n`,
});

/** 테마 하나의 CSS 블록. 설정은 options.theme ($extensions["aha.theme"]). */
StyleDictionary.registerFormat({
  name: 'aha/css-theme',
  format: async ({ dictionary, options }) => {
    const { name, label = name, attribute, value, colorScheme, media, mediaUnless } = options.theme;
    const indent = (text, depth) => text.replace(/^ {2}/gm, ' '.repeat(depth));
    const variables = cssVariables(dictionary);
    const scheme = colorScheme ? [`  color-scheme: ${colorScheme};`] : [];
    const lines = [''];
    if (media) {
      const exclude = mediaUnless ? `:not([${attribute}="${mediaUnless}"])` : '';
      lines.push(
        `/* ${label} 테마: 시스템 설정을 따르되${mediaUnless ? `, ${attribute}="${mediaUnless}"로 고정한 페이지는 제외한다` : ''}. */`,
        `@media ${media} {`,
        `  :root${exclude} {`,
        ...scheme.map((line) => `  ${line}`),
        indent(variables, 4),
        '  }',
        '}',
        '',
      );
    }
    lines.push(`/* ${label} 테마: ${attribute}="${value}"로 고른 경우. */`, `:root[${attribute}="${value}"] {`, ...scheme, variables, '}', '');
    return lines.join('\n');
  },
});

StyleDictionary.registerFormat({
  name: 'aha/agent-manifest',
  // 에이전트가 토큰의 "의도"까지 읽을 수 있도록 이름, CSS 변수, 값, 설명을 평평한 JSON으로 낸다.
  format: ({ dictionary, options }) => {
    const tokens = dictionary.allTokens.map((token) => ({
      ...manifestEntry(token),
      layer: token.filePath.includes('/semantic/') ? 'semantic' : 'primitive',
    }));
    return JSON.stringify({ prefix: 'aha', themes: ['light', ...options.themeNames], tokens }, null, 2) + '\n';
  },
});

StyleDictionary.registerFormat({
  name: 'aha/agent-manifest-theme',
  format: ({ dictionary }) => JSON.stringify(dictionary.allTokens.map(manifestEntry), null, 2),
});

// tokens/themes/*.json을 읽어 테마 목록을 만든다. 파일 이름이 테마 이름이다.
const themeFiles = (await readdir('tokens/themes')).filter((file) => file.endsWith('.json')).sort();
const themes = [];
for (const file of themeFiles) {
  const name = file.replace(/\.json$/, '');
  const config = JSON.parse(await readFile(`tokens/themes/${file}`, 'utf8')).$extensions?.['aha.theme'];
  if (!config?.attribute || !config?.value) {
    throw new Error(`tokens/themes/${file}: $extensions["aha.theme"]에 attribute와 value가 필요합니다.`);
  }
  themes.push({ name, file, ...config });
}

const base = new StyleDictionary({
  source: baseSource,
  usesDtcg: true,
  // 기본 빌드에서 이름 충돌은 실수이므로 빌드를 실패시킨다. 예: color.signal.good과 color.status-good.
  log: { verbosity: 'verbose', warnings: 'error' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'aha',
      buildPath: 'dist/',
      files: [{ destination: 'tokens.css', format: 'aha/css-light' }],
    },
    js: {
      transformGroup: 'js',
      prefix: 'aha',
      buildPath: 'dist/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
    agent: {
      transformGroup: 'css',
      prefix: 'aha',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.manifest.json',
          format: 'aha/agent-manifest',
          options: { themeNames: themes.map((t) => t.name) },
        },
      ],
    },
  },
});

await base.cleanAllPlatforms();
await base.buildAllPlatforms();

let css = await readFile('dist/tokens.css', 'utf8');
const manifest = JSON.parse(await readFile('dist/tokens.manifest.json', 'utf8'));
const byName = new Map(manifest.tokens.map((t) => [t.name, t]));

for (const theme of themes) {
  const fromTheme = (token) => token.filePath.endsWith(`/themes/${theme.file}`);
  const build = new StyleDictionary({
    // 테마 파일이 같은 이름의 semantic 토큰을 의도적으로 덮어쓰므로 충돌 경고는 끈다.
    source: [...baseSource, `tokens/themes/${theme.file}`],
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'disabled' },
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'aha',
        buildPath: tmpDir,
        files: [{ destination: `${theme.name}.css`, format: 'aha/css-theme', filter: fromTheme, options: { theme } }],
      },
      agent: {
        transformGroup: 'css',
        prefix: 'aha',
        buildPath: tmpDir,
        files: [{ destination: `${theme.name}.json`, format: 'aha/agent-manifest-theme', filter: fromTheme }],
      },
    },
  });
  await build.buildAllPlatforms();

  // 테마 CSS를 tokens.css 뒤에 붙이고, manifest의 각 토큰에 테마 값을 싣는다 (예: token.dark).
  css += await readFile(`${tmpDir}${theme.name}.css`, 'utf8');
  for (const t of JSON.parse(await readFile(`${tmpDir}${theme.name}.json`, 'utf8'))) {
    const entry = byName.get(t.name);
    if (entry) entry[theme.name] = { value: t.value, ...(t.reference ? { reference: t.reference } : {}) };
  }
}

await writeFile('dist/tokens.css', css);
await writeFile('dist/tokens.manifest.json', JSON.stringify(manifest, null, 2) + '\n');
await rm(tmpDir, { recursive: true, force: true });
