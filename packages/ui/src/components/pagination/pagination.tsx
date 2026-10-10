import { Button } from '../button/button';
import { cn } from '../../lib/cn';

export interface PaginationProps {
  /** 현재 페이지 (1부터). */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** "1 / 3 페이지" + 이전 · 다음 (15쪽). 표 아래 오른쪽에 둔다. */
export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  const total = Math.max(pageCount, 1);
  return (
    <nav data-slot="pagination" aria-label="페이지" className={cn('flex items-center gap-3', className)}>
      <span className="text-body-sm text-muted-foreground" aria-live="polite">
        {page} / {total} 페이지
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="border-border" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          이전
        </Button>
        <Button variant="secondary" size="sm" className="border-border" disabled={page >= total} onClick={() => onPageChange(page + 1)}>
          다음
        </Button>
      </div>
    </nav>
  );
}
