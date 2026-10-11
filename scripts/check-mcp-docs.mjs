// 실행 중인 Storybook MCP(기본 http://localhost:6006/mcp)에서 모든 문서를 받아, 에이전트가 보는 예제 코드를 검사한다.
// - 예제 import가 @aha/ui, 키트 패키지(@aha/kit-*) 또는 허용된 외부 패키지만 가리키는지 (상대 경로·fixtures 금지)
// - 같은 예제에 같은 @aha 패키지 import가 두 번 나오지 않는지
// - 컴포넌트 문서에 설명과 props가 있는지
// 사용: pnpm dev 로 Storybook을 띄운 상태에서 pnpm check:mcp-docs
const endpoint = process.env.STORYBOOK_MCP_URL ?? 'http://localhost:6006/mcp';
const allowedSources = /^(@aha\/ui|@aha\/kit-[a-z0-9-]+|react|storybook\/test|lucide-react)$/;

async function call(name, args) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  });
  // 응답은 SSE(data: 줄) 또는 JSON 하나다.
  const body = await response.text();
  const line = body.split('\n').find((l) => l.startsWith('data: '));
  const message = JSON.parse(line ? line.slice(6) : body);
  if (!message.result) throw new Error(`${name}: ${JSON.stringify(message.error ?? message)}`);
  return message.result.content.map((c) => c.text).join('\n');
}

let list;
try {
  list = await call('docs-list', {});
} catch {
  console.error(`Storybook MCP에 연결하지 못했습니다 (${endpoint}). pnpm dev 로 Storybook을 먼저 띄우세요.`);
  process.exit(2);
}

const ids = [...list.matchAll(/^- \w+ \(([\w-]+)\)/gm)].map((m) => m[1]);
if (ids.length === 0) {
  console.error(`docs-list에서 문서 id를 하나도 찾지 못했습니다. Storybook MCP 출력 형식이 바뀌었는지 확인하세요.\n\n${list.slice(0, 500)}`);
  process.exit(1);
}
const problems = [];
for (const id of ids) {
  const doc = await call('docs-show', { id });
  const isComponent = !id.startsWith('templates-') && !id.startsWith('foundations-');
  // 여러 줄 import와 side-effect import('./x')까지 잡는다.
  const sources = [...doc.matchAll(/^import\s+(?:[^;]*?\s+from\s+)?'([^']+)'/gm)].map((m) => m[1]);
  for (const source of new Set(sources)) {
    if (!allowedSources.test(source)) problems.push(`${id}: 패키지 밖 import → '${source}'`);
  }
  const blocks = doc.split('```');
  for (let i = 1; i < blocks.length; i += 2) {
    const packages = [...blocks[i].matchAll(/from '(@aha\/[a-z0-9-]+)'/g)].map((m) => m[1]);
    const duplicate = packages.find((name, index) => packages.indexOf(name) !== index);
    if (duplicate) {
      problems.push(`${id}: 예제에 ${duplicate} import가 중복됨`);
      break;
    }
  }
  const description = doc.split('## Stories')[0].split('\n').slice(3).join('').trim();
  if (isComponent && !description) problems.push(`${id}: 컴포넌트 설명(JSDoc)이 없음`);
  if (isComponent && !doc.includes('## Props')) problems.push(`${id}: props 문서가 비어 있음 (네이티브 속성만 받는 컴포넌트는 주요 속성을 직접 선언한다)`);
}

if (problems.length > 0) {
  console.error(`MCP 문서 문제 ${problems.length}건 (${ids.length}개 검사)\n\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`MCP 문서 검사 통과 (${ids.length}개)`);
