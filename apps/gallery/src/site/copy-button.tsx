import { Button, type ButtonProps } from '@actoz/ui';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'children' | 'value'> {
  value: string | (() => string);
  label?: string;
  copiedLabel?: string;
}

/** 클립보드 복사 버튼. 복사 후 2초 동안 완료 표시를 보여준다. */
export function CopyButton({ value, label = '복사', copiedLabel = '복사됨', variant = 'secondary', size = 'sm', ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(typeof value === 'function' ? value() : value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant={variant} size={size} onClick={copy} {...props}>
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </Button>
  );
}
