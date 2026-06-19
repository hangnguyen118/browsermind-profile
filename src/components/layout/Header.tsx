import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Moon, Sun, X, Languages } from 'lucide-react';
import { Navigation } from './Navigation';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { SECTION_IDS } from '../../lib/sections';
import { cn } from '../../lib/cn';

/** Sticky header: logo, nav, language switch, dark-mode toggle, mobile menu. */
export function Header() {
  const { t, i18n } = useTranslation('common');
  const { isDark, toggle } = useDarkMode();
  const activeId = useScrollSpy(SECTION_IDS);
  const [mobileOpen, setMobileOpen] = useState(false);

  const otherLang = i18n.language?.startsWith('vi') ? 'en' : 'vi';
  const switchLang = () => void i18n.changeLanguage(otherLang);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-md dark:border-gray-800/70 dark:bg-gray-950/80">
      <div className="container-page flex h-16 items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-300 font-mono text-sm text-[#0b2434]">
            &lt;/&gt;
          </span>
          <span className="accent-gradient-text">DH</span>
        </a>

        <Navigation activeId={activeId} />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={switchLang}
            className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label={t('language.label')}
            title={t('language.label')}
          >
            <Languages size={18} />
            <span className="uppercase">{otherLang}</span>
          </button>

          <button
            type="button"
            onClick={toggle}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label={t('theme.toggle')}
            title={t('theme.toggle')}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-gray-200/70 transition-[max-height] duration-300 md:hidden dark:border-gray-800/70',
          mobileOpen ? 'max-h-96' : 'max-h-0',
        )}
      >
        <div className="container-page py-3">
          <Navigation
            activeId={activeId}
            orientation="vertical"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
