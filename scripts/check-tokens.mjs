// 컴포넌트 소스에 하드코딩된 색상과 임의값 색상 클래스가 없는지 검사한다.
// 에이전트가 만든 코드도 이 검사를 통과해야 한다. 스토리 파일은 검사하지 않는다.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
// 공통 부품과 모든 키트 패키지(packages/kit-이름)의 컴포넌트·화면·보조 소스.
const targets = ['ui', ...readdirSync(join(root, 'packages')).filter((name) => name.startsWith('kit-'))]
  .flatMap((name) => ['components', 'templates', 'lib'].map((sub) => `packages/${name}/src/${sub}`))
  .filter((dir) => existsSync(join(root, dir)));

// 원시 팔레트 그룹(neutral, data, signal 등). 컴포넌트는 시맨틱 토큰만 참조한다.
const primitiveGroups = Object.keys(
  JSON.parse(readFileSync(join(root, 'packages/tokens/tokens/primitive/color.json'), 'utf8')).color,
).filter((key) => !key.startsWith('$'));

const rules = [
  { pattern: /#[0-9a-fA-F]{3,8}\b/, message: 'hex 색상 대신 시맨틱 토큰 클래스(bg-primary 등)를 쓴다' },
  { pattern: /\b(?:rgb|rgba|hsl|hsla|oklch)\(/, message: '색상 함수 대신 시맨틱 토큰 클래스를 쓴다' },
  {
    pattern: /\b(?:bg|text|border|ring|outline|fill|stroke|from|to|via|shadow)-\[(?!var\()/,
    message: '임의값 클래스(bg-[...]) 대신 토큰 기반 클래스를 쓴다',
  },
  {
    pattern: new RegExp(`--aha-color-(?:${primitiveGroups.join('|')})-`),
    message: '원시 팔레트 변수 대신 시맨틱 토큰(--aha-color-chart-1 등)을 쓴다',
  },
];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(tsx?|css)$/.test(entry.name) && !entry.name.includes('.stories.')) yield path;
  }
}

const problems = [];
for (const target of targets) {
  for (const file of walk(join(root, target))) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        for (const rule of rules) {
          if (rule.pattern.test(line)) {
            problems.push(`${relative(root, file)}:${index + 1}  ${rule.message}\n    ${line.trim()}`);
          }
        }
      });
  }
}

if (problems.length > 0) {
  console.error(`토큰 규칙 위반 ${problems.length}건\n\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('토큰 규칙 검사 통과');
