# AHA 디자인 갤러리 + MCP 서버 + Storybook 정적 빌드를 한 이미지로 만든다.
#   docker compose up -d --build   →  http://localhost:4100 (갤러리), /mcp (MCP), /storybook/
FROM node:24-bookworm-slim AS build
WORKDIR /repo
RUN corepack enable
# 의존성 레이어: lockfile이 바뀔 때만 다시 받는다.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch
COPY . .
RUN pnpm install --frozen-lockfile --offline
# 패키지 레지스트리. 갤러리 화면(.npmrc 안내)과 MCP 설치 안내에 함께 들어간다. 비우면 site.config.ts의 registry.
ARG NPM_REGISTRY=
ENV VITE_NPM_REGISTRY=$NPM_REGISTRY \
    STORYBOOK_DISABLE_TELEMETRY=1
RUN pnpm build-storybook && pnpm --filter @aha/gallery build
# 서버 실행에 필요한 것만 모은다 (prod 의존성: MCP SDK, sirv, zod).
RUN pnpm --filter @aha/gallery deploy --prod --legacy /out \
 && cp -r apps/gallery/dist apps/gallery/generated /out/ \
 && cp -r packages/ui/storybook-static /out/storybook

FROM node:24-bookworm-slim
WORKDIR /app
ARG NPM_REGISTRY=
ENV NODE_ENV=production \
    PORT=4100 \
    NPM_REGISTRY=$NPM_REGISTRY \
    GALLERY_DIR=/app/dist \
    STORYBOOK_DIR=/app/storybook \
    CATALOG_PATH=/app/generated/catalog.json
COPY --from=build /out /app
USER node
EXPOSE 4100
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch(`http://localhost:${process.env.PORT}/healthz`).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "server/index.ts"]
