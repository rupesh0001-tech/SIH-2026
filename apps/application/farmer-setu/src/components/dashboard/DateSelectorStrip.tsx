import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { ThemeColors } from '@/constants/theme';
import type { DayPickerItem } from '@/interfaces';

interface DateSelectorStripProps {
  days: DayPickerItem[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
}

export const DateSelectorStrip = memo(function DateSelectorStrip({
  days,
  selectedDateKey,
  onSelectDate,
}: DateSelectorStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {days.map((day) => {
        const isSelected = selectedDateKey === day.dateKey;
        return (
          <Pressable
            key={day.dateKey}
            onPress={() => onSelectDate(day.dateKey)}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            style={({ pressed }) => [
              styles.dayCard,
              isSelected ? styles.dayCardSelected : styles.dayCardDefault,
              pressed && styles.cardPressed,
            ]}>
            <Text
              style={[
                styles.dayName,
                isSelected ? styles.dayNameSelected : styles.dayNameDefault,
              ]}>
              {day.dayName}
            </Text>
            <Text
              style={[
                styles.dayNumber,
                isSelected ? styles.dayNumberSelected : styles.dayNumberDefault,
              ]}>
              {day.dayNumber}
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
    paddingVertical: 10,
    gap: 10,
    alignItems: 'center',
  },
  dayCard: {
    width: 62,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayCardDefault: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  dayCardSelected: {
    backgroundColor: ThemeColors.lavender,
    shadowColor: ThemeColors.lavender,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNameDefault: {
    color: ThemeColors.textSecondary,
  },
  dayNameSelected: {
    color: ThemeColors.white,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  dayNumberDefault: {
    color: ThemeColors.textPrimary,
  },
  dayNumberSelected: {
    color: ThemeColors.white,
  },
});
