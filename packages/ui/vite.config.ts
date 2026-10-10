import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // 스토리에서 다른 컴포넌트를 패키지 이름으로 import하기 위한 자기 참조.
      // Storybook MCP 예제 코드가 상대 경로 대신 `@aha/ui`를 보여주게 한다 (AGENTS.md 참고). styles.css는 건드리지 않는다.
      { find: /^@aha\/ui$/, replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
      // 키트 스토리(packages/kit-*)도 같은 Storybook에서 그린다. 키트는 @aha/ui에 의존하므로 package.json 의존성 대신 별칭으로 잇는다.
      { find: /^@aha\/(kit-[a-z0-9-]+)$/, replacement: fileURLToPath(new URL('../$1/src/index.ts', import.meta.url)) },
    ],
    // 키트 패키지의 react가 다른 사본으로 풀리지 않게 한다.
    dedupe: ['react', 'react-dom'],
  },
});
