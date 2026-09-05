# Multi-Language Localization Module (`docs/language_module/README.md`)

## Overview
Farmer Setu supports 3 primary languages tailored for agricultural users and APMC market operations in Maharashtra and across India:
1. **English (`en`)** - Standard international interface.
2. **Marathi (`mr` / मराठी)** - Native Marathi dialect adapted for Maharashtra farmers and APMC yards.
3. **Hindi (`hi` / हिंदी)** - Hindi terms optimized for national Kisan users and e-NAM operations.

---

## Architecture & State Management

### 1. Dedicated Types (`apps/application/farmer-setu/src/interfaces/language.interface.ts`)
* `SupportedLanguage`: `'en' | 'mr' | 'hi'`
* `LanguageOption`: `{ code: SupportedLanguage; label: string; nativeLabel: string }`
* `LanguageContextType`: Context interface providing active `language`, async `setLanguage(code)`, string-interpolation `t(key, params)`, and `languageLabel`.

### 2. Dictionaries (`apps/application/farmer-setu/src/constants/translations.ts`)
Comprehensive translations covering:
* **Navigation & Tab bars**: Dashboard, Mandi, Bookings, Profile.
* **Dashboard & Metrics**: Active bookings, crop quantities, market tickers, APMC announcements.
* **Mandi & Discovery**: Filter chips, queue counters, gate slot bookings, price indicators.
* **Kisan KYC & Profile**: GPS location detection, ID proofs (Aadhaar, PAN, Driving License), ImageKit photo uploads.
* **Auth**: Login, registration, OTP verification, validation error banners.

### 3. Persistent Context (`apps/application/farmer-setu/src/context/LanguageContext.tsx`)
* Uses `@farmer_setu_user_language` via `@react-native-async-storage/async-storage`.
* Instant language switching with dynamic re-renders across all screens.
* Supports parameter substitution: e.g. `t('nav.sub.dashboard', { name: farmerName })`.

### 4. UI Components
* **`LanguageSelectorPill` (`apps/application/farmer-setu/src/components/ui/LanguageSelectorPill.tsx`)**: Compact badge pill with globe icon and native language label (`English`, `मराठी`, `हिंदी`) placed on Auth top bars.
* **Profile Settings Selector (`apps/application/farmer-setu/src/components/dashboard/SettingsSectionView.tsx`)**: Dedicated 3-way language switch segmented controls in Kisan settings.

---

## Usage Example

```tsx
import { useLanguage } from '@/context/LanguageContext';

export function MyComponent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View>
      <Text>{t('nav.dashboard')}</Text>
      <Pressable onPress={() => setLanguage('mr')}>
        <Text>मराठी</Text>
      </Pressable>
    </View>
  );
}
```
