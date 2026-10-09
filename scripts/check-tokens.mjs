// 컴포넌트 소스에 하드코딩된 색상과 임의값 색상 클래스가 없는지 검사한다.
// 에이전트가 만든 코드도 이 검사를 통과해야 한다. 스토리 파일은 검사하지 않는다.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const targets = ['packages/ui/src/components'];

const rules = [
  { pattern: /#[0-9a-fA-F]{3,8}\b/, message: 'hex 색상 대신 시맨틱 토큰 클래스(bg-primary 등)를 쓴다' },
  { pattern: /\b(?:rgb|rgba|hsl|hsla|oklch)\(/, message: '색상 함수 대신 시맨틱 토큰 클래스를 쓴다' },
  {
    pattern: /\b(?:bg|text|border|ring|outline|fill|stroke|from|to|via|shadow)-\[(?!var\()/,
    message: '임의값 클래스(bg-[...]) 대신 토큰 기반 클래스를 쓴다',
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
