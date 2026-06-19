import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  // The inline script in index.html already applied the class; mirror it here.
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  }
  return 'light';
}

/**
 * Dark mode toggle persisted to localStorage and reflected as a `.dark` class
 * on <html> (SPEC §8.1). Initial value is read from the class set pre-paint.
 */
export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, isDark: theme === 'dark', toggle, setTheme };
}
