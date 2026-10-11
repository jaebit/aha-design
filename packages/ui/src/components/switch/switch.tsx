import { useId } from 'react';

import { cn } from '../../lib/cn';

export interface SwitchProps {
  /** 켜짐 여부. `onCheckedChange`와 함께 쓰는 제어 컴포넌트다. */
  checked: boolean;
  /** 눌렀을 때. 바뀐 값을 넘긴다. */
  onCheckedChange: (checked: boolean) => void;
  /** 스크린리더용 이름. 무엇을 켜고 끄는지. 예: "AI 소식 구독", "새 기기 로그인 알림". */
  label: string;
  /** 스위치 아래에 보이는 현재 상태 문구. 예: { on: "구독 중", off: "구독 안 함" } (14쪽). */
  stateLabels?: { on: string; off: string };
  /** true면 누를 수 없다. 권한이 없어 바꿀 수 없는 설정. */
  disabled?: boolean;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

/**
 * 켜고 끄는 스위치 (14쪽 뉴스레터 구독, 보안 설정의 알림 받기).
 * 누르는 즉시 적용되는 설정에 쓴다. 저장 버튼을 눌러야 적용되는 폼 항목에는 체크박스를 쓴다.
 */
export function Switch({ checked, onCheckedChange, label, stateLabels, disabled = false, className }: SwitchProps) {
  const stateId = useId();
  return (
    <div data-slot="switch" className={cn('flex flex-col items-center gap-1.5', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-describedby={stateLabels ? stateId : undefined}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40',
          checked ? 'bg-primary' : 'bg-input',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'size-6 rounded-full bg-background transition-transform',
            checked ? 'translate-x-7' : 'translate-x-1',
          )}
        />
      </button>
      {stateLabels ? (
        <span id={stateId} className="text-body-sm font-semibold text-foreground">
          {checked ? stateLabels.on : stateLabels.off}
        </span>
      ) : null}
    </div>
  );
}
