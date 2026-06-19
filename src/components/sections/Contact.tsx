import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Section } from '../ui/Section';
import { SocialLinks } from '../ui/SocialLinks';
import { fadeUp } from '../../lib/motion';
import { PROFILE } from '../../data/profile';
import {
  buildMailtoLink,
  isEmailConfigured,
  isValidEmail,
  sendContactEmail,
} from '../../lib/email';

type Status =
  | 'idle'
  | 'sending'
  | 'success'
  | 'error'
  | 'invalid'
  | 'mailto';

export function Contact() {
  const { t } = useTranslation(['sections', 'common']);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorKey, setErrorKey] = useState<string>('');

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('invalid');
      setErrorKey('contact.validation.required');
      return;
    }
    if (!isValidEmail(form.email)) {
      setStatus('invalid');
      setErrorKey('contact.validation.email');
      return;
    }

    // No EmailJS credentials? Fall back to opening the visitor's mail client
    // with a pre-filled message so the form still works out of the box.
    if (!isEmailConfigured()) {
      const subject = t('contact.mailto.subject', { name: form.name });
      const body = [
        `${t('contact.form.name')}: ${form.name}`,
        `${t('contact.form.email')}: ${form.email}`,
        form.company ? `${t('contact.form.company')}: ${form.company}` : null,
        '',
        form.message,
      ]
        .filter((line) => line !== null)
        .join('\n');
      window.location.href = buildMailtoLink(PROFILE.email, subject, body);
      setStatus('mailto');
      return;
    }

    setStatus('sending');
    try {
      await sendContactEmail(form);
      setStatus('success');
      setForm({ name: '', email: '', company: '', message: '' });
    } catch {
      setStatus('error');
      setErrorKey('contact.status.error');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-accent-900/40';
  const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200';

  return (
    <Section
      id="contact"
      heading={t('contact.heading')}
      subheading={t('contact.subheading')}
    >
      <div className="grid gap-10 md:grid-cols-5">
        <motion.div variants={fadeUp} className="md:col-span-2">
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {t('contact.intro')}
          </p>
          <a
            href={`mailto:${PROFILE.email}`}
            className="mt-5 inline-flex items-center gap-2 font-semibold text-accent-600 hover:underline dark:text-accent-300"
          >
            <Mail size={18} />
            {PROFILE.email}
          </a>
          <div className="mt-6">
            <SocialLinks />
          </div>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={onSubmit}
          noValidate
          className="space-y-4 md:col-span-3"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="c-name">
                {t('contact.form.name')} *
              </label>
              <input
                id="c-name"
                className={inputClass}
                value={form.name}
                onChange={update('name')}
                placeholder={t('contact.form.namePlaceholder')}
                autoComplete="name"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="c-email">
                {t('contact.form.email')} *
              </label>
              <input
                id="c-email"
                type="email"
                className={inputClass}
                value={form.email}
                onChange={update('email')}
                placeholder={t('contact.form.emailPlaceholder')}
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="c-company">
              {t('contact.form.company')}
            </label>
            <input
              id="c-company"
              className={inputClass}
              value={form.company}
              onChange={update('company')}
              placeholder={t('contact.form.companyPlaceholder')}
              autoComplete="organization"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="c-message">
              {t('contact.form.message')} *
            </label>
            <textarea
              id="c-message"
              rows={5}
              className={inputClass}
              value={form.message}
              onChange={update('message')}
              placeholder={t('contact.form.messagePlaceholder')}
            />
          </div>

          {(status === 'invalid' || status === 'error') && (
            <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle size={16} />
              {t(errorKey)}
            </p>
          )}
          {status === 'success' && (
            <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 size={16} />
              {t('contact.status.success')}
            </p>
          )}
          {status === 'mailto' && (
            <p className="flex items-center gap-2 text-sm text-accent-600 dark:text-accent-300">
              <Mail size={16} />
              {t('contact.status.mailto')}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {status === 'sending'
              ? t('actions.sending', { ns: 'common' })
              : t('actions.send', { ns: 'common' })}
          </button>
        </motion.form>
      </div>
    </Section>
  );
}
