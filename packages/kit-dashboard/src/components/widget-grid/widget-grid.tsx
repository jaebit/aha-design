import type { ReactNode } from 'react';

import { Card, cn } from '@actoz/ui';

export interface WidgetGridProps {
  /** Widget 목록. 왼쪽 위부터 채운다. */
  children: ReactNode;
  className?: string;
}

/**
 * 대시보드 위젯 배치. 넓은 화면 4열, 중간 2열, 좁은 화면 1열로 바뀐다.
 * 위젯 폭은 각 Widget의 `span`으로 정한다.
 */
export function WidgetGrid({ children, className }: WidgetGridProps) {
  return (
    <div data-slot="widget-grid" className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4', className)}>
      {children}
    </div>
  );
}

const spanClass = {
  1: '',
  2: 'md:col-span-2',
  3: 'md:col-span-2 xl:col-span-3',
  4: 'md:col-span-2 xl:col-span-4',
} as const;

export interface WidgetProps {
  /** 위젯 제목. 예: "일별 활성 사용자". */
  title: string;
  /** 제목 아래 한 줄 설명. 기준이나 단위. 예: "로그인한 사용자 수, 하루 기준". */
  description?: string;
  /** 오른쪽 위 작은 동작. 예: `<Button variant="ghost" size="sm">자세히</Button>`. */
  action?: ReactNode;
  /** 넓은 화면에서 차지할 열 수 (4열 중). 기본 1. 차트는 2 이상을 권한다. */
  span?: 1 | 2 | 3 | 4;
  /** 위젯 본문. 차트, 표, BarList 등. */
  children: ReactNode;
  /** 아래 보조 문구. 예: "10/10 09:00 기준". */
  footer?: ReactNode;
  className?: string;
}

/** 대시보드 위젯 한 칸. 제목·설명·동작이 있는 카드이며 WidgetGrid 안에 둔다. 숫자 하나는 StatCard(공통)를 그대로 쓴다. */
export function Widget({ title, description, action, span = 1, children, footer, className }: WidgetProps) {
  return (
    <Card data-slot="widget" className={cn('flex min-w-0 flex-col gap-4', spanClass[span], className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="text-heading font-semibold text-foreground">{title}</h2>
          {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
      {footer ? <p className="text-caption text-muted-foreground">{footer}</p> : null}
    </Card>
  );
}
