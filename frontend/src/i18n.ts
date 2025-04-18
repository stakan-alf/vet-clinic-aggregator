import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ru: {
        translation: require('./locales/ru/translation.json'),
      },
      en: {
        translation: require('./locales/en/translation.json'),
      },
      de: {
        translation: require('./locales/de/translation.json'),
      },
    },
  });

export default i18n; 