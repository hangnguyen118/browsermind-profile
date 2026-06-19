import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Section } from '../ui/Section';
import { EDUCATION } from '../../data/profile';
import { fadeUp } from '../../lib/motion';

export function Education() {
  const { t } = useTranslation('sections');

  return (
    <Section
      id="education"
      heading={t('education.heading')}
      subheading={t('education.subheading')}
    >
      <div className="space-y-5">
        {EDUCATION.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200">
              <GraduationCap size={24} />
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-lg font-bold">
                  {t(`education.${item.degreeKey}`)}
                </h3>
                <span className="text-sm font-medium text-accent-600 dark:text-accent-300">
                  {item.period}
                </span>
              </div>
              <p className="mt-0.5 font-semibold text-gray-700 dark:text-gray-200">
                {item.school}
              </p>
              {item.gpa && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('education.gpaLabel')}: {item.gpa}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
