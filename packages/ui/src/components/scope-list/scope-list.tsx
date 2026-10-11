import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '../badge/badge';
import { cn } from '../../lib/cn';

export interface ScopeItem {
  /** OAuth scope 값. 예: `openid`, `profile`, `work.my.read`. 화면에는 `label`을 보여주고 이 값은 보조로 작게 보인다. */
  scope: string;
  /** 사용자가 읽는 권한 이름. 예: "내 업무 목록 보기". 동사로 끝나게 쓴다. */
  label: ReactNode;
  /** 권한으로 앱이 할 수 있는 일을 한 줄로. 예: "업무요청게시판에서 내가 담당한 업무만 읽습니다." */
  description?: ReactNode;
  /** 앱에 꼭 필요한 권한이면 true. "필수" 배지가 붙는다. */
  required?: boolean;
  /** 왼쪽 아이콘. lucide-react 아이콘에 `aria-hidden`을 주어 넣는다. 생략하면 체크 표시. */
  icon?: ReactNode;
}

export interface ScopeListProps {
  /** 앱이 요청한 권한 목록. 필수 권한을 먼저 둔다. */
  items: ScopeItem[];
  /** scope 값(`openid` 등)을 보조 글자로 보여줄지. 사용자 동의 화면은 false, 관리 콘솔의 클라이언트 상세는 true. 기본 false. */
  showScope?: boolean;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

/**
 * OAuth 동의 화면에서 앱이 요청한 권한을 읽기 쉬운 말로 나열한다.
 * 관리 콘솔의 OAuth 클라이언트 상세에서 허용된 scope를 보여줄 때도 쓴다 (`showScope`).
 */
export function ScopeList({ items, showScope = false, className }: ScopeListProps) {
  return (
    <ul data-slot="scope-list" className={cn('flex flex-col divide-y divide-border rounded-lg border border-border', className)}>
      {items.map((item) => (
        <li key={item.scope} className="flex items-start gap-3 px-4 py-3">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-primary [&_svg]:size-5">
            {item.icon ?? <Check aria-hidden />}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-body font-medium text-foreground">{item.label}</span>
              {item.required ? <Badge variant="soft">필수</Badge> : null}
            </div>
            {item.description ? <p className="text-body-sm text-muted-foreground">{item.description}</p> : null}
            {showScope ? <code className="font-mono text-caption text-muted-foreground">{item.scope}</code> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
