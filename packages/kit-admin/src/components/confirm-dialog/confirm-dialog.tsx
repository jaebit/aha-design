import * as AlertDialog from '@radix-ui/react-alert-dialog';
import type { ReactNode } from 'react';

import { Button } from '@aha/ui';

export interface ConfirmDialogProps {
  /** 열림 상태. `onOpenChange`와 함께 쓴다. `trigger`를 주면 생략해도 된다. */
  open?: boolean;
  /** 열림 상태가 바뀔 때. 확인·취소·Esc로 닫으면 false로 부른다. */
  onOpenChange?: (open: boolean) => void;
  /** 비제어 모드에서 처음부터 열어 둘지. 예제와 미리보기용. */
  defaultOpen?: boolean;
  /** 대화상자를 여는 버튼. 예: `<Button variant="destructive">삭제</Button>`. */
  trigger?: ReactNode;
  /** 질문. 무엇을 하려는지 구체적으로. 예: "사용자 3명을 비활성화할까요?", "클라이언트 비밀값을 다시 발급할까요?". */
  title: string;
  /** 결과 설명. 되돌릴 수 있는지, 무엇이 바뀌는지. */
  description: ReactNode;
  /** 확인 버튼 문구. 동작을 그대로 적는다. 예: "비활성화", "다시 발급". "확인"은 피한다. */
  confirmLabel: string;
  /** 취소 버튼 문구. 기본 "취소". */
  cancelLabel?: string;
  /** `destructive`면 확인 버튼이 빨간색이 된다. 삭제·비활성화·비밀값 재발급처럼 되돌리기 어려운 작업. 확인 버튼은 `Button variant="destructive-solid"`. */
  tone?: 'default' | 'destructive';
  /** 확인을 눌렀을 때. 대화상자는 닫힌다. */
  onConfirm: () => void;
  /** 설명 아래 추가 내용. 예: 대상 목록. */
  children?: ReactNode;
}

/**
 * 되돌리기 어려운 작업 전에 한 번 더 묻는 대화상자 (삭제, 비활성화, 권한 회수, 세션 강제 종료, 비밀값 재발급).
 * 포커스는 취소 버튼에서 시작하고, Esc나 취소로 닫힌다. 바깥을 눌러도 닫히지 않는다.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  defaultOpen,
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  tone = 'default',
  onConfirm,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {trigger ? <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger> : null}
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-overlay" />
        <AlertDialog.Content
          data-slot="confirm-dialog"
          className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-popover"
        >
          <AlertDialog.Title className="text-heading font-semibold">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-body text-muted-foreground">{description}</AlertDialog.Description>
          {children}
          <div className="mt-2 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant={tone === 'destructive' ? 'destructive-solid' : 'primary'} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
