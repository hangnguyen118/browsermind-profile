import { useTranslation } from 'react-i18next';
import { SECTIONS } from '../../lib/sections';
import { cn } from '../../lib/cn';

interface NavigationProps {
  activeId: string | null;
  /** Layout: horizontal (desktop) or stacked (mobile menu). */
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
}

/** Anchor navigation with active-section highlighting (SPEC §3). */
export function Navigation({
  activeId,
  orientation = 'horizontal',
  onNavigate,
}: NavigationProps) {
  const { t } = useTranslation('common');

  return (
    <nav
      aria-label="Primary"
      className={cn(
        orientation === 'horizontal'
          ? 'hidden items-center gap-1 md:flex'
          : 'flex flex-col gap-1',
      )}
    >
      {SECTIONS.map((s) => {
        const active = activeId === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={onNavigate}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'text-accent-700 dark:text-accent-300'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
              orientation === 'vertical' && 'text-base',
            )}
          >
            {t(s.navKey)}
          </a>
        );
      })}
    </nav>
  );
}
