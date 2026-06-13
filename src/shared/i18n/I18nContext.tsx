import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Locale = 'es' | 'en';

const STORAGE_KEY = 'nexusflow-locale';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const translations: Record<Locale, Record<string, string>> = {
  es: {
    'nav.shop': 'Tienda',
    'nav.categories': 'Categorías',
    'nav.sustainability': 'Sostenibilidad',
    'nav.support': 'Soporte',
    'checkout.title': 'Finalizar compra',
    'language.label': 'Español (ES)',
  },
  en: {
    'nav.shop': 'Shop',
    'nav.categories': 'Categories',
    'nav.sustainability': 'Sustainability',
    'nav.support': 'Support',
    'checkout.title': 'Checkout',
    'language.label': 'English (EN)',
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored;
  } catch {
    /* ignore */
  }
  return 'es';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const t = useCallback(
    (key: string) => translations[locale][key] ?? translations.es[key] ?? key,
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n debe usarse dentro de I18nProvider');
  return ctx;
}
