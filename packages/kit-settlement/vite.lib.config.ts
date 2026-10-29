// 배포용 라이브러리 빌드 (dist/index.js). @actoz/ui의 vite.lib.config.ts와 같다.
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

// 의존성과 peer 의존성(@actoz/ui 포함)은 번들에 넣지 않는다. 하위 경로(react/jsx-runtime 등)도 함께 뺀다.
const externals = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)];

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    // 사용하는 앱이 다시 압축한다. 디버깅을 위해 이름을 남긴다.
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: (id) => externals.some((name) => id === name || id.startsWith(`${name}/`)),
    },
  },
});
