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
import type { MandiFilterCriteria, PickerOption } from '@/interfaces';

interface MandiFilterModalProps {
  visible: boolean;
  onClose: () => void;
  criteria: MandiFilterCriteria;
  onApply: (criteria: MandiFilterCriteria) => void;
  onReset: () => void;
}

const CROP_OPTIONS: PickerOption[] = [
  { label: 'All Crops', value: 'All Crops', sublabel: 'Show mandis for all produce' },
  { label: 'Onion (कांदा)', value: 'Onion', sublabel: 'Red & White Garva varieties', badge: 'High Volume' },
  { label: 'Soybean (सोयाबीन)', value: 'Soybean', sublabel: 'JS-335 & Organic lots', badge: 'Trending' },
  { label: 'Cotton (कापूस)', value: 'Cotton', sublabel: 'Long Staple BT Cotton', badge: 'MSP Active' },
  { label: 'Wheat (गहू)', value: 'Wheat', sublabel: 'Sharbati, Lokwan & Premium' },
  { label: 'Tomato (टोमॅटो)', value: 'Tomato', sublabel: 'Hybrid & Semi-ripened lots' },
  { label: 'Maize (मका)', value: 'Maize', sublabel: 'Yellow Grain & Hybrid' },
  { label: 'Garlic (लसूण)', value: 'Garlic', sublabel: 'Desi & Ooty varieties' },
  { label: 'Grapes (द्राक्षे)', value: 'Grapes', sublabel: 'Thomson Seedless & Export' },
  { label: 'Gram / Chana (हरभरा)', value: 'Gram', sublabel: 'Desi Brown & Kabuli' },
  { label: 'Pomegranate (डाळिंब)', value: 'Pomegranate', sublabel: 'Bhagwa & Arakta' },
  { label: 'Ginger (आले)', value: 'Ginger', sublabel: 'Fresh root & dry grade' },
  { label: 'Turmeric (हळद)', value: 'Turmeric', sublabel: 'Salem & Nizamabad variety' },
  { label: 'Groundnut (भुईमूग)', value: 'Groundnut', sublabel: 'Pods & Shelled seed' },
];

const LOCATION_OPTIONS: PickerOption[] = [
  { label: 'All Locations', value: 'All Locations', sublabel: 'Mandis across Maharashtra' },
  { label: 'Nashik (नाशिक)', value: 'Nashik', sublabel: 'APMC Market Yard, Dindori Rd' },
  { label: 'Lasalgaon (लासलगाव)', value: 'Lasalgaon', sublabel: 'Asia\'s largest onion market' },
  { label: 'Pune (पुणे)', value: 'Pune', sublabel: 'Gultekdi Market Yard' },
  { label: 'Nagpur (नागपूर)', value: 'Nagpur', sublabel: 'Cotton & Grain APMC Hub' },
  { label: 'Ahmednagar (अहमदनगर)', value: 'Ahmednagar', sublabel: 'Grain, Pulse & Jaggery Market' },
  { label: 'Pimpalgaon (पिंपळगाव)', value: 'Pimpalgaon', sublabel: 'Baswant Yard, Nashik District' },
  { label: 'Solapur (सोलापूर)', value: 'Solapur', sublabel: 'Siddheshwar APMC Yard' },
  { label: 'Kolhapur (कोल्हापूर)', value: 'Kolhapur', sublabel: 'Shahu Market Yard' },
  { label: 'Amravati (अमरावती)', value: 'Amravati', sublabel: 'Cotton & Soybean Hub' },
];

const STEP_INCREMENT = 25;

export const MandiFilterModal = memo(function MandiFilterModal({
  visible,
  onClose,
  criteria,
  onApply,
  onReset,
}: MandiFilterModalProps) {
  const [selectedCrop, setSelectedCrop] = useState(criteria.selectedCrop || 'All Crops');
  const [selectedLocation, setSelectedLocation] = useState(criteria.selectedLocation || 'All Locations');
  const [manualDate, setManualDate] = useState(criteria.manualDate || '');
  const [farmerCount, setFarmerCount] = useState<number>(() => {
    const parsed = parseInt(criteria.minFarmers, 10);
    return isNaN(parsed) ? 0 : parsed;
  });

  // Modal controls for dropdowns & calendar
  const [cropPickerVisible, setCropPickerVisible] = useState(false);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [calendarPickerVisible, setCalendarPickerVisible] = useState(false);

  const handleIncrementCount = useCallback(() => {
    setFarmerCount((prev) => prev + STEP_INCREMENT);
  }, []);

  const handleDecrementCount = useCallback(() => {
    setFarmerCount((prev) => Math.max(0, prev - STEP_INCREMENT));
  }, []);

  const handleApply = () => {
    onApply({
      ...criteria,
      selectedCrop,
      selectedLocation,
      manualDate,
      minFarmers: farmerCount > 0 ? String(farmerCount) : '',
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCrop('All Crops');
    setSelectedLocation('All Locations');
    setManualDate('');
    setFarmerCount(0);
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
                <Text style={styles.title}>Filter Mandis & Auctions</Text>
                <Text style={styles.subtitle}>Refine market rates by crop, location, date & volume</Text>
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={ThemeColors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
              {/* 1. Crop Dropdown (Searchable) */}
              <Text style={styles.sectionHeading}>1. Crop / Commodity</Text>
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
                    <Text style={styles.dropdownHint}>Tap to search and pick from crop list</Text>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={18} color={ThemeColors.textSecondary} />
              </Pressable>

              {/* 2. Location Dropdown (Searchable) */}
              <Text style={styles.sectionHeading}>2. Mandi District / Yard Location</Text>
              <Pressable
                onPress={() => setLocationPickerVisible(true)}
                style={styles.dropdownSelector}>
                <View style={styles.dropdownLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="location" size={16} color={ThemeColors.primary} />
                  </View>
                  <View>
                    <Text style={styles.dropdownValue}>
                      {selectedLocation === 'All Locations' ? 'All Locations (सर्व बाजार समित्या)' : selectedLocation}
                    </Text>
                    <Text style={styles.dropdownHint}>Tap to search and pick APMC mandi location</Text>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={18} color={ThemeColors.textSecondary} />
              </Pressable>

              {/* 3. Date Selection (Calendar Picker) */}
              <Text style={styles.sectionHeading}>3. Auction Arrival Date</Text>
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

              {/* 4. Quantity / Farmer Count Stepper (+ / -) */}
              <Text style={styles.sectionHeading}>4. Active Farmers in Queue (Min Count)</Text>
              <View style={styles.stepperContainer}>
                <View style={styles.stepperLabelCol}>
                  <Text style={styles.stepperValueText}>
                    {farmerCount === 0 ? 'Any Count' : `${farmerCount}+ Farmers`}
                  </Text>
                  <Text style={styles.stepperSubtext}>
                    {farmerCount === 0 ? 'Showing all mandis regardless of traffic' : `At least ${farmerCount} registered farmers`}
                  </Text>
                </View>

                <View style={styles.stepperControls}>
                  <Pressable
                    onPress={handleDecrementCount}
                    disabled={farmerCount === 0}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={[styles.stepBtn, farmerCount === 0 && styles.stepBtnDisabled]}>
                    <Ionicons
                      name="remove"
                      size={18}
                      color={farmerCount === 0 ? '#9CA3AF' : ThemeColors.textPrimary}
                    />
                  </Pressable>

                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>
                      {farmerCount === 0 ? '0' : farmerCount}
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleIncrementCount}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.stepBtn}>
                    <Ionicons name="add" size={18} color={ThemeColors.textPrimary} />
                  </Pressable>
                </View>
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
        title="Select Crop / Produce"
        placeholder="Search crops (e.g. Onion, Soybean, Cotton)..."
        options={CROP_OPTIONS}
        selectedValue={selectedCrop}
        onSelect={(val) => setSelectedCrop(val)}
        onClose={() => setCropPickerVisible(false)}
      />

      {/* Searchable Location Picker Modal */}
      <SearchablePickerModal
        visible={locationPickerVisible}
        title="Select Mandi Location"
        placeholder="Search location (e.g. Nashik, Lasalgaon, Pune)..."
        options={LOCATION_OPTIONS}
        selectedValue={selectedLocation}
        onSelect={(val) => setSelectedLocation(val)}
        onClose={() => setLocationPickerVisible(false)}
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
