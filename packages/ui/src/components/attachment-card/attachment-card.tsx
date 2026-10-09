import { FileText, Mic, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/button/button';
import { cn } from '@/lib/cn';

export interface AttachmentCardProps {
  /** 파일 이름. 예: "용역계약서.pdf". */
  name: string;
  /** 크기와 분량. 예: "2.1MB · 18쪽", "48MB · 32분". */
  meta?: string;
  /** 아이콘 종류. `audio`는 마이크, `document`는 문서 아이콘. 다른 아이콘이 필요하면 `icon`을 쓴다. */
  kind?: 'audio' | 'document';
  icon?: ReactNode;
  /** 보내기 전 첨부를 지울 때. 생략하면 삭제 버튼을 숨긴다. */
  onRemove?: () => void;
  className?: string;
}

/**
 * 첨부 파일 카드. 사용자 메시지 위에 붙는다 (11쪽 녹음 파일, 13쪽 계약서).
 * 사용자 메시지 안에서는 오른쪽 정렬된다.
 */
export function AttachmentCard({ name, meta, kind = 'document', icon, onRemove, className }: AttachmentCardProps) {
  return (
    <div
      data-slot="attachment-card"
      className={cn(
        'flex w-fit max-w-sm items-center gap-3 rounded-lg border border-border bg-background py-3 pr-3 pl-4',
        className,
      )}
    >
      <span aria-hidden className="text-foreground [&_svg]:size-5">
        {icon ?? (kind === 'audio' ? <Mic /> : <FileText />)}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-body-sm font-semibold text-foreground">{name}</span>
        {meta ? <span className="text-caption text-muted-foreground">{meta}</span> : null}
      </span>
      {onRemove ? (
        <Button variant="ghost" size="icon" aria-label={`${name} 첨부 삭제`} onClick={onRemove} className="size-7 [&_svg]:size-4">
          <X />
        </Button>
      ) : null}
    </div>
  );
}
