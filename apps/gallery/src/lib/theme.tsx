// 갤러리 테마. <html data-theme>를 바꾸면 토큰이 알아서 바뀐다 (AGENTS.md 다크 모드 규칙).
import { createContext, type ReactNode, useContext, useEffect, useState, useSyncExternalStore } from 'react';

export type ThemeChoice = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'aha-gallery-theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function readChoice(): ThemeChoice {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark') return value;
  } catch {
    // 저장소를 못 쓰는 환경이면 시스템 설정을 따른다.
  }
  return 'system';
}

const ThemeContext = createContext<{ choice: ThemeChoice; resolved: 'light' | 'dark'; setChoice: (c: ThemeChoice) => void }>({
  choice: 'system',
  resolved: 'light',
  setChoice: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<ThemeChoice>(readChoice);
  const systemDark = useSyncExternalStore(
    (onChange) => {
      const query = media();
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => media().matches,
  );

  useEffect(() => {
    const root = document.documentElement;
    if (choice === 'system') delete root.dataset.theme;
    else root.dataset.theme = choice;
    try {
      if (choice === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // 무시
    }
  }, [choice]);

  const resolved = choice === 'system' ? (systemDark ? 'dark' : 'light') : choice;
  return <ThemeContext value={{ choice, resolved, setChoice }}>{children}</ThemeContext>;
}

export const useTheme = () => useContext(ThemeContext);
