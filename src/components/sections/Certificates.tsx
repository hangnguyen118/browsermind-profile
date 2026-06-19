import { useTranslation } from 'react-i18next';
import { Award, ExternalLink } from 'lucide-react';
import { Section } from '../ui/Section';
import { TiltCard } from '../ui/TiltCard';
import { CERTIFICATES } from '../../data/profile';
import { fadeUp } from '../../lib/motion';
import { openSidePanel } from '../../lib/sidePanelBus';
import type { CertificateItem } from '../../types';

export function Certificates() {
  const { t } = useTranslation('sections');

  // Open the certificate in the left side panel: the PDF if we have one,
  // otherwise a small details "blog" card with the verify link.
  const view = (cert: CertificateItem) => {
    if (cert.pdfUrl) {
      openSidePanel({
        kind: 'pdf',
        title: cert.name,
        subtitle: `${cert.issuer} · ${cert.year}`,
        url: cert.pdfUrl,
      });
      return;
    }
    openSidePanel({
      kind: 'blog',
      title: cert.name,
      subtitle: `${cert.issuer} · ${cert.year}`,
      html: `
        <h2>${cert.name}</h2>
        <p>${t('certificates.issuedBy')}: <strong>${cert.issuer}</strong></p>
        <p>${cert.year}</p>
        ${
          cert.verifyUrl
            ? `<p><a href="${cert.verifyUrl}" target="_blank" rel="noopener noreferrer">${t('actions.verify', { ns: 'common' })}</a></p>`
            : ''
        }
      `,
    });
  };

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
            role="button"
            tabIndex={0}
            onClick={() => view(cert)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                view(cert);
              }
            }}
            aria-label={cert.name}
            className="flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 dark:border-gray-800 dark:bg-gray-900"
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
                onClick={(e) => e.stopPropagation()}
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
