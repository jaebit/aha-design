// 갤러리에서 고른 키트. 컴포넌트·템플릿 목록을 "공통 + 그 키트"로 좁힌다.
// 보는 사람마다의 편의 설정이라 브라우저 저장소에만 둔다 (없거나 막혀 있으면 "전체").
import { createContext, type ReactNode, useContext, useState } from 'react';

import { site } from '../../site.config';
import { catalog } from './catalog';

const STORAGE_KEY = `${site.id}-gallery-kit`;
const domainKits = catalog.kits.filter((k) => k.id !== 'core');

function readKit(): string | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value && domainKits.some((k) => k.id === value)) return value;
  } catch {
    // 저장소를 못 쓰는 환경이면 전체를 보여준다.
  }
  return null;
}

const KitContext = createContext<{ kit: string | null; setKit: (kit: string | null) => void }>({
  kit: null,
  setKit: () => {},
});

export function KitProvider({ children }: { children: ReactNode }) {
  const [kit, setKitState] = useState<string | null>(readKit);
  const setKit = (next: string | null) => {
    setKitState(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, next);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 무시
    }
  };
  return <KitContext value={{ kit, setKit }}>{children}</KitContext>;
}

export const useKit = () => useContext(KitContext);

/** 공통을 뺀 도메인 키트 목록 (화면 순서). */
export { domainKits };

export const kitById = (id: string | null | undefined) => catalog.kits.find((k) => k.id === id);
