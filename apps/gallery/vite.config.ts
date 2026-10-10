import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import sirv from 'sirv';
import { defineConfig, type Plugin } from 'vite';

import { site } from './site.config.ts';

const uiRoot = fileURLToPath(new URL('../../packages/ui/', import.meta.url));

// 개발 서버에서도 운영 서버(server/index.ts)처럼 /storybook/에 Storybook 정적 빌드를 붙인다.
// 템플릿과 전체 화면 컴포넌트 미리보기가 Storybook iframe을 쓴다.
// index.html의 제목, 설명, 파비콘을 site.config에서 채운다.
function siteHead(): Plugin {
  const icon =
    'emoji' in site.logo
      ? `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${site.logo.emoji}</text></svg>`
      : `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${site.faviconColor.replace('#', '')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${site.logo.svg.replace(/"/g, "'")}</svg>`;
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return {
    name: 'gallery-site-head',
    transformIndexHtml: (html) =>
      html
        .replace('%SITE_TITLE%', escape(site.title))
        .replace('%SITE_DESCRIPTION%', escape(site.description))
        .replace('%SITE_ICON%', `data:image/svg+xml,${icon}`),
  };
}

function storybookStatic(): Plugin {
  return {
    name: 'gallery-storybook-static',
    configureServer(server) {
      const serve = sirv(`${uiRoot}storybook-static`, { dev: true });
      server.middlewares.use('/storybook', (req, res, next) => serve(req, res, next));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteHead(), storybookStatic()],
  resolve: {
    alias: [
      // 스토리 파일이 쓰는 패키지 참조 (packages/ui/vite.config.ts와 같다). <범위>/ui/styles.css는 건드리지 않는다.
      { find: new RegExp(`^${site.scope}/ui$`), replacement: `${uiRoot}src/index.ts` },
      { find: new RegExp(`^${site.scope}/(kit-[a-z0-9-]+)$`), replacement: `${uiRoot}../$1/src/index.ts` },
      // 갤러리는 스토리를 직접 렌더링한다. Storybook 런타임 대신 가벼운 대체 구현을 쓴다.
      { find: /^storybook\/test$/, replacement: fileURLToPath(new URL('./src/shims/storybook-test.ts', import.meta.url)) },
      { find: /^storybook\/actions$/, replacement: fileURLToPath(new URL('./src/shims/storybook-actions.ts', import.meta.url)) },
    ],
    // 키트 패키지의 react가 다른 사본으로 풀리지 않게 한다.
    dedupe: ['react', 'react-dom'],
  },
  // 카탈로그(약 170kB)를 번들에 넣기 때문에 기본 경고 기준(500kB)을 넘는다. 사내용이라 한 번에 받는다.
  build: { chunkSizeWarningLimit: 800 },
  server: { port: site.devPort },
});
