import { Platform } from 'react-native';

export const ThemeColors = {
  // Core palette from reference & auth screen
  lavender: '#F97316',
  lavenderLight: '#FFEDD5',
  lavenderDark: '#EA580C',

  mint: '#A4F5A6',
  mintLight: '#ECFCEC',
  mintDark: '#16A34A',
  mintDeep: '#15803D',

  peach: '#FFD89D',
  peachLight: '#FFF7EA',
  peachDark: '#D97706',

  softGray: '#ECEEF0',
  softGrayLight: '#F6F8FA',
  background: '#F8F9FA',

  // Vibrant Brand Orange Floating Navigation Bar
  navBg: 'rgba(249, 115, 22, 0.94)',
  navBorder: 'rgba(255, 255, 255, 0.35)',
  navActiveBg: '#FFFFFF',
  navActiveIcon: '#F97316',
  navInactiveIcon: 'rgba(255, 255, 255, 0.90)',
  darkNav: '#F97316',

  // Consistent Brand Action Colors across entire app - Auth Orange Theme
  primary: '#F97316',
  primaryHover: '#EA580C',
  primaryLight: '#FFEDD5',
  primaryDark: '#C2410C',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textWhite: '#FFFFFF',

  // Utility
  white: '#FFFFFF',
  border: '#E5E7EB',
  borderSubtle: '#F3F4F6',
  cardShadow: 'rgba(0, 0, 0, 0.04)',
} as const;

export type ThemeColorKey = keyof typeof ThemeColors;

// Default Expo template color schemes & tokens
export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#FFFFFF',
    backgroundElement: '#F1F3F5',
    backgroundSelected: '#E6E8EB',
    tint: '#16A34A',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#16A34A',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    backgroundElement: '#222528',
    backgroundSelected: '#2C3035',
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
};

export type ThemeColor =
  | 'text'
  | 'textSecondary'
  | 'background'
  | 'backgroundElement'
  | 'backgroundSelected'
  | 'tint'
  | 'icon'
  | 'tabIconDefault'
  | 'tabIconSelected';

export const Fonts = {
  mono: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    web: 'monospace',
    default: 'monospace',
  }),
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 28,
  eight: 32,
  nine: 36,
  ten: 40,
  eleven: 44,
  twelve: 48,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const MaxContentWidth = 800;
export const BottomTabInset = 80;
