// 갤러리 사이트 + MCP 서버. Docker 이미지 하나로 띄운다.
//   /            갤러리 (dist, SPA)
//   /mcp         MCP Streamable HTTP (stateless)
//   /storybook/  개발자용 Storybook 정적 빌드
//   /catalog.json  갤러리·MCP가 쓰는 데이터
import { existsSync, readFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { fileURLToPath } from 'node:url';

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import sirv from 'sirv';

import type { Catalog } from '../src/catalog-types.ts';
import { createMcpServer } from './mcp.ts';

const port = Number(process.env.PORT ?? 4100);
const publicUrl = (process.env.PUBLIC_URL ?? `http://localhost:${port}`).replace(/\/$/, '');
const registry = process.env.NPM_REGISTRY ?? 'http://localhost:3000/api/packages/aha/npm/';
const path = (env: string | undefined, fallback: string) => env ?? fileURLToPath(new URL(fallback, import.meta.url));

const catalogPath = path(process.env.CATALOG_PATH, '../generated/catalog.json');
const galleryDir = path(process.env.GALLERY_DIR, '../dist');
const storybookDir = path(process.env.STORYBOOK_DIR, '../../../packages/ui/storybook-static');

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as Catalog;
const ctx = { catalog, publicUrl, registry };

const notFound = (_req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
};
// 빌드 결과가 없으면(MCP만 띄울 때) 해당 경로는 404로 둔다.
const staticDir = (dir: string, options: Parameters<typeof sirv>[1]) => (existsSync(dir) ? sirv(dir, options) : notFound);
const gallery = staticDir(galleryDir, { single: true, etag: true });
const storybook = staticDir(storybookDir, { etag: true });

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (url.pathname === '/mcp') {
    if (req.method !== 'POST') {
      // stateless 서버라 GET(SSE 구독)과 DELETE(세션 종료)는 지원하지 않는다.
      res.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed.' }, id: null }));
      return;
    }
    const mcp = createMcpServer(ctx);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on('close', () => {
      void transport.close();
      void mcp.close();
    });
    try {
      await mcp.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error('MCP 요청 처리 실패', error);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null }));
      }
    }
    return;
  }

  if (url.pathname === '/catalog.json') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(catalog));
    return;
  }

  if (url.pathname === '/storybook') {
    res.writeHead(301, { Location: '/storybook/' });
    res.end();
    return;
  }
  if (url.pathname.startsWith('/storybook/')) {
    req.url = req.url!.slice('/storybook'.length);
    storybook(req, res, () => notFound(req, res));
    return;
  }

  gallery(req, res);
});

server.listen(port, () => {
  console.log(`AHA 디자인 갤러리: ${publicUrl}`);
  console.log(`MCP: ${publicUrl}/mcp`);
});
