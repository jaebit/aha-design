// DTCG 토큰(tokens/**/*.json)을 CSS 변수, JS/TS 상수, 에이전트용 manifest로 빌드한다.
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFormat({
  name: 'aha/agent-manifest',
  // 에이전트가 토큰의 "의도"까지 읽을 수 있도록 이름, CSS 변수, 값, 설명을 평평한 JSON으로 낸다.
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.map((token) => ({
      name: token.path.join('.'),
      cssVar: `--${token.name}`,
      type: token.$type,
      value: token.$value,
      ...(token.original.$value !== token.$value && typeof token.original.$value === 'string'
        ? { reference: token.original.$value }
        : {}),
      ...(token.$description ? { description: token.$description } : {}),
      layer: token.filePath.includes('/semantic/') ? 'semantic' : 'primitive',
    }));
    return JSON.stringify({ prefix: 'aha', tokens }, null, 2) + '\n';
  },
});

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  usesDtcg: true,
  log: { verbosity: 'default' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'aha',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
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

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
