import { cn } from '@/lib/cn';

export interface InfoSummaryItem {
  label: string;
  value: string;
}

export interface InfoSummaryProps {
  /** 2~3개의 읽기 전용 정보. 예: 수신 이메일, 발송 주기 (14쪽). */
  items: InfoSummaryItem[];
  className?: string;
}

/** "라벨 값 | 라벨 값" 한 줄 요약 카드 (14쪽 뉴스레터의 수신 이메일 · 발송 주기). 고칠 수 없는 정보를 보여준다. */
export function InfoSummary({ items, className }: InfoSummaryProps) {
  return (
    <dl
      data-slot="info-summary"
      className={cn('flex flex-wrap items-center gap-y-2 rounded-lg border border-border px-6 py-4', className)}
    >
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn('flex min-w-0 flex-1 items-center gap-4', index > 0 && 'sm:ml-6 sm:border-l sm:border-border sm:pl-6')}
        >
          <dt className="shrink-0 text-body text-muted-foreground">{item.label}</dt>
          <dd className="truncate text-body font-semibold text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
