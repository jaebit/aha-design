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
  },
  initialGlobals: { theme: 'system' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as 'system' | 'light' | 'dark';
      useEffect(() => {
        const root = document.documentElement;
        if (theme === 'system') delete root.dataset.theme;
        else root.dataset.theme = theme;
      }, [theme]);
      return (
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      );
    },
  ],
};

export default preview;
