import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { ThemeColors } from '@/constants/theme';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterPillBarProps {
  options: FilterOption[];
  activeFilter: string;
  onSelectFilter: (filterId: string) => void;
}

export const FilterPillBar = memo(function FilterPillBar({
  options,
  activeFilter,
  onSelectFilter,
}: FilterPillBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {options.map((option) => {
        const isActive = activeFilter === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelectFilter(option.id)}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            style={({ pressed }) => [
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
              pressed && styles.pillPressed,
            ]}>
            <Text
              style={[
                styles.pillText,
                isActive ? styles.pillTextActive : styles.pillTextInactive,
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: ThemeColors.darkNav,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  pillInactive: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  pillPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pillTextActive: {
    color: ThemeColors.white,
  },
  pillTextInactive: {
    color: ThemeColors.textSecondary,
  },
});
