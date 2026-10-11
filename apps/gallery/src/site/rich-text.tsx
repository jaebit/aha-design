// JSDoc 설명을 화면에 옮긴다. `코드`, - 목록, 빈 줄 문단만 처리한다.
import { cn } from '@actoz/ui';
import { Fragment, type ReactNode } from 'react';

function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={i} className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push(<p key={blocks.length}>{inline(paragraph.join(' '))}</p>);
    if (list.length)
      blocks.push(
        <ul key={blocks.length} className="flex list-disc flex-col gap-1 pl-5">
          {list.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>,
      );
    paragraph = [];
    list = [];
  };
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) flush();
    else if (trimmed.startsWith('- ')) {
      if (paragraph.length) flush();
      list.push(trimmed.slice(2));
    } else {
      if (list.length) flush();
      paragraph.push(trimmed);
    }
  }
  flush();
  return <div className={cn('flex flex-col gap-3', className)}>{blocks}</div>;
}
