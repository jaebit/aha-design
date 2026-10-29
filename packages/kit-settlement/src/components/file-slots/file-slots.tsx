import type { ComponentProps } from 'react';

import { cn } from '@actoz/ui';

export interface FileSlot {
  /** 자료 이름 (예: "계약서"). */
  name: string;
  /** 수령 여부. */
  received: boolean;
}

export interface FileSlotsProps extends Omit<ComponentProps<'section'>, 'title'> {
  /** 목록 제목 (예: "필수 자료"). */
  title: string;
  /** 필수 자료 목록. 머리의 "필수 n/m"은 이 목록에서 계산한다. */
  slots: FileSlot[];
}

/**
 * 필수 자료 목록과 수령 현황. 수령한 자료는 "✓ 이름", 못 받은 자료는 점선 테두리와 "이름 미수령"으로 보인다.
 */
export function FileSlots({ className, title, slots, ...props }: FileSlotsProps) {
  const received = slots.filter((slot) => slot.received).length;
  return (
    <section data-slot="file-slots" className={cn('flex flex-col gap-2', className)} {...props}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body font-semibold">{title}</h3>
        <span className="text-body-sm tabular-nums text-muted-foreground">
          필수 {received}/{slots.length}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {slots.map((slot) => (
          <li
            key={slot.name}
            data-received={slot.received}
            className={cn(
              'rounded-md border px-3 py-2 text-body-sm',
              slot.received ? 'border-border bg-card text-status-good-foreground' : 'border-dashed border-border-strong text-muted-foreground',
            )}
          >
            {slot.received ? `✓ ${slot.name}` : `${slot.name} 미수령`}
          </li>
        ))}
      </ul>
    </section>
  );
}
