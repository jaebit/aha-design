import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button, cn } from '@actoz/ui';

import { exceptionKindOf, ExceptionBadge } from '../exception-badge/exception-badge';

export interface JudgmentItem {
  /** 예외 코드 (E01~E14). */
  code: string;
  /** 상황 문장. */
  situation: string;
  /** 동작 버튼. 진행 불가 줄에는 해제·무시 버튼을 두지 않는다. label에 원인을 풀 방법을 적는다 (예: "계약서 올리기"). */
  action?: { label: string; onClick?: () => void };
  /** 처리 기록. 있으면 줄을 지우지 않고 "처리됨 · 확인자 · 시각"으로 보이고 버튼은 숨긴다. */
  resolved?: { by: string; at: string };
}

export interface JudgmentSummaryProps extends Omit<ComponentProps<'section'>, 'children'> {
  /** 예외 목록. 비어 있으면 "예외 없음", 진행 불가가 하나라도 있으면 "진행 불가 n건", 아니면 "예외 n건". */
  items: JudgmentItem[];
}

/**
 * 결과 화면 맨 위의 판정 상자. 예외 목록에서 판정을 정해 제목에 보이고, 줄마다 코드·상황·동작을 놓는다.
 * 처리된 줄도 지우지 않고 처리 기록과 함께 남긴다.
 */
export function JudgmentSummary({ className, items, ...props }: JudgmentSummaryProps) {
  const blocked = items.some((item) => exceptionKindOf(item.code) === 'block');
  const tone = items.length === 0 ? 'done' : blocked ? 'block' : 'attend';
  const head = {
    done: { Icon: CircleCheck, title: '✓ 예외 없음', box: 'border-status-good', text: 'text-status-good-foreground', mark: 'text-status-good' },
    block: {
      Icon: CircleX,
      title: `진행 불가 ${items.length}건`,
      box: 'border-status-critical',
      text: 'text-status-critical-foreground',
      mark: 'text-status-critical',
    },
    attend: {
      Icon: TriangleAlert,
      title: `예외 ${items.length}건`,
      box: 'border-status-warning',
      text: 'text-status-warning-foreground',
      mark: 'text-status-warning',
    },
  }[tone];

  return (
    <section
      data-slot="judgment-summary"
      data-variant={tone}
      className={cn('flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground', head.box, className)}
      {...props}
    >
      <h2 className={cn('flex items-center gap-2 text-heading font-semibold', head.text)}>
        <head.Icon aria-hidden className={cn('size-5 shrink-0', head.mark)} />
        {head.title}
      </h2>
      {items.length > 0 ? (
        <ul className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <li key={item.code} className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
              <ExceptionBadge code={item.code}>{item.situation}</ExceptionBadge>
              {item.resolved ? (
                <span className="text-caption text-muted-foreground">
                  처리됨 · {item.resolved.by} · {item.resolved.at}
                </span>
              ) : item.action ? (
                <Button size="sm" variant="secondary" onClick={item.action.onClick}>
                  {item.action.label}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
