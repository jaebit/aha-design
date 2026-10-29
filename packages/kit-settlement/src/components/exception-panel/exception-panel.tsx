import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { Button, cn, FormField, Textarea } from '@actoz/ui';

import { ExceptionBadge } from '../exception-badge/exception-badge';

export interface ExceptionReason {
  /** 사유 id. */
  id: string;
  /** 선택지 문구. */
  label: string;
  /** true면 이 사유를 고를 때만 서술란이 열린다 (예: 「기타」). */
  other?: boolean;
  /**
   * 있으면 이 사유로는 확인 후 진행하지 않는다. 안내 문장이 보이고, 주 버튼이 원인을 푸는 동작으로 바뀐다
   * (예: 정산서 오류 → 「수정 정산서 업로드」).
   */
  resolve?: { notice: string; actionLabel: string };
}

export interface ExceptionPanelProps {
  /** 열림 상태. `onOpenChange`와 함께 쓴다. 생략하면 `defaultOpen`으로 시작하는 비제어 모드. */
  open?: boolean;
  /** 열림 상태가 바뀔 때. 취소·Esc·동작 버튼으로 닫으면 false로 부른다. */
  onOpenChange?: (open: boolean) => void;
  /** 비제어 모드에서 처음부터 열어 둘지. 예제와 미리보기용. */
  defaultOpen?: boolean;
  /** 예외 코드 (확인 후 진행 종류, 예: E05). */
  code: string;
  /** 상황 문장. 예외 목록의 문구 그대로 (예: "재계산 로열티 ≠ 정산서 로열티"). */
  situation: string;
  /** 「기준과 다른 점」 안의 내용. 원문 값·기준 값·차이 표와 적용 중인 기준(허용 오차 등)을 넣는다. */
  comparison: ReactNode;
  /** 사유 선택지. 처음부터 자유 서술로 받지 않는다. 문구는 업무에서 정한 목록을 넘긴다. */
  reasons: ExceptionReason[];
  /** 처음에 골라 둘 사유 id. 생략하면 첫 번째. */
  defaultReasonId?: string;
  /** 서술란 라벨. 기본 "기타 사유". */
  otherLabel?: string;
  /** 주 버튼 문구. 기본 "확인 후 진행". */
  proceedLabel?: string;
  /** 주 버튼 아래 기록 안내. 기본 "확인자·시각·차이를 기록하고 품의서 초안에 남깁니다." */
  recordNote?: string;
  /** 확인 후 진행을 눌렀을 때. 고른 사유 id와 서술을 넘긴다. 대화상자는 닫힌다. */
  onProceed?: (reasonId: string, otherText: string) => void;
  /** 원인을 푸는 동작(`reason.resolve`)을 눌렀을 때. 고른 사유 id를 넘긴다. 대화상자는 닫힌다. */
  onResolve?: (reasonId: string) => void;
}

/**
 * 예외 하나를 처리하는 대화상자 (정산 화면 「예외 처리」). 무엇이 기준과 다른지 먼저 보이고, 그다음 사유를 고르게 한다.
 * 「기타」를 고를 때만 서술란이 열린다. 진행 불가 예외에는 쓰지 않는다 (해제·무시 동작을 두지 않는다).
 * 네이티브 dialog를 쓰므로 Esc로 닫히고 포커스가 대화상자 안에 머문다.
 */
export function ExceptionPanel({
  open,
  onOpenChange,
  defaultOpen = false,
  code,
  situation,
  comparison,
  reasons,
  defaultReasonId,
  otherLabel = '기타 사유',
  proceedLabel = '확인 후 진행',
  recordNote = '확인자·시각·차이를 기록하고 품의서 초안에 남깁니다.',
  onProceed,
  onResolve,
}: ExceptionPanelProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [reasonId, setReasonId] = useState(defaultReasonId ?? reasons[0]?.id ?? '');
  const [otherText, setOtherText] = useState('');
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const diffId = useId();
  const groupName = useId();
  const isOpen = open ?? innerOpen;
  const reason = reasons.find((item) => item.id === reasonId);

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      data-slot="exception-panel"
      aria-labelledby={titleId}
      onClose={() => setOpen(false)}
      className={cn(
        'm-auto w-[calc(100%-2rem)] max-w-xl rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-popover backdrop:bg-overlay',
      )}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col gap-1.5">
          <ExceptionBadge code={code} />
          <h2 id={titleId} className="text-heading font-semibold">
            {situation}
          </h2>
        </header>

        <section aria-labelledby={diffId} className="flex flex-col gap-2">
          <h3 id={diffId} className="text-body font-semibold">
            기준과 다른 점
          </h3>
          {comparison}
        </section>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-body font-semibold">사유 선택</legend>
          {reasons.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-body">
              <input
                type="radio"
                name={groupName}
                value={item.id}
                checked={item.id === reasonId}
                onChange={() => setReasonId(item.id)}
                className="size-4 accent-primary"
              />
              {item.label}
            </label>
          ))}
          <FormField label={otherLabel} className="mt-2">
            <Textarea
              rows={3}
              disabled={!reason?.other}
              value={otherText}
              onChange={(event) => setOtherText(event.target.value)}
              placeholder="기타를 고른 경우에만 입력"
            />
          </FormField>
        </fieldset>

        <footer className="flex flex-col gap-3">
          <p className="text-body-sm text-muted-foreground">{reason?.resolve ? reason.resolve.notice : recordNote}</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            {reason?.resolve ? (
              <Button
                onClick={() => {
                  onResolve?.(reason.id);
                  setOpen(false);
                }}
              >
                {reason.resolve.actionLabel}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onProceed?.(reasonId, reason?.other ? otherText : '');
                  setOpen(false);
                }}
              >
                {proceedLabel}
              </Button>
            )}
          </div>
        </footer>
      </div>
    </dialog>
  );
}
