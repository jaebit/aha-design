import { Button } from '@actoz/ui';
import { X } from 'lucide-react';

import { kitById, useKit } from '../lib/kit';
import { Link } from '../lib/router';

/** 목록 위 안내: 지금 어떤 키트로 좁혀 보고 있는지와 전체 보기 버튼. 전체를 보고 있으면 아무것도 그리지 않는다. */
export function KitScopeNotice({ hidden }: { hidden: number }) {
  const { kit, setKit } = useKit();
  const current = kitById(kit);
  if (!current) return null;
  return (
    <div role="status" className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border bg-subtle px-4 py-3 text-body-sm">
      <span>
        <strong className="font-semibold">공통 + {current.label}</strong> 키트만 보고 있어요.
        {hidden > 0 ? <span className="text-muted-foreground"> 다른 키트 {hidden}개는 숨겼어요.</span> : null}
      </span>
      <Link href={`/kits/${current.id}`} className="font-semibold underline underline-offset-4">
        {current.label} 키트 소개
      </Link>
      <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setKit(null)}>
        <X aria-hidden />
        전체 보기
      </Button>
    </div>
  );
}
