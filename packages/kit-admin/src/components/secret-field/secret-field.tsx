import { Button, cn } from '@actoz/ui';
import { Check, Copy, Eye, EyeOff, RefreshCw, TriangleAlert } from 'lucide-react';
import { type ReactNode, useEffect, useId, useState } from 'react';

export interface SecretFieldProps {
  /** 값 이름. 위에 라벨로 보이고 버튼의 접근성 이름에도 쓴다. 예: "클라이언트 secret", "클라이언트 id". */
  label: string;
  /** 보여줄 값. 숨김 상태에서는 끝 4자만 보인다 (8자 이하면 모두 가린다). */
  value: string;
  /** 비밀값이면 true(기본). 처음에는 가리고 보기·숨기기 버튼을 둔다. 클라이언트 id처럼 공개 값이면 false. */
  masked?: boolean;
  /**
   * 방금 만든 비밀값이면 true. 값을 처음부터 다 보여주고 "다시 볼 수 없다" 경고를 단다.
   * 서버는 비밀값을 해시로만 저장하므로 이 화면을 벗어나면 다시 볼 수 없다.
   */
  revealOnce?: boolean;
  /** 재발급할 때. 주면 "재발급" 버튼이 생긴다. 재발급은 기존 값을 바로 무효로 만드므로 ConfirmDialog로 한 번 더 묻는다. */
  onRegenerate?: () => void;
  /** 값 아래 보조 정보. 예: "2026-09-22 발급 · 90일 뒤 만료". */
  description?: ReactNode;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

const MASK = '••••••••••••';

/**
 * OAuth 클라이언트 secret, API 키 같은 값을 보여주는 칸. 관리 콘솔의 클라이언트 상세에서 쓴다.
 * 비밀값은 기본으로 가리고(끝 4자만), 보기·숨기기와 복사 버튼을 둔다. 방금 만든 값은 `revealOnce`로 한 번만 보여준다.
 */
export function SecretField({ label, value, masked = true, revealOnce = false, onRegenerate, description, className }: SecretFieldProps) {
  const initialShown = !masked || revealOnce;
  const [shown, setShown] = useState(initialShown);
  // 재발급으로 값이나 revealOnce가 바뀌면 보임 상태를 처음 규칙대로 다시 정한다.
  const [shownFor, setShownFor] = useState({ value, initialShown });
  if (shownFor.value !== value || shownFor.initialShown !== initialShown) {
    setShownFor({ value, initialShown });
    setShown(initialShown);
  }
  const [copied, setCopied] = useState(false);
  const labelId = useId();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // 클립보드를 못 쓰는 환경이면 값을 보여줘 직접 복사하게 한다.
      setShown(true);
    }
  };
  // 짧은 값은 끝 4자만 보여도 거의 다 드러나므로 모두 가린다.
  const display = shown ? value : value.length > 8 ? `${MASK}${value.slice(-4)}` : MASK;

  return (
    <div data-slot="secret-field" className={cn('flex flex-col gap-2', className)}>
      <span id={labelId} className="text-body-sm font-medium text-foreground">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex items-center gap-1 rounded-md border border-input bg-subtle py-1 pl-3 pr-1"
      >
        <code className="min-w-0 flex-1 truncate font-mono text-body-sm text-foreground">
          {display}
        </code>
        {masked && !revealOnce ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={shown ? `${label} 숨기기` : `${label} 보기`}
            aria-pressed={shown}
            onClick={() => setShown((v) => !v)}
          >
            {shown ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
          </Button>
        ) : null}
        <Button variant="ghost" size="icon" aria-label={`${label} 복사`} onClick={copy}>
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        </Button>
        {onRegenerate ? (
          <Button variant="secondary" size="sm" onClick={onRegenerate}>
            <RefreshCw aria-hidden />
            재발급
          </Button>
        ) : null}
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? `${label}을(를) 복사했습니다.` : ''}
      </span>
      {revealOnce ? (
        <p className="flex items-start gap-2 rounded-md border border-border bg-subtle px-3 py-2 text-body-sm text-foreground">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-status-warning" />
          이 화면을 벗어나면 다시 볼 수 없습니다. 지금 복사해 안전한 곳에 보관하세요.
        </p>
      ) : null}
      {description ? <p className="text-caption text-muted-foreground">{description}</p> : null}
    </div>
  );
}
