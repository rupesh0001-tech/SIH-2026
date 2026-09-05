import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '@/constants/translations';
import { ThemeColors } from '@/constants/theme';
import type { SupportedLanguage } from '@/interfaces';

interface LanguageSelectorPillProps {
  compact?: boolean;
  style?: object;
}

export const LanguageSelectorPill = memo(function LanguageSelectorPill({
  compact = false,
  style,
}: LanguageSelectorPillProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      {SUPPORTED_LANGUAGES.map((item) => {
        const isActive = language === item.code;
        return (
          <Pressable
            key={item.code}
            onPress={() => setLanguage(item.code as SupportedLanguage)}
            style={({ pressed }) => [
              styles.pill,
              compact && styles.compactPill,
              isActive && styles.pillActive,
              pressed && styles.pressed,
            ]}>
            <Text
              style={[
                styles.pillText,
                compact && styles.compactPillText,
                isActive && styles.pillTextActive,
              ]}>
              {item.nativeLabel}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  compactContainer: {
    padding: 2,
    borderRadius: 10,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
  },
  pillActive: {
    backgroundColor: ThemeColors.primary,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  compactPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.8,
  },
});
