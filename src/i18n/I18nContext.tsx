import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type LangCode, type TranslationKey } from '../i18n/translations';
import {
  CATEGORY_NAMES, CATEGORY_DESCRIPTIONS, TREATMENT_NAMES,
  PRODUCT_NAMES, PRODUCT_CATEGORIES, PLACEHOLDERS,
} from '../i18n/dbTranslations';

interface I18nContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: TranslationKey) => string;
  tt: (englishText: string) => string;
  tCategoryName: (slug: string) => string;
  tCategoryDesc: (slug: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'rootcosmo-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && translations[saved]) {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    const fontEl = translations[lang]?.font;
    if (fontEl) {
      document.documentElement.style.fontFamily = fontEl.family;
      document.body.style.fontFamily = fontEl.family;
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = (newLang: LangCode) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang]?.strings[key] ?? translations.en.strings[key] ?? key;
  };

  const tt = (englishText: string): string => {
    if (lang === 'en') return englishText;
    return TREATMENT_NAMES[englishText]?.[lang]
      ?? PRODUCT_NAMES[englishText]?.[lang]
      ?? PRODUCT_CATEGORIES[englishText]?.[lang]
      ?? PLACEHOLDERS[englishText]?.[lang]
      ?? CATEGORY_NAMES[Object.keys(CATEGORY_NAMES).find(slug =>
          CATEGORY_NAMES[slug]?.en === englishText
        ) ?? '']?.[lang]
      ?? englishText;
  };

  const tCategoryName = (slug: string): string => {
    return CATEGORY_NAMES[slug]?.[lang] ?? CATEGORY_NAMES[slug]?.en ?? slug;
  };

  const tCategoryDesc = (slug: string): string => {
    return CATEGORY_DESCRIPTIONS[slug]?.[lang] ?? CATEGORY_DESCRIPTIONS[slug]?.en ?? '';
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tt, tCategoryName, tCategoryDesc }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
