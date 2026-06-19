import { useTranslation } from 'react-i18next';
import { Award, ExternalLink } from 'lucide-react';
import { Section } from '../ui/Section';
import { TiltCard } from '../ui/TiltCard';
import { CERTIFICATES } from '../../data/profile';
import { fadeUp } from '../../lib/motion';

export function Certificates() {
  const { t } = useTranslation('sections');

  return (
    <Section
      id="certificates"
      heading={t('certificates.heading')}
      subheading={t('certificates.subheading')}
      muted
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.map((cert) => (
          <TiltCard
            key={cert.id}
            variants={fadeUp}
            intensity={6}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200">
                <Award size={22} />
              </span>
              <span className="text-sm font-medium text-accent-600 dark:text-accent-300">
                {cert.year}
              </span>
            </div>
            <h3 className="font-bold leading-snug">{cert.name}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('certificates.issuedBy')}: {cert.issuer}
            </p>
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:underline dark:text-accent-300"
              >
                <ExternalLink size={15} />
                {t('actions.verify', { ns: 'common' })}
              </a>
            )}
          </TiltCard>
        ))}
      </div>
    </Section>
  );
}
