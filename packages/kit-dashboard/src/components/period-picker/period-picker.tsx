import { useId } from 'react';

import { Chip, cn, Input } from '@aha/ui';

export type PeriodPreset = 'today' | '7d' | '30d' | 'month' | 'custom';

export interface Period {
  preset: PeriodPreset;
  /** 시작일 `YYYY-MM-DD`. */
  from: string;
  /** 종료일 `YYYY-MM-DD` (포함). */
  to: string;
}

export interface PeriodPickerProps {
  value: Period;
  /** 프리셋을 누르면 기간을 계산해서, 직접 입력이면 입력한 날짜로 부른다. */
  onChange: (value: Period) => void;
  /** 보여줄 프리셋과 순서. 기본은 전부. */
  presets?: PeriodPreset[];
  /** 기준일 `YYYY-MM-DD`. 기본은 오늘. 데이터가 하루 늦게 쌓이면 어제를 넘긴다. */
  today?: string;
  className?: string;
}

const LABELS: Record<PeriodPreset, string> = {
  today: '오늘',
  '7d': '최근 7일',
  '30d': '최근 30일',
  month: '이번 달',
  custom: '직접 선택',
};

// 날짜 계산은 UTC 자정끼리 해서 시간대·서머타임에 흔들리지 않게 한다. "오늘"만 사용자 시간대로 정한다.
const iso = (date: Date) => date.toISOString().slice(0, 10);
const localToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const parse = (value: string) => new Date(`${value}T00:00:00Z`);
const shift = (value: string, days: number) => {
  const date = parse(value);
  date.setUTCDate(date.getUTCDate() + days);
  return iso(date);
};

/** 프리셋이 가리키는 기간. 기준일을 포함한다. */
export function periodOf(preset: Exclude<PeriodPreset, 'custom'>, today: string): Period {
  switch (preset) {
    case 'today':
      return { preset, from: today, to: today };
    case '7d':
      return { preset, from: shift(today, -6), to: today };
    case '30d':
      return { preset, from: shift(today, -29), to: today };
    case 'month':
      return { preset, from: `${today.slice(0, 8)}01`, to: today };
  }
}

const short = (value: string) => `${Number(value.slice(5, 7))}/${Number(value.slice(8, 10))}`;

/**
 * 대시보드의 조회 기간 고르기. 자주 쓰는 기간은 칩 한 번으로, 그 밖은 "직접 선택"으로 시작일·종료일을 넣는다.
 * 고른 기간은 오른쪽에 "10/4 ~ 10/10 (7일)"처럼 글로 보여준다. 월 단위로 넘겨 보는 화면은 MonthStepper(공통)를 쓴다.
 */
export function PeriodPicker({
  value,
  onChange,
  presets = ['today', '7d', '30d', 'month', 'custom'],
  today = localToday(),
  className,
}: PeriodPickerProps) {
  const id = useId();
  // 직접 선택에서 날짜 칸을 비우면 빈 문자열이 온다.
  const incomplete = !value.from || !value.to;
  const days = Math.round((parse(value.to).getTime() - parse(value.from).getTime()) / 86_400_000) + 1;
  const invalid = value.preset === 'custom' && !incomplete && value.from > value.to;

  return (
    <div data-slot="period-picker" className={cn('flex flex-wrap items-center gap-x-4 gap-y-3', className)}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="조회 기간">
        {presets.map((preset) => (
          <Chip
            key={preset}
            selected={value.preset === preset}
            onClick={() => onChange(preset === 'custom' ? { ...value, preset } : periodOf(preset, today))}
          >
            {LABELS[preset]}
          </Chip>
        ))}
      </div>
      {value.preset === 'custom' ? (
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={`${id}-from`} className="sr-only">
            시작일
          </label>
          <Input
            id={`${id}-from`}
            type="date"
            className="w-40"
            value={value.from}
            max={today}
            aria-invalid={invalid || undefined}
            onChange={(event) => onChange({ ...value, from: event.target.value })}
          />
          <span aria-hidden className="text-muted-foreground">
            ~
          </span>
          <label htmlFor={`${id}-to`} className="sr-only">
            종료일
          </label>
          <Input
            id={`${id}-to`}
            type="date"
            className="w-40"
            value={value.to}
            max={today}
            aria-invalid={invalid || undefined}
            onChange={(event) => onChange({ ...value, to: event.target.value })}
          />
        </div>
      ) : null}
      <p aria-live="polite" className={cn('text-body-sm tabular-nums', invalid ? 'text-destructive' : 'text-muted-foreground')}>
        {invalid
          ? '시작일이 종료일보다 늦어요.'
          : incomplete
            ? '시작일과 종료일을 골라 주세요.'
            : `${short(value.from)} ~ ${short(value.to)} (${days}일)`}
      </p>
    </div>
  );
}
