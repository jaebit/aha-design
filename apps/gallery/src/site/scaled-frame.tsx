// 전체 화면 템플릿을 작은 칸에 축소해서 보여주는 iframe. 1280×800 화면을 칸 너비에 맞춰 줄인다.
import { cn } from '@actoz/ui';
import { useEffect, useRef, useState } from 'react';

interface ScaledFrameProps {
  src: string;
  title: string;
  /** 원래 화면 크기. */
  width?: number;
  height?: number;
  /** 썸네일은 클릭·포커스를 막는다. */
  interactive?: boolean;
  className?: string;
}

export function ScaledFrame({ src, title, width = 1280, height = 800, interactive = false, className }: ScaledFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale((entry?.contentRect.width ?? 0) / width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={ref}
      className={cn('relative w-full overflow-hidden bg-background', className)}
      style={{ aspectRatio: `${width} / ${height}` }}
      inert={!interactive}
    >
      {scale > 0 ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          tabIndex={interactive ? undefined : -1}
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ width, height, transform: `scale(${scale})` }}
        />
      ) : null}
    </div>
  );
}
