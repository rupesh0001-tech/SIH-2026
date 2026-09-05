export type SupportedLanguage = 'en' | 'mr' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: (
    key: string,
    defaultOrParams?: string | Record<string, string | number>,
    maybeParams?: Record<string, string | number>
  ) => string;
  languageLabel: string;
  isReady: boolean;
}
