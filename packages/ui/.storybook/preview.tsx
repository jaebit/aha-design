import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';

import { TooltipProvider } from '../src/components/tooltip/tooltip';
import './preview.css';

// 갤러리가 미리보기 iframe에 embed=gallery를 붙인다. 이때 iframe 안의 스크립트가 바깥 페이지의 포커스를 빼앗지 못하게 한다.
// 예: 열린 DropdownMenu 예제는 바깥에서 다른 메뉴를 열면 닫히면서 자기 트리거로 포커스를 옮기고,
// 바깥 창이 포커스를 잃어 바깥 메뉴까지 닫혔다. iframe 안을 직접 누른 뒤(문서에 포커스가 있을 때)의 포커스 이동은 그대로 둔다.
if (new URLSearchParams(window.location.search).get('embed') === 'gallery') {
  const focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function (this: HTMLElement, options?: FocusOptions) {
    if (document.hasFocus()) focus.call(this, options);
  };
}

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
    // 브랜드 전환. <html data-brand="iam">이면 primary·ring이 IAM 파랑이 된다 (tokens/themes/brand-iam.json).
    // "스토리 기본값"은 스토리의 parameters.brand를 따른다. 컴포넌트는 브랜드를 몰라야 하므로, 모든 스토리를 두 브랜드로 볼 수 있다.
    brand: {
      description: '브랜드',
      toolbar: {
        title: '브랜드',
        icon: 'paintbrush',
        items: [
          { value: 'auto', title: '스토리 기본값' },
          { value: 'aha', title: 'AHA' },
          { value: 'iam', title: 'IAM' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'system', density: 'auto', brand: 'auto' },
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
      const chosenBrand = context.globals.brand as 'auto' | 'aha' | 'iam' | undefined;
      const brand = !chosenBrand || chosenBrand === 'auto' ? (context.parameters.brand as string | undefined) : chosenBrand;
      useEffect(() => {
        const root = document.documentElement;
        // AHA는 기본값이라 속성을 달지 않는다.
        if (brand && brand !== 'aha') root.dataset.brand = brand;
        else delete root.dataset.brand;
      }, [brand]);
      return (
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      );
    },
  ],
};

export default preview;
