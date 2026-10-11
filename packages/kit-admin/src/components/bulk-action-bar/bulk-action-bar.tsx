import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button, cn } from '@aha/ui';

export interface BulkActionBarProps {
  /** 고른 항목 수. 0이면 줄을 숨긴다 (선택 수 알림 영역은 남는다). */
  selectedCount: number;
  /** 고른 항목의 단위. 기본 "개". 예: 사용자 목록은 "명" → "3명 선택됨", 클라이언트 목록은 "개". */
  unit?: string;
  /** 선택 해제. */
  onClear: () => void;
  /**
   * 일괄 작업 버튼들. `Button size="sm"`. 예: 역할 변경, 초대 다시 보내기, 잠금 해제, 비활성화.
   * 되돌릴 수 없는 작업은 `variant="destructive"`로 맨 뒤에 두고 ConfirmDialog로 한 번 더 묻는다.
   */
  children: ReactNode;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

/**
 * 목록에서 여러 행을 고르면 표 위에 나타나는 일괄 작업 줄.
 * DataTable의 `selectedIds`와 함께 쓴다. 고른 수와 선택 해제를 항상 보여준다.
 */
export function BulkActionBar({ selectedCount, unit = '개', onClear, children, className }: BulkActionBarProps) {
  return (
    <>
      {/* 선택 수 알림은 선택이 없어도 같은 자리에 둔다. 내용과 함께 처음 그려진 live 영역은 스크린리더가 읽지 않는다. */}
      <span aria-live="polite" className="sr-only">
        {selectedCount > 0 ? `${selectedCount}${unit} 선택됨` : ''}
      </span>
      {selectedCount > 0 ? (
        <div
          data-slot="bulk-action-bar"
          role="region"
          aria-label="일괄 작업"
          className={cn('flex flex-wrap items-center gap-3 rounded-lg border border-border-strong bg-subtle px-4 py-2', className)}
        >
          <span aria-hidden className="text-body font-semibold text-foreground">
            {selectedCount}
            {unit} 선택됨
          </span>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X aria-hidden />
            선택 해제
          </Button>
          <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>
        </div>
      ) : null}
    </>
  );
}
