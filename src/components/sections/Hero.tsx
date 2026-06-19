import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, MessageSquareText, Send } from 'lucide-react';
import { SocialLinks } from '../ui/SocialLinks';
import { PROFILE } from '../../data/profile';
import { fadeUp, staggerContainer } from '../../lib/motion';
import { openChat } from '../../lib/chatBus';

export function Hero() {
  const { t } = useTranslation(['sections', 'common']);
  const [avatarError, setAvatarError] = useState(false);

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24"
    >
      {/* Decorative accent blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent-200/50 blur-3xl dark:bg-accent-900/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl dark:bg-accent-800/20"
      />

      <div className="container-page">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col-reverse items-center gap-10 md:flex-row md:justify-between"
        >
          <div className="max-w-xl text-center md:text-left">
            <motion.p
              variants={fadeUp}
              className="text-base font-medium text-accent-600 dark:text-accent-300"
            >
              {t('hero.greeting')}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {t('hero.name')}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-xl font-semibold accent-gradient-text sm:text-2xl"
            >
              {t('hero.title')}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-300"
            >
              {t('hero.tagline')}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
            >
              <a
                href={PROFILE.cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-600"
              >
                <Download size={18} />
                {t('common:actions.downloadCv')}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-accent-300 dark:border-gray-700 dark:text-gray-200"
              >
                <Send size={18} />
                {t('common:actions.contact')}
              </a>
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 dark:bg-white dark:text-gray-900"
              >
                <MessageSquareText size={18} />
                {t('common:actions.chatWithAi')}
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex justify-center md:justify-start"
            >
              <SocialLinks />
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="shrink-0">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-accent-300 to-accent-500 blur-md" />
              <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-xl sm:h-56 sm:w-56 dark:border-gray-800">
                {!avatarError ? (
                  <img
                    src={PROFILE.avatarUrl}
                    alt={t('hero.name')}
                    onError={() => setAvatarError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-accent-100 text-5xl font-extrabold text-accent-700 dark:bg-accent-900/40 dark:text-accent-200">
                    {PROFILE.initials}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
