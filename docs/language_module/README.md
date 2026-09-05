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

### 2. Dictionaries & Automatic Translators (`apps/application/farmer-setu/src/constants/translations.ts`)
Comprehensive translations covering:
* **Navigation & Tab bars**: Dashboard, Mandi, Bookings, Profile.
* **Dashboard & Metrics**: Active bookings, crop quantities, market tickers, APMC announcements.
* **Mandi & Discovery**: Filter chips, queue counters, gate slot bookings, price indicators.
* **Dynamic Shop & Mandi Name Localization**: Pure functions `translateMandiName(name, lang)` and `MANDI_NAME_TRANSLATIONS` covering all APMC market yards and sub-yards across Maharashtra in Marathi and Hindi.
* **Dynamic Crop & Commodity Localization**: Pure functions `translateCropName(crop, lang)` and `CROP_NAME_TRANSLATIONS` covering 30+ produce names (e.g., Onion -> कांदा / प्याज, Soybean -> सोयाबीन, Cotton -> कापूस / कपास, Wheat -> गहू / गेहूं).
* **Kisan KYC & Profile**: GPS location detection, ID proofs (Aadhaar, PAN, Driving License), ImageKit photo uploads.
* **Auth**: Login (Remember me, Forgot password, Sign Up), registration, OTP verification, validation error banners.

### 3. Persistent Storage & Fallback Engine (`apps/application/farmer-setu/src/utils/storage.ts`)
* Provides resilient `getStorageItem`, `setStorageItem`, `removeStorageItem`, and `clearStorage` backed by `@react-native-async-storage/async-storage` v2.2.0.
* Includes an in-memory memory fallback cache to eliminate any startup native storage errors.
* Instant language switching with dynamic re-renders across all screens without page reloading.
* Supports parameter substitution: e.g. `t('nav.sub.dashboard', { name: farmerName })`.

### 4. UI Components
* **`LanguageSelectorPill` (`apps/application/farmer-setu/src/components/ui/LanguageSelectorPill.tsx`)**: Compact badge pill with globe icon and native language label (`English`, `मराठी`, `हिंदी`) placed on Auth top bars.
* **Profile Settings Selector (`apps/application/farmer-setu/src/components/dashboard/SettingsSectionView.tsx`)**: Dedicated 3-way language switch segmented controls in Kisan settings.
* **Map & Filter Localization**: OpenStreetMap Leaflet layers and multi-criteria filter modals localize dynamically.

---

## Usage Example

```tsx
import { useLanguage } from '@/context/LanguageContext';
import { translateMandiName, translateCropName } from '@/constants/translations';

export function MandiCard({ mandi }: { mandi: MandiItem }) {
  const { language, t } = useLanguage();

  return (
    <View>
      <Text>{translateMandiName(mandi.name, language)}</Text>
      <Text>{translateCropName(mandi.topCrop, language)}</Text>
      <Text>{t('mandi.book_gate_slot')}</Text>
    </View>
  );
}
```
