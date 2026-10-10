import { Button, Callout, Card, Chip } from '@aha/ui';
import { ArrowRight } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { catalog, mcpUrl, registryUrl } from '../lib/catalog';
import { Link } from '../lib/router';
import { CodeBlock } from '../site/code-block';

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-body-sm font-semibold text-primary-foreground">
        {n}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
        <h3 className="text-heading font-semibold">{title}</h3>
        {children}
      </div>
    </li>
  );
}

const clients = ['Claude Code', 'Cursor', 'VS Code (Copilot)'] as const;

function McpConfig() {
  const [client, setClient] = useState<(typeof clients)[number]>('Claude Code');
  const url = mcpUrl();
  const configs: Record<(typeof clients)[number], { label: string; code: string; note: string }> = {
    'Claude Code': {
      label: '터미널',
      code: `claude mcp add --transport http aha-design ${url}`,
      note: '프로젝트 폴더에서 한 번 실행합니다. 팀원과 같이 쓰려면 끝에 --scope project를 붙여 .mcp.json에 저장하세요.',
    },
    Cursor: {
      label: '.cursor/mcp.json',
      code: JSON.stringify({ mcpServers: { 'aha-design': { url } } }, null, 2),
      note: '프로젝트 폴더에 파일을 만들고 Cursor 설정의 MCP 목록에서 aha-design이 켜져 있는지 확인합니다.',
    },
    'VS Code (Copilot)': {
      label: '.vscode/mcp.json',
      code: JSON.stringify({ servers: { 'aha-design': { type: 'http', url } } }, null, 2),
      note: '파일을 저장한 뒤 Copilot 채팅을 에이전트 모드로 바꾸면 aha-design 도구를 쓸 수 있습니다.',
    },
  };
  const config = configs[client];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="에이전트 선택">
        {clients.map((c) => (
          <Chip key={c} selected={client === c} onClick={() => setClient(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <CodeBlock code={config.code} label={config.label} />
      <p className="text-body-sm text-muted-foreground">{config.note}</p>
    </div>
  );
}

const examplePrompts = [
  '사내 가이드 챗 템플릿을 바탕으로 "법무 상담 챗" 화면을 만들어 줘. 예시 질문은 계약서 검토 관련으로 바꿔 줘.',
  '관리자 대시보드 템플릿으로 우리 팀 서비스의 월별 사용량 화면을 만들어 줘. 통계 카드는 요청 수, 사용자 수, 실패율 세 개.',
  'DataTable과 Pagination으로 신청 내역 목록을 만들고, 상태 열은 Badge tone으로 표시해 줘.',
];

const tools = [
  ['list_components', '분류별 컴포넌트 목록'],
  ['search', '하고 싶은 일로 컴포넌트·템플릿 찾기'],
  ['get_component', '컴포넌트 설명, props, 예제 코드'],
  ['list_templates / get_template', '완성 화면 목록과 전체 소스'],
  ['get_tokens', '색·글자·모서리 토큰과 클래스'],
  ['get_setup_guide', '설치 방법과 UI 규칙'],
];

export function StartPage() {
  const { ui, tokens } = catalog.packages;
  const kits = catalog.kits.filter((k) => k.id !== 'core');
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-4">
        <h1 className="text-display font-bold tracking-tight">시작하기</h1>
        <p className="text-body text-muted-foreground">
          에이전트에 AHA 디자인 시스템을 한 번 연결해 두면, 갤러리에서 고른 컴포넌트와 화면을 같은 디자인으로 만들어 줍니다. 개발자가
          아니어도 1~2단계만 하면 됩니다.
        </p>
      </header>

      <section className="flex flex-col gap-8" aria-labelledby="agent">
        <h2 id="agent" className="text-title font-bold">
          에이전트로 쓰기
        </h2>
        <ol className="flex flex-col gap-10">
          <Step n={1} title="에이전트에 aha-design 연결">
            <p className="text-body text-muted-foreground">
              에이전트가 컴포넌트 사용법을 직접 찾아볼 수 있게 MCP 서버를 등록합니다. 쓰는 에이전트를 고르고 아래 내용을 붙여넣으세요.
            </p>
            <McpConfig />
          </Step>
          <Step n={2} title="갤러리에서 고르고 프롬프트 복사">
            <p className="text-body text-muted-foreground">
              컴포넌트나 화면 템플릿 페이지의 <strong>에이전트용 프롬프트 복사</strong>를 누르고, 에이전트에 붙여넣은 뒤 만들고 싶은 내용을
              적습니다. 이렇게 바로 말해도 됩니다.
            </p>
            <div className="flex flex-col gap-2">
              {examplePrompts.map((p) => (
                <Card key={p} padding="none" className="px-4 py-3 text-body-sm">
                  “{p}”
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" asChild>
                <Link href="/templates">
                  화면 템플릿 고르기
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/components">컴포넌트 보기</Link>
              </Button>
            </div>
          </Step>
          <Step n={3} title="에이전트가 쓰는 도구">
            <p className="text-body text-muted-foreground">연결하면 에이전트가 필요할 때 아래 도구를 스스로 호출합니다. 따로 부를 필요는 없습니다.</p>
            <Card padding="none" className="divide-y divide-border">
              {tools.map(([name, desc]) => (
                <div key={name} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-6">
                  <code className="w-64 shrink-0 font-mono text-body-sm font-semibold">{name}</code>
                  <span className="text-body-sm text-muted-foreground">{desc}</span>
                </div>
              ))}
            </Card>
          </Step>
        </ol>
      </section>

      <section className="flex flex-col gap-8" aria-labelledby="dev">
        <div className="flex flex-col gap-2">
          <h2 id="dev" className="text-title font-bold">
            개발자: 프로젝트에 설치
          </h2>
          <p className="text-body text-muted-foreground">React 19 + Vite + Tailwind CSS v4 프로젝트 기준입니다. 에이전트에게 맡기면 이 과정도 대신 합니다.</p>
        </div>
        <ol className="flex flex-col gap-10">
          <Step n={1} title="사내 레지스트리 등록">
            <p className="text-body text-muted-foreground">
              프로젝트 루트에 <code className="font-mono">.npmrc</code>를 만듭니다. @aha 패키지는 사내 Forgejo에서 받습니다.
            </p>
            <CodeBlock code={`@aha:registry=${registryUrl}`} label=".npmrc" />
          </Step>
          <Step n={2} title="패키지 설치">
            <CodeBlock
              code={`pnpm add ${ui.name}@^${ui.version} ${tokens.name}@^${tokens.version} lucide-react\npnpm add -D tailwindcss @tailwindcss/vite`}
              label="터미널"
            />
            {kits.length > 0 ? (
              <>
                <p className="text-body text-muted-foreground">
                  AI 서비스처럼 특정 업무 화면의 부품은 키트 패키지에 있습니다. 컴포넌트 페이지 제목 옆에 키트 이름이 보이면 그 키트를
                  함께 설치하세요.
                </p>
                <CodeBlock code={`pnpm add ${kits.map((k) => `${k.package.name}@^${k.package.version}`).join(' ')}`} label="터미널 (키트)" />
              </>
            ) : null}
          </Step>
          <Step n={3} title="Vite와 CSS 설정">
            <CodeBlock
              code={`import tailwindcss from '@tailwindcss/vite';\nimport react from '@vitejs/plugin-react';\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n});`}
              label="vite.config.ts"
            />
            <CodeBlock code={`@import "@aha/ui/styles.css";`} label="src/index.css" />
            <p className="text-body-sm text-muted-foreground">
              이 한 줄에 Tailwind, 디자인 토큰, Pretendard 서체, 다크 모드가 모두 들어 있습니다. <code className="font-mono">@import "tailwindcss"</code>를 따로 쓰지 않습니다.
              키트를 설치했다면 바로 다음 줄에 키트 CSS를 추가합니다.
            </p>
            {kits.length > 0 ? (
              <CodeBlock code={kits.map((k) => `@import "${k.package.name}/styles.css";`).join('\n')} label="src/index.css (키트)" />
            ) : null}
          </Step>
          <Step n={4} title="사용">
            <CodeBlock
              code={`import { Badge, Button } from '@aha/ui';\n\nexport function Example() {\n  return (\n    <div className="flex items-center gap-2 p-6">\n      <Button>보고서 조회</Button>\n      <Badge tone="warning">일부 품질 저하</Badge>\n    </div>\n  );\n}`}
              label="src/example.tsx"
            />
          </Step>
        </ol>
        <Callout title="규칙 요약">
          색은 <code className="font-mono">bg-primary</code>, <code className="font-mono">text-muted-foreground</code> 같은 토큰 클래스만,
          글자 크기는 <code className="font-mono">text-body</code> 같은 이름만 씁니다. 자세한 규칙은 에이전트가 get_setup_guide로 확인합니다.
        </Callout>
      </section>
    </div>
  );
}
