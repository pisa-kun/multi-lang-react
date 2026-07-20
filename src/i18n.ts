import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationJa from './locales/ja/translation.json';
import translationUs from './locales/us/translation.json';

const resources = {
  ja: {
    translation: translationJa,
  },
  us: {
    translation: translationUs,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ja',
  fallbackLng: 'us',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
