import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation_en from './en/translation.json';
import translation_ru from './ru/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translation_en,
    },
    ru: {
      translation: translation_ru,
    },
  },
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
