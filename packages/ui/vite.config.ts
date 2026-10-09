import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 스토리에서 다른 컴포넌트를 패키지 이름으로 import하기 위한 자기 참조.
      // Storybook MCP 예제 코드가 상대 경로 대신 `@aha/ui`를 보여주게 한다 (AGENTS.md 참고).
      '@aha/ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
});
