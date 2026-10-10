import { useId } from 'react';

import { cn } from '@aha/ui';

export interface ChoiceOption {
  value: string;
  /** 굵은 제목. 예: "핵심 내용 요약", "계약 리스크 검토". */
  label: string;
  /** 제목 위 작은 분류. 예: "일반 문서용", "계약서용". */
  eyebrow?: string;
}

export interface ChoiceCardGroupProps {
  /** 스크린리더가 읽는 묶음 이름. 예: "검토 기준". */
  label: string;
  options: ChoiceOption[];
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

/**
 * AI가 사용자에게 고르게 하는 카드형 선택지 (13쪽 "어떤 기준으로 검토할까요?").
 * 라디오 버튼이라 하나만 고를 수 있고, 방향키로 이동할 수 있다.
 * 선택지가 짧은 단어라면 카드 대신 Chip(`selected`)을 쓴다 (11쪽 템플릿 선택, 13쪽 결과 언어).
 */
export function ChoiceCardGroup({ label, options, value, onValueChange, className }: ChoiceCardGroupProps) {
  const name = useId();
  return (
    <div
      data-slot="choice-card-group"
      role="radiogroup"
      aria-label={label}
      className={cn('grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]', className)}
    >
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              'relative flex cursor-pointer flex-col gap-1 rounded-lg border px-4 py-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-ring',
              checked ? 'border-border-strong bg-muted' : 'border-border bg-background hover:bg-accent',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onValueChange(option.value)}
              className="sr-only"
            />
            {option.eyebrow ? <span className="text-caption text-muted-foreground">{option.eyebrow}</span> : null}
            <span className="text-body font-semibold text-foreground">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
