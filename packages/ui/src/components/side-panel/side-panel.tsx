import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '../button/button';
import { cn } from '../../lib/cn';

export interface SidePanelProps {
  /** 패널 제목. 예: "10/03 처리 메일 급증 원인". */
  title: string;
  /** 제목 앞 배지. 예: `<Badge>ITH</Badge>` (16쪽). */
  badge?: ReactNode;
  /** 닫기. 생략하면 닫기 버튼을 숨긴다. */
  onClose?: () => void;
  /** 하단 고정 영역. 버튼이나 입력창을 둔다. 대화 패널이면 AI 키트의 `<Composer variant="compact">`. */
  footer?: ReactNode;
  /** 본문. 항목 상세나 메시지 목록. */
  children: ReactNode;
  className?: string;
}

/**
 * 본문 오른쪽에 붙는 보조 패널 (16쪽 ITH).
 * 목록을 보면서 항목 상세를 띄우거나, 데이터를 보면서 AI에게 묻는 대화 패널로 쓴다. 모달이 아니라 본문과 나란히 놓이는
 * 분할 화면이므로, AppShell 본문 안에서 `flex` 행의 마지막 요소로 둔다. 대화 패널 예시는 ITH 보고서 템플릿에 있다.
 */
export function SidePanel({ title, badge, onClose, footer, children, className }: SidePanelProps) {
  return (
    <aside
      data-slot="side-panel"
      aria-label={title}
      className={cn('flex h-full w-110 shrink-0 flex-col border-l border-border bg-background', className)}
    >
      <div className="flex h-20 shrink-0 items-center gap-2 border-b border-border px-6">
        {badge}
        <h2 className="min-w-0 flex-1 truncate text-heading font-semibold">{title}</h2>
        {onClose ? (
          <Button variant="ghost" size="icon" aria-label="패널 닫기" onClick={onClose}>
            <X />
          </Button>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
      {footer ? <div className="shrink-0 border-t border-border px-4 py-4">{footer}</div> : null}
    </aside>
  );
}
