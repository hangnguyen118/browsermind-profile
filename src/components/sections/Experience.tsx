import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Section } from '../ui/Section';
import { TechTag } from '../ui/TechTag';
import { TiltCard } from '../ui/TiltCard';
import { EXPERIENCE } from '../../data/profile';
import { fadeUp } from '../../lib/motion';

export function Experience() {
  const { t } = useTranslation('sections');

  return (
    <Section
      id="experience"
      heading={t('experience.heading')}
      subheading={t('experience.subheading')}
      muted
    >
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute top-2 left-4 h-full w-px bg-gray-200 sm:left-5 dark:bg-gray-700" />

        <div className="space-y-8">
          {EXPERIENCE.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="relative pl-12 sm:pl-16"
            >
              <span className="absolute left-0 grid h-9 w-9 place-items-center rounded-full bg-accent-300 text-[#0b2434] shadow sm:h-11 sm:w-11">
                <Briefcase size={18} />
              </span>

              <TiltCard
                intensity={5}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-lg font-bold">
                    {t(`experience.${item.roleKey}`)}
                  </h3>
                  <span className="text-sm font-medium text-accent-600 dark:text-accent-300">
                    {item.period}
                  </span>
                </div>
                <p className="mt-0.5 font-semibold text-gray-700 dark:text-gray-200">
                  {item.company}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {t(`experience.${item.descKey}`)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tech.map((tech) => (
                    <TechTag key={tech} label={tech} />
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
