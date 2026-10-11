import { Check, Minus } from 'lucide-react';

import { Checkbox, cn } from '@aha/ui';

export interface PermissionAction {
  /** 권한 키. 예: "read", "write", "delete". */
  key: string;
  /** 열 제목. 예: "조회", "편집", "삭제". */
  label: string;
}

export interface PermissionResource {
  /** 대상 키. 예: "users". */
  key: string;
  /** 행 이름. 예: "사용자". */
  label: string;
  /** 행 이름 아래 보조 설명. 예: "사용자 목록, 역할 변경". */
  description?: string;
  /** 이 대상에 없는 권한 키. 해당 칸은 비워 둔다. 예: 통계는 ["delete"], 감사 로그는 ["create", "update", "delete"] (보기만 있다). */
  unavailable?: string[];
}

export interface PermissionMatrixProps {
  /** 스크린리더용 표 제목. 예: "운영자 역할의 권한". */
  caption: string;
  /** 행: 권한을 주는 대상 (메뉴, 데이터). */
  resources: PermissionResource[];
  /** 열: 권한 종류. 왼쪽에서 오른쪽으로 약한 권한 → 강한 권한 순서. */
  actions: PermissionAction[];
  /** 대상 키 → 허용한 권한 키 목록. 예: `{ users: ["read", "write"] }`. */
  value: Record<string, string[]>;
  /** 체크를 바꿀 때. 생략하거나 `readOnly`면 읽기 전용 표가 된다. */
  onValueChange?: (value: Record<string, string[]>) => void;
  /** 읽기 전용. 체크 대신 ✓ / – 표시. 권한을 바꿀 수 없는 사용자에게 보여줄 때. */
  readOnly?: boolean;
  /** 바깥 요소에 더할 클래스. */
  className?: string;
}

/**
 * 역할의 권한 표 (대상 × 권한). 관리 화면의 역할 편집, 사용자 상세의 권한 보기에 쓴다.
 * 편집 모드는 체크박스, 읽기 전용은 ✓ / – 로 보여준다. 색만으로 허용 여부를 알리지 않는다.
 */
export function PermissionMatrix({
  caption,
  resources,
  actions,
  value,
  onValueChange,
  readOnly = false,
  className,
}: PermissionMatrixProps) {
  const editable = Boolean(onValueChange) && !readOnly;
  const toggle = (resource: string, action: string, checked: boolean) => {
    const current = value[resource] ?? [];
    const next = checked ? [...current, action] : current.filter((key) => key !== action);
    onValueChange?.({ ...value, [resource]: actions.map((a) => a.key).filter((key) => next.includes(key)) });
  };

  return (
    <div data-slot="permission-matrix" className={cn('relative overflow-x-auto rounded-lg border border-border', className)}>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-subtle">
            <th scope="col" className="h-11 px-4 text-body-sm font-normal text-muted-foreground">
              대상
            </th>
            {actions.map((action) => (
              <th key={action.key} scope="col" className="h-11 w-20 px-2 text-center text-body-sm font-normal text-muted-foreground">
                {action.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.key} className="border-b border-border last:border-b-0">
              <th scope="row" className="px-4 py-3 text-left font-normal">
                <span className="block text-body text-foreground">{resource.label}</span>
                {resource.description ? (
                  <span className="block text-body-sm text-muted-foreground">{resource.description}</span>
                ) : null}
              </th>
              {actions.map((action) => {
                const unavailable = resource.unavailable?.includes(action.key);
                const allowed = (value[resource.key] ?? []).includes(action.key);
                const name = `${resource.label} ${action.label}`;
                return (
                  <td key={action.key} className="px-2 py-3 text-center align-middle">
                    {unavailable ? (
                      <span className="sr-only">{name} 해당 없음</span>
                    ) : editable ? (
                      <Checkbox
                        aria-label={name}
                        checked={allowed}
                        onCheckedChange={(checked) => toggle(resource.key, action.key, checked)}
                      />
                    ) : allowed ? (
                      <>
                        <Check aria-hidden className="mx-auto size-4 text-foreground" />
                        <span className="sr-only">{name} 허용</span>
                      </>
                    ) : (
                      <>
                        <Minus aria-hidden className="mx-auto size-4 text-muted-foreground" />
                        <span className="sr-only">{name} 없음</span>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
