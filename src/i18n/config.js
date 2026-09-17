import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslations from './es.json';
import enTranslations from './en.json';
import ptTranslations from './pt.json';
import quTranslations from './qu.json';

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('freemind-lang') : null;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: esTranslations },
      en: { translation: enTranslations },
      pt: { translation: ptTranslations },
      qu: { translation: quTranslations }
    },
    lng: savedLanguage || 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('freemind-lang', lng);
  }
});

export default i18n;

