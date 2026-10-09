import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    // 컴포넌트 manifest를 만들고 http://localhost:6006/mcp 로 에이전트에 노출한다.
    '@storybook/addon-mcp',
  ],
  typescript: {
    // props 설명(JSDoc)과 유니온 타입을 manifest에 정확히 싣기 위해 react-docgen-typescript를 쓴다.
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
