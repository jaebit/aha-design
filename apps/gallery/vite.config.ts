import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import sirv from 'sirv';
import { defineConfig, type Plugin } from 'vite';

const uiRoot = fileURLToPath(new URL('../../packages/ui/', import.meta.url));

// 개발 서버에서도 운영 서버(server/index.ts)처럼 /storybook/에 Storybook 정적 빌드를 붙인다.
// 템플릿과 전체 화면 컴포넌트 미리보기가 Storybook iframe을 쓴다.
function storybookStatic(): Plugin {
  return {
    name: 'aha-storybook-static',
    configureServer(server) {
      const serve = sirv(`${uiRoot}storybook-static`, { dev: true });
      server.middlewares.use('/storybook', (req, res, next) => serve(req, res, next));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), storybookStatic()],
  resolve: {
    alias: [
      // 스토리 파일이 쓰는 자기 참조 (packages/ui/vite.config.ts와 같다). @aha/ui/styles.css는 건드리지 않는다.
      { find: /^@aha\/ui$/, replacement: `${uiRoot}src/index.ts` },
      // 갤러리는 스토리를 직접 렌더링한다. Storybook 런타임 대신 가벼운 대체 구현을 쓴다.
      { find: /^storybook\/test$/, replacement: fileURLToPath(new URL('./src/shims/storybook-test.ts', import.meta.url)) },
      { find: /^storybook\/actions$/, replacement: fileURLToPath(new URL('./src/shims/storybook-actions.ts', import.meta.url)) },
    ],
  },
  // 카탈로그(약 170kB)를 번들에 넣기 때문에 기본 경고 기준(500kB)을 넘는다. 사내용이라 한 번에 받는다.
  build: { chunkSizeWarningLimit: 800 },
  server: { port: 5180 },
});
