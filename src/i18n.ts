import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationJa from './locales/ja/translation.json';
import translationEn from './locales/us/translation.json';
import { DEFAULT_LOCALE, normalizeLocale, readStoredLocale } from './utils/locale';

const resources = {
  ja: {
    translation: translationJa,
  },
  en: {
    translation: translationEn,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: normalizeLocale(readStoredLocale()),
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
