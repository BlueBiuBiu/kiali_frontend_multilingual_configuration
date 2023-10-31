import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation_zh from './zh.json';
import translation_en from './en.json';

// 初始化 i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translation_en
    },
    zh: {
      translation: translation_zh
    }
  },
  lng: 'zh',
  interpolation: {
    escapeValue: false
  }
});

// 将全局翻译方法绑定到window对象上  
(window as any).$t = i18n.t;

export default i18n;
