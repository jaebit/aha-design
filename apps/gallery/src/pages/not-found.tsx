import { Button } from '@aha/ui';

import { Link } from '../lib/router';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center">
      <span aria-hidden className="text-display">
        💡
      </span>
      <h1 className="text-title font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="text-body text-muted-foreground">주소가 바뀌었거나 없는 컴포넌트입니다.</p>
      <Button asChild>
        <Link href="/">홈으로</Link>
      </Button>
    </div>
  );
}
