import { Plus, X } from 'lucide-react';
import { type KeyboardEvent, useId, useRef, useState } from 'react';

import { cn } from '@aha/ui';

export interface RecipientInputProps {
  /** 화면에 보이는 라벨. 예: "받는 사람". */
  label: string;
  /** 받는 사람 목록 (이름 또는 이메일). */
  value: string[];
  /** 받는 사람을 더하거나 뺄 때. 바뀐 전체 목록을 넘긴다. */
  onValueChange: (value: string[]) => void;
  /** 추가 입력칸의 안내 문구. */
  placeholder?: string;
  className?: string;
}

/**
 * 받는 사람 칩 입력 (11쪽 회의록 메일 발송).
 * "+ 추가"를 누르면 입력칸이 열리고, Enter나 쉼표로 추가한다. 빈 입력에서 Backspace를 누르면 마지막 사람을 지운다.
 */
export function RecipientInput({ label, value, onValueChange, placeholder = '이름 또는 이메일', className }: RecipientInputProps) {
  const labelId = useId();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const next = draft.trim().replace(/,$/, '');
    if (next && !value.includes(next)) onValueChange([...value, next]);
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Safari는 조합을 끝내는 Enter에 isComposing=false, keyCode 229를 보낸다. 둘 다 조합 중으로 본다.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add();
    } else if (event.key === 'Escape') {
      setDraft('');
      setAdding(false);
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onValueChange(value.slice(0, -1));
    }
  };

  return (
    <div data-slot="recipient-input" className={cn('flex flex-col gap-2', className)}>
      <span id={labelId} className="text-body-sm text-muted-foreground">
        {label}
      </span>
      <ul aria-labelledby={labelId} className="flex flex-wrap items-center gap-2">
        {value.map((recipient) => (
          <li key={recipient} className="flex h-8 items-center gap-1 rounded-full bg-muted pr-1 pl-3 text-body-sm">
            {recipient}
            <button
              type="button"
              aria-label={`${recipient} 삭제`}
              onClick={() => onValueChange(value.filter((item) => item !== recipient))}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
        <li>
          {adding ? (
            <input
              ref={inputRef}
              autoFocus
              aria-label={`${label} 추가`}
              value={draft}
              placeholder={placeholder}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                add();
                setAdding(false);
              }}
              className="h-8 w-44 rounded-full border border-input px-3 text-body-sm outline-none placeholder:text-muted-foreground focus-visible:border-border-strong"
            />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex h-8 cursor-pointer items-center gap-1 rounded-full border border-dashed border-input px-3 text-body-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Plus className="size-3.5" /> 추가
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}
