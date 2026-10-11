import catalogJson from '../../generated/catalog.json';
import { site } from '../../site.config';
import type { Catalog } from '../catalog-types';

export const catalog = catalogJson as unknown as Catalog;

export const findComponent = (slug: string) => catalog.components.find((c) => c.slug === slug);
export const findTemplate = (slug: string) => catalog.templates.find((t) => t.slug === slug);
export const categoryLabel = (id: string) => catalog.categories.find((c) => c.id === id)?.label ?? id;

/** MCP 엔드포인트. 갤러리와 같은 서버에서 제공한다. */
export const mcpUrl = () => `${window.location.origin}/mcp`;

/** 패키지 npm 레지스트리. 빌드할 때 VITE_NPM_REGISTRY로 바꾼다 (Docker는 빌드 인자 NPM_REGISTRY). 비어 있으면 site.config. */
export const registryUrl: string = import.meta.env.VITE_NPM_REGISTRY || site.registry;

/**
 * Storybook iframe 주소. 전체 화면 미리보기에 쓴다.
 * density·brand를 생략하면 스토리의 기본값(parameters.density·parameters.brand)을 따른다.
 * embed=gallery: iframe 안의 스크립트가 갤러리 페이지의 포커스를 빼앗지 못하게 한다 (.storybook/preview.tsx).
 */
export const storyFrameUrl = (storyId: string, theme: 'light' | 'dark', density?: 'default' | 'compact', brand?: string) =>
  `/storybook/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story&embed=gallery&globals=theme:${theme}${density ? `;density:${density}` : ''}${brand ? `;brand:${brand}` : ''}`;
