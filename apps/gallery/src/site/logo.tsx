import { site } from '../../site.config';

/** 디자인 시스템 로고 (site.config의 logo). 이모지면 글자로, SVG면 primary 색 아이콘으로 그린다. 장식이라 스크린리더에는 숨긴다. */
export function SiteLogo({ className }: { className?: string }) {
  if ('emoji' in site.logo) {
    return (
      <span aria-hidden className={className}>
        {site.logo.emoji}
      </span>
    );
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['size-[1.25em] text-primary', className].filter(Boolean).join(' ')}
      // 설정 파일에 적힌 아이콘 모양(path 등)만 넣는다. 사용자 입력이 아니다.
      dangerouslySetInnerHTML={{ __html: site.logo.svg }}
    />
  );
}
