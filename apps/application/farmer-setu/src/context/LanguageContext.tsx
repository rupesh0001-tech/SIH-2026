import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '@/constants/translations';
import type { SupportedLanguage, LanguageContextType } from '@/interfaces';

const LANGUAGE_STORAGE_KEY = '@farmer_setu_user_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isReady, setIsReady] = useState(false);

  // Load persisted language preference on app startup
  useEffect(() => {
    async function loadSavedLanguage() {
      try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang === 'en' || savedLang === 'mr' || savedLang === 'hi') {
          setLanguageState(savedLang);
        }
      } catch (err) {
        console.warn('Failed to read saved language:', err);
      } finally {
        setIsReady(true);
      }
    }
    loadSavedLanguage();
  }, []);

  // Update language and persist to storage
  const setLanguage = useCallback(async (newLang: SupportedLanguage) => {
    try {
      setLanguageState(newLang);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (err) {
      console.warn('Failed to save language preference:', err);
    }
  }, []);

  // Pure translation lookup function with string interpolation support: e.g. t('nav.sub.dashboard', { name: 'Ramesh' })
  const t = useCallback(
    (key: string, defaultOrParams?: string | Record<string, string | number>, maybeParams?: Record<string, string | number>): string => {
      let defaultText = typeof defaultOrParams === 'string' ? defaultOrParams : key;
      const params = typeof defaultOrParams === 'object' ? defaultOrParams : maybeParams;

      const langMap = TRANSLATIONS[language] || TRANSLATIONS.en;
      let text = langMap[key] || TRANSLATIONS.en[key] || defaultText;

      if (params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
          text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
        });
      }

      return text;
    },
    [language]
  );

  const languageLabel = useMemo(() => {
    const matched = SUPPORTED_LANGUAGES.find((opt) => opt.code === language);
    return matched ? matched.nativeLabel : 'English';
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languageLabel,
      isReady,
    }),
    [language, setLanguage, t, languageLabel, isReady]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
