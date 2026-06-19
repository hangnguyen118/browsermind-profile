import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { SocialLinks } from '../ui/SocialLinks';

export function Footer() {
  const { t } = useTranslation(['common', 'sections']);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40">
      <div className="container-page flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="font-bold accent-gradient-text">
            {t('sections:hero.name')}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('common:footer.builtWith')}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            © {year} · {t('common:footer.rights')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <SocialLinks />
          <a
            href="#top"
            className="flex items-center gap-1.5 rounded-lg bg-accent-300 px-3 py-2.5 text-sm font-semibold text-[#0b2434] transition-transform hover:-translate-y-0.5"
            aria-label={t('actions.backToTop')}
          >
            <ArrowUp size={16} />
            <span className="hidden sm:inline">{t('actions.backToTop')}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
