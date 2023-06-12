import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import appConfig from './store/settings'; 

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .use(Backend)
    .init({
      fallbackLng: appConfig.languageAvailable,
      debug: false,
      sSeparator: ':',
      keySeparator: ':',
      ns: ["translations"],
      defaultNS: "translations",
      interpolation: {
        escapeValue: false
      }
});

export default i18n;

