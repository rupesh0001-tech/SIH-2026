import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
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
const FARMER_CHIPS = ['Any Count', '50+ Farmers', '100+ Farmers', '200+ Farmers'];

export const MandiFilterModal = memo(function MandiFilterModal({
  visible,
  onClose,
  criteria,
  onApply,
  onReset,
}: MandiFilterModalProps) {
  const [selectedCrop, setSelectedCrop] = useState(criteria.selectedCrop || 'All Crops');
  const [manualCrop, setManualCrop] = useState(criteria.manualCrop || '');
  const [selectedLocation, setSelectedLocation] = useState(criteria.selectedLocation || 'All Locations');
  const [manualDate, setManualDate] = useState(criteria.manualDate || '');
  const [minFarmers, setMinFarmers] = useState(criteria.minFarmers || '');

  const handleApply = () => {
    onApply({
      ...criteria,
      selectedCrop,
      manualCrop,
      selectedLocation,
      manualDate,
      minFarmers,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCrop('All Crops');
    setManualCrop('');
    setSelectedLocation('All Locations');
    setManualDate('');
    setMinFarmers('');
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
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Filter Mandis & Auctions</Text>
              <Text style={styles.subtitle}>Filter by date, farmers count, and custom crop</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={ThemeColors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
            {/* Filter 1: Crop (Manual + Quick Chips) */}
            <Text style={styles.sectionHeading}>1. Crop / Commodity (Select or Type)</Text>
            <View style={styles.manualInputWrapper}>
              <Ionicons name="leaf-outline" size={16} color={ThemeColors.mintDark} />
              <TextInput
                placeholder="Type custom crop name (e.g. Garlic, Grapes)..."
                placeholderTextColor="#9CA3AF"
                value={manualCrop}
                onChangeText={setManualCrop}
                style={styles.manualInput}
              />
              {manualCrop ? (
                <Pressable onPress={() => setManualCrop('')}>
                  <Ionicons name="close-circle" size={15} color="#9CA3AF" />
                </Pressable>
              ) : null}
            </View>
            <View style={styles.chipGrid}>
              {CROP_LIST.map((crop) => {
                const active = selectedCrop === crop && !manualCrop;
                return (
                  <Pressable
                    key={crop}
                    onPress={() => {
                      setSelectedCrop(crop);
                      setManualCrop('');
                    }}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}>
                    <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                      {crop}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Filter 2: Manual Date Selection */}
            <Text style={styles.sectionHeading}>2. Arrival Date (Manual Entry)</Text>
            <View style={styles.manualInputWrapper}>
              <Ionicons name="calendar-outline" size={16} color={ThemeColors.lavenderDark} />
              <TextInput
                placeholder="Enter date (e.g. 15/09/2026 or Today)..."
                placeholderTextColor="#9CA3AF"
                value={manualDate}
                onChangeText={setManualDate}
                style={styles.manualInput}
              />
              {manualDate ? (
                <Pressable onPress={() => setManualDate('')}>
                  <Ionicons name="close-circle" size={15} color="#9CA3AF" />
                </Pressable>
              ) : null}
            </View>
            <View style={styles.chipGrid}>
              {['Today', 'Tomorrow', 'This Week'].map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setManualDate(d)}
                  style={[styles.chip, manualDate === d ? styles.chipActive : styles.chipInactive]}>
                  <Text style={[styles.chipText, manualDate === d ? styles.chipTextActive : styles.chipTextInactive]}>
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Filter 3: Number of Farmers (Manual Entry) */}
            <Text style={styles.sectionHeading}>3. Active Farmers in Queue (Manual)</Text>
            <View style={styles.manualInputWrapper}>
              <Ionicons name="people-outline" size={16} color={ThemeColors.peachDark} />
              <TextInput
                placeholder="Min number of farmers (e.g. 50)..."
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={minFarmers}
                onChangeText={setMinFarmers}
                style={styles.manualInput}
              />
              {minFarmers ? (
                <Pressable onPress={() => setMinFarmers('')}>
                  <Ionicons name="close-circle" size={15} color="#9CA3AF" />
                </Pressable>
              ) : null}
            </View>
            <View style={styles.chipGrid}>
              {FARMER_CHIPS.map((chip) => {
                const count = chip.replace('Any Count', '').replace('+ Farmers', '').trim();
                const active = minFarmers === count;
                return (
                  <Pressable
                    key={chip}
                    onPress={() => setMinFarmers(count)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}>
                    <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                      {chip}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Filter 4: Location Selection */}
            <Text style={styles.sectionHeading}>4. APMC District / Location</Text>
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
  manualInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 8,
    gap: 8,
  },
  manualInput: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: '#8B5CF6',
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
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
