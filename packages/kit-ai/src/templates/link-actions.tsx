// 스토리 전용: 템플릿 안의 해시 링크(#...)를 실제로 이동시키지 않고 Storybook Actions 패널에 기록한다.
// 템플릿은 화면 구성 예시라 링크 대상 화면이 없다. 이동을 막지 않으면 URL만 바뀌고 화면은 그대로여서 고장처럼 보인다.
import type { Decorator } from '@storybook/react-vite';
import type { MouseEvent } from 'react';
import { action } from 'storybook/actions';

const logLink = action('링크 클릭');

/**
 * @param passThrough 실제로 처리하는 해시 접두사. 예: GuideChatScreen은 `#guide-chat/<id>`로 대화를 전환한다.
 */
export function withLinkActions(passThrough: string[] = []): Decorator {
  return (Story) => {
    const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';
      if (passThrough.some((prefix) => href.startsWith(prefix))) return;
      event.preventDefault();
      logLink({ href, label: anchor.textContent?.trim() || anchor.getAttribute('aria-label') || '' });
    };

    return (
      <div className="contents" onClickCapture={handleClickCapture}>
        <Story />
      </div>
    );
  };
}
