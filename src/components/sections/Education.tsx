import { useTranslation } from 'react-i18next';
import { GraduationCap } from 'lucide-react';
import { Section } from '../ui/Section';
import { TiltCard } from '../ui/TiltCard';
import { EDUCATION } from '../../data/profile';
import { fadeUp } from '../../lib/motion';
import { openSidePanel } from '../../lib/sidePanelBus';
import type { EducationItem } from '../../types';

export function Education() {
  const { t } = useTranslation('sections');

  // Open the school in the left side panel: the transcript PDF if we have one,
  // otherwise a small details "blog" card.
  const view = (item: EducationItem) => {
    const degree = t(`education.${item.degreeKey}`);
    if (item.transcriptUrl) {
      openSidePanel({
        kind: 'pdf',
        title: item.school,
        subtitle: `${degree} · ${item.period}`,
        url: item.transcriptUrl,
      });
      return;
    }
    openSidePanel({
      kind: 'blog',
      title: item.school,
      subtitle: `${degree} · ${item.period}`,
      html: `
        <h2>${degree}</h2>
        <p><strong>${item.school}</strong></p>
        <p>${item.period}</p>
        ${item.gpa ? `<p>${t('education.gpaLabel')}: ${item.gpa}</p>` : ''}
      `,
    });
  };

  return (
    <Section
      id="education"
      heading={t('education.heading')}
      subheading={t('education.subheading')}
    >
      <div className="space-y-5">
        {EDUCATION.map((item) => (
          <TiltCard
            key={item.id}
            variants={fadeUp}
            intensity={5}
            role="button"
            tabIndex={0}
            onClick={() => view(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                view(item);
              }
            }}
            aria-label={item.school}
            className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 dark:border-gray-800 dark:bg-gray-900"
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
          </TiltCard>
        ))}
      </div>
    </Section>
  );
}
