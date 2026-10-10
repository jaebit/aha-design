# AHA 디자인 갤러리 + MCP 서버 + Storybook 정적 빌드를 한 이미지로 만든다.
#   docker compose up -d --build   →  http://localhost:4100 (갤러리), /mcp (MCP), /storybook/
FROM node:24-bookworm-slim AS build
WORKDIR /repo
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile
ARG VITE_NPM_REGISTRY=http://localhost:3000/api/packages/aha/npm/
ENV VITE_NPM_REGISTRY=$VITE_NPM_REGISTRY \
    STORYBOOK_DISABLE_TELEMETRY=1
RUN pnpm build-storybook && pnpm --filter @aha/gallery build
# 서버 실행에 필요한 것만 모은다 (prod 의존성: MCP SDK, sirv, zod).
RUN pnpm --filter @aha/gallery deploy --prod --legacy /out \
 && cp -r apps/gallery/dist apps/gallery/generated /out/ \
 && cp -r packages/ui/storybook-static /out/storybook

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4100 \
    GALLERY_DIR=/app/dist \
    STORYBOOK_DIR=/app/storybook \
    CATALOG_PATH=/app/generated/catalog.json
COPY --from=build /out /app
USER node
EXPOSE 4100
CMD ["node", "server/index.ts"]
