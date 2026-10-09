// DTCG 토큰(tokens/**/*.json)을 CSS 변수, JS/TS 상수, 에이전트용 manifest로 빌드한다.
// - 라이트: tokens/primitive + tokens/semantic → :root
// - 다크: tokens/themes/dark.json이 semantic 값을 덮어쓴다 → prefers-color-scheme: dark, [data-theme="dark"]
import { readFile, rm, writeFile } from 'node:fs/promises';

import StyleDictionary from 'style-dictionary';
import { formattedVariables } from 'style-dictionary/utils';

const baseSource = ['tokens/primitive/**/*.json', 'tokens/semantic/**/*.json'];
const isDarkToken = (token) => token.filePath.includes('/themes/dark');

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

StyleDictionary.registerFormat({
  name: 'aha/css-light',
  format: async ({ dictionary }) => {
    const variables = formattedVariables({ format: 'css', dictionary, outputReferences: true, usesDtcg: true });
    return `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n:root {\n  color-scheme: light;\n${variables}\n}\n`;
  },
});

StyleDictionary.registerFormat({
  name: 'aha/css-dark',
  format: async ({ dictionary }) => {
    const indent = (text, depth) => text.replace(/^ {2}/gm, ' '.repeat(depth));
    const variables = formattedVariables({ format: 'css', dictionary, outputReferences: true, usesDtcg: true });
    return [
      '',
      '/* 다크 테마: 시스템 설정을 따르되, data-theme="light"로 고정한 페이지는 제외한다. */',
      '@media (prefers-color-scheme: dark) {',
      '  :root:not([data-theme="light"]) {',
      '    color-scheme: dark;',
      indent(variables, 4),
      '  }',
      '}',
      '',
      '/* 다크 테마: 사용자가 직접 고른 경우. */',
      ':root[data-theme="dark"] {',
      '  color-scheme: dark;',
      variables,
      '}',
      '',
    ].join('\n');
  },
});

StyleDictionary.registerFormat({
  name: 'aha/agent-manifest',
  // 에이전트가 토큰의 "의도"까지 읽을 수 있도록 이름, CSS 변수, 값, 설명을 평평한 JSON으로 낸다.
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.map((token) => ({
      ...manifestEntry(token),
      layer: token.filePath.includes('/semantic/') ? 'semantic' : 'primitive',
    }));
    return JSON.stringify({ prefix: 'aha', themes: ['light', 'dark'], tokens }, null, 2) + '\n';
  },
});

StyleDictionary.registerFormat({
  name: 'aha/agent-manifest-dark',
  format: ({ dictionary }) => JSON.stringify(dictionary.allTokens.map(manifestEntry), null, 2),
});

const light = new StyleDictionary({
  source: baseSource,
  usesDtcg: true,
  // 라이트(기본) 빌드에서 이름 충돌은 실수이므로 빌드를 실패시킨다. 예: color.signal.good과 color.status-good.
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
      files: [{ destination: 'tokens.manifest.json', format: 'aha/agent-manifest' }],
    },
  },
});

const dark = new StyleDictionary({
  // themes/dark.json이 같은 이름의 semantic 토큰을 의도적으로 덮어쓰므로 충돌 경고는 끈다.
  source: [...baseSource, 'tokens/themes/dark.json'],
  usesDtcg: true,
  log: { verbosity: 'silent', warnings: 'disabled' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'aha',
      buildPath: 'dist/.dark/',
      files: [{ destination: 'tokens.dark.css', format: 'aha/css-dark', filter: isDarkToken }],
    },
    agent: {
      transformGroup: 'css',
      prefix: 'aha',
      buildPath: 'dist/.dark/',
      files: [{ destination: 'tokens.dark.json', format: 'aha/agent-manifest-dark', filter: isDarkToken }],
    },
  },
});

await light.cleanAllPlatforms();
await light.buildAllPlatforms();
await dark.buildAllPlatforms();

// 다크 CSS를 tokens.css 뒤에 붙이고, manifest의 각 토큰에 다크 값을 싣는다.
const darkCss = await readFile('dist/.dark/tokens.dark.css', 'utf8');
const lightCss = await readFile('dist/tokens.css', 'utf8');
await writeFile('dist/tokens.css', lightCss + darkCss);

const darkTokens = new Map(JSON.parse(await readFile('dist/.dark/tokens.dark.json', 'utf8')).map((t) => [t.name, t]));
const manifest = JSON.parse(await readFile('dist/tokens.manifest.json', 'utf8'));
for (const token of manifest.tokens) {
  const darkToken = darkTokens.get(token.name);
  if (darkToken) token.dark = { value: darkToken.value, ...(darkToken.reference ? { reference: darkToken.reference } : {}) };
}
await writeFile('dist/tokens.manifest.json', JSON.stringify(manifest, null, 2) + '\n');
await rm('dist/.dark', { recursive: true, force: true });
