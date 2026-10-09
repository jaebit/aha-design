// 실행 중인 Storybook MCP(기본 http://localhost:6006/mcp)에서 모든 문서를 받아, 에이전트가 보는 예제 코드를 검사한다.
// - 예제 import가 @aha/ui 또는 허용된 외부 패키지만 가리키는지 (상대 경로·fixtures 금지)
// - 같은 예제에 @aha/ui import가 두 번 나오지 않는지
// - 컴포넌트 문서에 설명이 있는지
// 사용: pnpm dev 로 Storybook을 띄운 상태에서 pnpm check:mcp-docs
const endpoint = process.env.STORYBOOK_MCP_URL ?? 'http://localhost:6006/mcp';
const allowedSources = /from '(@aha\/ui|react|storybook\/test|lucide-react)'/;

async function call(name, args) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  });
  const line = (await response.text()).split('\n').find((l) => l.startsWith('data: '));
  return JSON.parse(line.slice(6)).result.content.map((c) => c.text).join('\n');
}

let list;
try {
  list = await call('docs-list', {});
} catch {
  console.error(`Storybook MCP에 연결하지 못했습니다 (${endpoint}). pnpm dev 로 Storybook을 먼저 띄우세요.`);
  process.exit(2);
}

const ids = [...list.matchAll(/^- \w+ \(([\w-]+)\)/gm)].map((m) => m[1]);
const problems = [];
for (const id of ids) {
  const doc = await call('docs-show', { id });
  const isComponent = !id.startsWith('templates-') && !id.startsWith('foundations-');
  const badImports = [...new Set([...doc.matchAll(/^import .* from '[^']+';$/gm)].map((m) => m[0]))].filter(
    (line) => !allowedSources.test(line),
  );
  for (const line of badImports) problems.push(`${id}: 패키지 밖 import → ${line}`);
  const blocks = doc.split('```');
  for (let i = 1; i < blocks.length; i += 2) {
    if ((blocks[i].match(/from '@aha\/ui'/g) ?? []).length > 1) {
      problems.push(`${id}: 예제에 @aha/ui import가 중복됨`);
      break;
    }
  }
  const description = doc.split('## Stories')[0].split('\n').slice(3).join('').trim();
  if (isComponent && !description) problems.push(`${id}: 컴포넌트 설명(JSDoc)이 없음`);
}

if (problems.length > 0) {
  console.error(`MCP 문서 문제 ${problems.length}건 (${ids.length}개 검사)\n\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`MCP 문서 검사 통과 (${ids.length}개)`);
