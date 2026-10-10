// 갤러리용 최소 라우터. 경로 몇 개뿐이라 라이브러리를 들이지 않는다.
import { type AnchorHTMLAttributes, type MouseEvent, useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};

export function useLocation() {
  const pathname = useSyncExternalStore(subscribe, () => window.location.pathname);
  const search = useSyncExternalStore(subscribe, () => window.location.search);
  return { pathname, search: new URLSearchParams(search) };
}

export function navigate(to: string, { replace = false, scroll = true } = {}) {
  if (replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (scroll) window.scrollTo({ top: 0 });
}

/** 같은 사이트 안의 링크. 새 탭 열기(⌘/Ctrl 클릭)는 브라우저에 맡긴다. */
export function Link({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href);
  };
  return <a href={href} onClick={handleClick} {...props} />;
}
