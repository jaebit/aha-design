import { cn } from '@actoz/ui';

import { CopyButton } from './copy-button';

interface CodeBlockProps {
  code: string;
  /** 코드 위에 보이는 작은 제목 (예: 파일 이름, 언어). */
  label?: string;
  className?: string;
  maxHeight?: number;
}

export function CodeBlock({ code, label, className, maxHeight }: CodeBlockProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-subtle', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <span className="font-mono text-caption text-muted-foreground">{label}</span>
        <CopyButton value={code} variant="ghost" />
      </div>
      <pre className="overflow-auto p-4 font-mono text-body-sm leading-relaxed" style={{ maxHeight }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
