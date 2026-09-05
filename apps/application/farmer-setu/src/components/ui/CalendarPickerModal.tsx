import React, { memo, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import type { CalendarPickerModalProps } from '@/interfaces';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const formatDateToString = (year: number, month: number, day: number) => {
  return `${formatNumber(day)}/${formatNumber(month + 1)}/${year}`;
};

export const CalendarPickerModal = memo(function CalendarPickerModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}: CalendarPickerModalProps) {
  // Use currently selected date or current date for initial view
  const initialDate = useMemo(() => {
    if (selectedDate && selectedDate.includes('/')) {
      const parts = selectedDate.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
    }
    return new Date();
  }, [selectedDate]);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const monthName = useMemo(() => {
    const d = new Date(viewYear, viewMonth, 1);
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }, [viewYear, viewMonth]);

  // Generate calendar days grid
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: Array<{
      dayNumber: number;
      isCurrentMonth: boolean;
      dateString: string;
      isToday: boolean;
    }> = [];

    const today = new Date();
    const todayStr = formatDateToString(today.getFullYear(), today.getMonth(), today.getDate());

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      days.push({
        dayNumber: d,
        isCurrentMonth: false,
        dateString: formatDateToString(prevYear, prevMonth, d),
        isToday: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateToString(viewYear, viewMonth, d);
      days.push({
        dayNumber: d,
        isCurrentMonth: true,
        dateString: dateStr,
        isToday: dateStr === todayStr,
      });
    }

    // Next month padding to fill complete grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      days.push({
        dayNumber: d,
        isCurrentMonth: false,
        dateString: formatDateToString(nextYear, nextMonth, d),
        isToday: false,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (dateStr: string) => {
    onSelectDate(dateStr);
    onClose();
  };

  const handleQuickPreset = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dateStr = formatDateToString(d.getFullYear(), d.getMonth(), d.getDate());
    onSelectDate(dateStr);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Select Date</Text>
              <Text style={styles.subtitle}>Choose slot date or quick preset</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={ThemeColors.textPrimary} />
            </Pressable>
          </View>

          {/* Quick Presets */}
          <View style={styles.presetRow}>
            <Pressable
              onPress={() => handleQuickPreset(0)}
              style={styles.presetBtn}>
              <Text style={styles.presetBtnText}>Today</Text>
            </Pressable>
            <Pressable
              onPress={() => handleQuickPreset(1)}
              style={styles.presetBtn}>
              <Text style={styles.presetBtnText}>Tomorrow</Text>
            </Pressable>
            <Pressable
              onPress={() => handleQuickPreset(3)}
              style={styles.presetBtn}>
              <Text style={styles.presetBtnText}>Next 3 Days</Text>
            </Pressable>
            {selectedDate ? (
              <Pressable
                onPress={() => {
                  onSelectDate('');
                  onClose();
                }}
                style={[styles.presetBtn, styles.clearPresetBtn]}>
                <Text style={styles.clearPresetText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>

          {/* Month Navigation */}
          <View style={styles.monthNavRow}>
            <Pressable
              onPress={handlePrevMonth}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.navArrowBtn}>
              <Ionicons name="chevron-back" size={18} color={ThemeColors.textPrimary} />
            </Pressable>
            <Text style={styles.monthTitleText}>{monthName}</Text>
            <Pressable
              onPress={handleNextMonth}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.navArrowBtn}>
              <Ionicons name="chevron-forward" size={18} color={ThemeColors.textPrimary} />
            </Pressable>
          </View>

          {/* Weekday headers */}
          <View style={styles.weekdaysRow}>
            {WEEKDAYS.map((wd) => (
              <Text key={wd} style={styles.weekdayText}>
                {wd}
              </Text>
            ))}
          </View>

          {/* Calendar Day Grid */}
          <View style={styles.daysGrid}>
            {calendarDays.map((item, index) => {
              const isSelected = selectedDate === item.dateString;
              return (
                <Pressable
                  key={`${item.dateString}-${index}`}
                  onPress={() => handleSelectDay(item.dateString)}
                  style={[
                    styles.dayTile,
                    isSelected && styles.dayTileSelected,
                    item.isToday && !isSelected && styles.dayTileToday,
                  ]}>
                  <Text
                    style={[
                      styles.dayText,
                      !item.isCurrentMonth && styles.dayTextOtherMonth,
                      item.isToday && !isSelected && styles.dayTextToday,
                      isSelected && styles.dayTextSelected,
                    ]}>
                    {item.dayNumber}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: ThemeColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  presetBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  clearPresetBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  clearPresetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  monthNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 8,
  },
  navArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  weekdayText: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.textMuted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 6,
  },
  dayTile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTileSelected: {
    backgroundColor: ThemeColors.primary,
  },
  dayTileToday: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  dayTextOtherMonth: {
    color: '#D1D5DB',
    fontWeight: '400',
  },
  dayTextToday: {
    color: '#15803D',
    fontWeight: '800',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
