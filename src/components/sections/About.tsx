import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { fadeUp } from '../../lib/motion';
import { CERTIFICATES, PROJECTS, SKILL_GROUPS } from '../../data/profile';

export function About() {
  const { t } = useTranslation('sections');

  const techCount = new Set(
    SKILL_GROUPS.flatMap((g) => g.skills.map((s) => s.name)),
  ).size;

  const highlights = [
    { value: '3.35', label: t('about.highlights.gpa') },
    { value: `${PROJECTS.length}`, label: t('about.highlights.projects') },
    { value: `${techCount}+`, label: t('about.highlights.technologies') },
    {
      value: `${CERTIFICATES.length}`,
      label: t('about.highlights.certificates'),
    },
  ];

  return (
    <Section id="about" heading={t('about.heading')}>
      <div className="grid items-start gap-10 md:grid-cols-5">
        <motion.p
          variants={fadeUp}
          className="md:col-span-3 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
        >
          {t('about.body')}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 gap-4 md:col-span-2"
        >
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="text-3xl font-extrabold accent-gradient-text">
                {h.value}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {h.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
