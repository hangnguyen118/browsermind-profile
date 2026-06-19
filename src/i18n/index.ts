import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from './vi/common.json';
import viSections from './vi/sections.json';
import viChatbot from './vi/chatbot.json';
import enCommon from './en/common.json';
import enSections from './en/sections.json';
import enChatbot from './en/chatbot.json';

export const resources = {
  vi: { common: viCommon, sections: viSections, chatbot: viChatbot },
  en: { common: enCommon, sections: enSections, chatbot: enChatbot },
} as const;

export const SUPPORTED_LANGS = ['vi', 'en'] as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS,
    defaultNS: 'common',
    ns: ['common', 'sections', 'chatbot'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
  });

// Keep <html lang> in sync for a11y / SEO.
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
});

export default i18n;
