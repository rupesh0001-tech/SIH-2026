import React, { memo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { SearchablePickerModal } from '@/components/ui/SearchablePickerModal';
import { CalendarPickerModal } from '@/components/ui/CalendarPickerModal';
import type { BookingsFilterCriteria, PickerOption } from '@/interfaces';

interface BookingsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  criteria: BookingsFilterCriteria;
  onApply: (criteria: BookingsFilterCriteria) => void;
  onReset: () => void;
}

const CROP_OPTIONS: PickerOption[] = [
  { label: 'All Crops', value: 'All Crops', sublabel: 'Show bookings for all produce' },
  { label: 'Onion (कांदा)', value: 'Onion', sublabel: 'Nashik Red A-Grade / Garva' },
  { label: 'Soybean (सोयाबीन)', value: 'Soybean', sublabel: 'JS-335 Organic & Commercial' },
  { label: 'Cotton (कापूस)', value: 'Cotton', sublabel: 'Long Staple BT Cotton' },
  { label: 'Wheat (गहू)', value: 'Wheat', sublabel: 'Sharbati Premium' },
  { label: 'Maize (मका)', value: 'Maize', sublabel: 'Yellow Hybrid Grain' },
  { label: 'Tomato (टोमॅटो)', value: 'Tomato', sublabel: 'Fresh crate lots' },
  { label: 'Garlic (लसूण)', value: 'Garlic', sublabel: 'Desi grade' },
  { label: 'Gram (हरभरा)', value: 'Gram', sublabel: 'Desi Chana' },
];

const STATUS_LIST = [
  { id: 'all', label: 'All Status' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
];

const STEP_INCREMENT = 50;

export const BookingsFilterModal = memo(function BookingsFilterModal({
  visible,
  onClose,
  criteria,
  onApply,
  onReset,
}: BookingsFilterModalProps) {
  const [selectedCrop, setSelectedCrop] = useState(criteria.selectedCrop || 'All Crops');
  const [manualDate, setManualDate] = useState(criteria.manualDate || '');
  const [status, setStatus] = useState(criteria.status || 'all');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(() => {
    const parsed = parseInt(criteria.minFarmers, 10);
    return isNaN(parsed) ? 0 : parsed;
  });

  const [cropPickerVisible, setCropPickerVisible] = useState(false);
  const [calendarPickerVisible, setCalendarPickerVisible] = useState(false);

  const handleIncrement = useCallback(() => {
    setQuantityQuintals((prev) => prev + STEP_INCREMENT);
  }, []);

  const handleDecrement = useCallback(() => {
    setQuantityQuintals((prev) => Math.max(0, prev - STEP_INCREMENT));
  }, []);

  const handleApply = () => {
    onApply({
      ...criteria,
      selectedCrop,
      manualCrop: selectedCrop !== 'All Crops' ? selectedCrop : '',
      manualDate,
      minFarmers: quantityQuintals > 0 ? String(quantityQuintals) : '',
      status,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCrop('All Crops');
    setManualDate('');
    setQuantityQuintals(0);
    setStatus('all');
    onReset();
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.dragIndicator} />

            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Filter My Bookings</Text>
                <Text style={styles.subtitle}>Filter gate passes by crop, date, lots & status</Text>
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={ThemeColors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
              {/* 1. Crop Filter (Searchable Dropdown) */}
              <Text style={styles.sectionHeading}>1. Crop / Produce</Text>
              <Pressable
                onPress={() => setCropPickerVisible(true)}
                style={styles.dropdownSelector}>
                <View style={styles.dropdownLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="leaf" size={16} color={ThemeColors.primary} />
                  </View>
                  <View>
                    <Text style={styles.dropdownValue}>
                      {selectedCrop === 'All Crops' ? 'All Crops (सर्व पिके)' : selectedCrop}
                    </Text>
                    <Text style={styles.dropdownHint}>Tap to search and select booked crop</Text>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={18} color={ThemeColors.textSecondary} />
              </Pressable>

              {/* 2. Slot Date Filter (Calendar Picker) */}
              <Text style={styles.sectionHeading}>2. Slot Booking Date</Text>
              <Pressable
                onPress={() => setCalendarPickerVisible(true)}
                style={styles.dropdownSelector}>
                <View style={styles.dropdownLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="calendar" size={16} color={ThemeColors.primary} />
                  </View>
                  <View>
                    <Text style={styles.dropdownValue}>
                      {manualDate ? manualDate : 'Any Date (सर्व तारखा)'}
                    </Text>
                    <Text style={styles.dropdownHint}>Tap to open calendar picker</Text>
                  </View>
                </View>
                {manualDate ? (
                  <Pressable
                    onPress={() => setManualDate('')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                  </Pressable>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={ThemeColors.textSecondary} />
                )}
              </Pressable>

              {/* 3. Quantity Stepper (+ / -) */}
              <Text style={styles.sectionHeading}>3. Minimum Quantity / Lot Size</Text>
              <View style={styles.stepperContainer}>
                <View style={styles.stepperLabelCol}>
                  <Text style={styles.stepperValueText}>
                    {quantityQuintals === 0 ? 'Any Quantity' : `${quantityQuintals}+ Quintals`}
                  </Text>
                  <Text style={styles.stepperSubtext}>
                    {quantityQuintals === 0 ? 'Showing all bookings' : `At least ${quantityQuintals} Quintals lot size`}
                  </Text>
                </View>

                <View style={styles.stepperControls}>
                  <Pressable
                    onPress={handleDecrement}
                    disabled={quantityQuintals === 0}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={[styles.stepBtn, quantityQuintals === 0 && styles.stepBtnDisabled]}>
                    <Ionicons
                      name="remove"
                      size={18}
                      color={quantityQuintals === 0 ? '#9CA3AF' : ThemeColors.textPrimary}
                    />
                  </Pressable>

                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>
                      {quantityQuintals === 0 ? '0' : quantityQuintals}
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleIncrement}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.stepBtn}>
                    <Ionicons name="add" size={18} color={ThemeColors.textPrimary} />
                  </Pressable>
                </View>
              </View>

              {/* 4. Slot Status */}
              <Text style={styles.sectionHeading}>4. Booking Status</Text>
              <View style={styles.chipGrid}>
                {STATUS_LIST.map((s) => {
                  const active = status === s.id;
                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => setStatus(s.id)}
                      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}>
                      <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                        {s.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Action Footer */}
            <View style={styles.footer}>
              <Pressable onPress={handleReset} style={styles.resetBtn}>
                <Text style={styles.resetText}>Reset All</Text>
              </Pressable>

              <Pressable onPress={handleApply} style={styles.applyBtn}>
                <Text style={styles.applyText}>Apply Filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Searchable Crop Picker Modal */}
      <SearchablePickerModal
        visible={cropPickerVisible}
        title="Select produce to filter bookings"
        placeholder="Search produce (e.g. Onion, Wheat, Cotton)..."
        options={CROP_OPTIONS}
        selectedValue={selectedCrop}
        onSelect={(val) => setSelectedCrop(val)}
        onClose={() => setCropPickerVisible(false)}
      />

      {/* Calendar Date Picker Modal */}
      <CalendarPickerModal
        visible={calendarPickerVisible}
        selectedDate={manualDate}
        onSelectDate={(val) => setManualDate(val)}
        onClose={() => setCalendarPickerVisible(false)}
      />
    </>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ThemeColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    maxHeight: '88%',
  },
  dragIndicator: {
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
    marginBottom: 14,
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
  body: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.textSecondary,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 4,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownValue: {
    fontSize: 14,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  dropdownHint: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  stepperLabelCol: {
    flex: 1,
  },
  stepperValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  stepperSubtext: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  stepBtnDisabled: {
    opacity: 0.4,
    backgroundColor: '#F3F4F6',
  },
  stepBadge: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 15,
    fontWeight: '800',
    color: ThemeColors.primaryDark,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  chipActive: {
    backgroundColor: ThemeColors.primary,
  },
  chipInactive: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: ThemeColors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
    color: ThemeColors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
