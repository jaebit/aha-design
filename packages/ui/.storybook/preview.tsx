import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';

import { TooltipProvider } from '../src/components/tooltip/tooltip';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
  // 툴바의 테마 전환. 앱과 같은 방식으로 <html data-theme>를 바꾼다. "시스템"은 OS 설정을 따른다.
  globalTypes: {
    theme: {
      description: '테마',
      toolbar: {
        title: '테마',
        icon: 'contrast',
        items: [
          { value: 'system', title: '시스템 설정' },
          { value: 'light', title: '라이트' },
          { value: 'dark', title: '다크' },
        ],
        dynamicTitle: true,
      },
    },
    // 밀도 전환. <html data-density="compact">로 간격 단위(--spacing)를 줄인다.
    // "스토리 기본값"은 스토리의 parameters.density를 따른다 (관리자 템플릿은 compact). 갤러리는 URL globals로 직접 고른다.
    density: {
      description: '밀도',
      toolbar: {
        title: '밀도',
        icon: 'component',
        items: [
          { value: 'auto', title: '스토리 기본값' },
          { value: 'default', title: '기본' },
          { value: 'compact', title: '촘촘하게' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'system', density: 'auto' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as 'system' | 'light' | 'dark';
      useEffect(() => {
        const root = document.documentElement;
        if (theme === 'system') delete root.dataset.theme;
        else root.dataset.theme = theme;
      }, [theme]);
      const chosen = context.globals.density as 'auto' | 'default' | 'compact' | undefined;
      const density = !chosen || chosen === 'auto' ? (context.parameters.density as string | undefined) : chosen;
      useEffect(() => {
        const root = document.documentElement;
        if (density === 'compact') root.dataset.density = 'compact';
        else delete root.dataset.density;
      }, [density]);
      return (
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      );
    },
  ],
};

export default preview;
