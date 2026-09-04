import React, { memo, useState } from 'react';
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
import type { MandiFilterCriteria } from '@/interfaces';

interface MandiFilterModalProps {
  visible: boolean;
  onClose: () => void;
  criteria: MandiFilterCriteria;
  onApply: (criteria: MandiFilterCriteria) => void;
  onReset: () => void;
}

const CROP_LIST = ['All Crops', 'Onion', 'Soybean', 'Cotton', 'Wheat', 'Tomato', 'Maize'];
const LOCATION_LIST = ['All Locations', 'Nashik', 'Lasalgaon', 'Pune', 'Nagpur', 'Ahmednagar'];
const DATE_LIST = ['Today', 'Tomorrow', 'This Weekend', 'Next 7 Days'];
const TIME_SLOTS = ['Any Time', 'Morning (8AM - 12PM)', 'Afternoon (12PM - 4PM)', 'Evening (4PM - 8PM)'];

export const MandiFilterModal = memo(function MandiFilterModal({
  visible,
  onClose,
  criteria,
  onApply,
  onReset,
}: MandiFilterModalProps) {
  const [selectedCrop, setSelectedCrop] = useState(criteria.selectedCrop || 'All Crops');
  const [selectedLocation, setSelectedLocation] = useState(criteria.selectedLocation || 'All Locations');
  const [selectedDate, setSelectedDate] = useState(criteria.selectedDate || 'Today');
  const [timeSlot, setTimeSlot] = useState(criteria.timeSlot || 'Any Time');

  const handleApply = () => {
    onApply({
      ...criteria,
      selectedCrop,
      selectedLocation,
      selectedDate,
      timeSlot,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCrop('All Crops');
    setSelectedLocation('All Locations');
    setSelectedDate('Today');
    setTimeSlot('Any Time');
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Top Sheet Drag Indicator */}
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter APMC Mandis</Text>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={ThemeColors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
            {/* Filter 1: By Crop */}
            <Text style={styles.sectionHeading}>By Crop / Commodity</Text>
            <View style={styles.chipGrid}>
              {CROP_LIST.map((crop) => {
                const active = selectedCrop === crop;
                return (
                  <Pressable
                    key={crop}
                    onPress={() => setSelectedCrop(crop)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}>
                    <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                      {crop}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Filter 2: By Location / APMC District */}
            <Text style={styles.sectionHeading}>By APMC Location</Text>
            <View style={styles.chipGrid}>
              {LOCATION_LIST.map((loc) => {
                const active = selectedLocation === loc;
                return (
                  <Pressable
                    key={loc}
                    onPress={() => setSelectedLocation(loc)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}>
                    <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                      {loc}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Filter 3: By Arrival Date */}
            <Text style={styles.sectionHeading}>Arrival Date</Text>
            <View style={styles.chipGrid}>
              {DATE_LIST.map((d) => {
                const active = selectedDate === d;
                return (
                  <Pressable
                    key={d}
                    onPress={() => setSelectedDate(d)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}>
                    <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                      {d}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Filter 4: Time Slot */}
            <Text style={styles.sectionHeading}>Gate Entry Window</Text>
            <View style={styles.chipGrid}>
              {TIME_SLOTS.map((t) => {
                const active = timeSlot === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setTimeSlot(t)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}>
                    <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                      {t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <Pressable onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>

            <Pressable onPress={handleApply} style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ThemeColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    maxHeight: '85%',
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
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
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: ThemeColors.darkNav,
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
    backgroundColor: ThemeColors.darkNav,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
