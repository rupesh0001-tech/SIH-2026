import React, { memo, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { MandiFilterModal } from './MandiFilterModal';
import { OpenStreetMapViewer, MapLabelMode } from './OpenStreetMapViewer';
import { useLanguage } from '@/context/LanguageContext';
import { translateMandiName, translateCropName } from '@/constants/translations';
import { useUserLocation } from '@/hooks/useUserLocation';
import { formatDistance } from '@/utils/location.utils';
import type { MandiItem, MandiFilterCriteria } from '@/interfaces';

interface MandiMapViewModalProps {
  visible: boolean;
  onClose: () => void;
  mandis: MandiItem[];
  onSelectMandi: (mandi: MandiItem) => void;
}

const INITIAL_FILTER_CRITERIA: MandiFilterCriteria = {
  searchQuery: '',
  selectedCrop: 'All Crops',
  selectedLocation: 'All Locations',
  selectedDate: 'Today',
  manualDate: '',
  manualCrop: '',
  minFarmers: '',
  timeSlot: 'Any Time',
};

export const MandiMapViewModal = memo(function MandiMapViewModal({
  visible,
  onClose,
  mandis: initialMandis,
  onSelectMandi,
}: MandiMapViewModalProps) {
  const { language, t } = useLanguage();
  const [recenterCounter, setRecenterCounter] = useState<number>(0);
  const [labelMode, setLabelMode] = useState<MapLabelMode>('price');

  // User live location hook via expo-location
  const {
    coordinates: userCoords,
    status: locationStatus,
    errorMessage: locationError,
    locationName,
    isLoading: isLocationLoading,
    refreshLocation,
  } = useUserLocation();

  const [selectedMandi, setSelectedMandi] = useState<MandiItem | null>(null);
  const [mapSearch, setMapSearch] = useState('');
  const [criteria, setCriteria] = useState<MandiFilterCriteria>(INITIAL_FILTER_CRITERIA);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter Mandis based on search and criteria using real passed mandis
  const filteredMandis = useMemo(() => {
    return initialMandis.filter((m) => {
      // 1. Text Search
      if (mapSearch.trim()) {
        const query = mapSearch.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query) || translateMandiName(m.name, language).toLowerCase().includes(query);
        const matchesDistrict = m.district.toLowerCase().includes(query);
        const matchesCrop = m.topCrop.toLowerCase().includes(query) || translateCropName(m.topCrop, language).toLowerCase().includes(query);
        if (!matchesName && !matchesDistrict && !matchesCrop) return false;
      }

      // 2. Crop filter
      const targetCrop =
        criteria.manualCrop.trim() ||
        (criteria.selectedCrop !== 'All Crops' ? criteria.selectedCrop : '');
      if (targetCrop && !m.topCrop.toLowerCase().includes(targetCrop.toLowerCase())) {
        return false;
      }

      // 3. Location filter
      if (criteria.selectedLocation !== 'All Locations') {
        if (!m.district.toLowerCase().includes(criteria.selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // 4. Min Farmers count
      if (criteria.minFarmers.trim()) {
        const min = parseInt(criteria.minFarmers, 10);
        if (!isNaN(min) && (m.activeFarmersCount || 0) < min) {
          return false;
        }
      }

      return true;
    });
  }, [initialMandis, mapSearch, criteria, language]);

  // Keep selected mandi valid
  const currentSelectedMandi = useMemo(() => {
    if (selectedMandi && filteredMandis.some((m) => m.id === selectedMandi.id)) {
      return selectedMandi;
    }
    return filteredMandis[0] || null;
  }, [selectedMandi, filteredMandis]);

  // Recenter map to user location
  const handleRecenterToUser = useCallback(() => {
    setRecenterCounter((prev) => prev + 1);
    Alert.alert(
      t('map.location_calibrated'),
      `GPS: ${locationName}\nLat: ${userCoords.latitude.toFixed(4)}, Lng: ${userCoords.longitude.toFixed(4)}`
    );
  }, [userCoords, locationName, t]);

  const handleOpenDirections = useCallback((mandi: MandiItem) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mandi.latitude},${mandi.longitude}`;
    const displayName = translateMandiName(mandi.name, language);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(t('map.directions'), `${t('map.directions')}: ${displayName} (${mandi.distanceKm} km ${t('mandi.away')})`);
        }
      })
      .catch(() => {
        Alert.alert(t('map.directions'), `${t('map.directions')}: ${displayName} (${mandi.distanceKm} km ${t('mandi.away')})`);
      });
  }, [language, t]);

  const activeFiltersCount =
    (criteria.selectedCrop !== 'All Crops' ? 1 : 0) +
    (criteria.selectedLocation !== 'All Locations' ? 1 : 0) +
    (Boolean(criteria.manualDate) ? 1 : 0) +
    (Boolean(criteria.minFarmers) ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={20} color={ThemeColors.textPrimary} />
          </Pressable>

          {/* Integrated Search Bar inside Header */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color={ThemeColors.primary} />
            <TextInput
              placeholder={t('map.search_placeholder')}
              placeholderTextColor="#9CA3AF"
              value={mapSearch}
              onChangeText={setMapSearch}
              style={styles.searchInput}
            />
            {mapSearch ? (
              <Pressable
                onPress={() => setMapSearch('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </Pressable>
            ) : null}
          </View>

          {/* Filter Modal Trigger Button */}
          <Pressable
            onPress={() => setFilterModalVisible(true)}
            style={({ pressed }) => [
              styles.filterToggleBtn,
              hasActiveFilters && styles.filterToggleActive,
              pressed && styles.pressed,
            ]}>
            <Ionicons
              name="options-outline"
              size={19}
              color={hasActiveFilters ? '#FFFFFF' : ThemeColors.primary}
            />
            {hasActiveFilters ? (
              <View style={styles.activeFilterCountDot}>
                <Text style={styles.activeFilterCountText}>{activeFiltersCount}</Text>
              </View>
            ) : null}
          </Pressable>

          {/* Calibrate GPS button */}
          <Pressable
            onPress={handleRecenterToUser}
            style={({ pressed }) => [styles.gpsBtn, pressed && styles.pressed]}>
            {isLocationLoading ? (
              <ActivityIndicator size="small" color={ThemeColors.primary} />
            ) : (
              <Ionicons name="locate" size={18} color={ThemeColors.primary} />
            )}
          </Pressable>
        </View>

        {/* Location Status & Label Mode Bar */}
        <View style={styles.statusBarRow}>
          {locationStatus === 'denied' || locationError ? (
            <Pressable onPress={refreshLocation} style={styles.statusBannerWarning}>
              <Ionicons name="warning-outline" size={13} color="#B45309" />
              <Text style={styles.statusBannerWarningText} numberOfLines={1}>
                {t('map.gps_restricted')}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.statusBannerSuccess}>
              <View style={styles.liveDot} />
              <Text style={styles.statusBannerSuccessText} numberOfLines={1}>
                {t('map.mandis_count', { name: locationName, count: filteredMandis.length })}
              </Text>
            </View>
          )}

          {/* Map Pin Label Mode Switcher (Price / Name / Crop) */}
          <View style={styles.labelModePills}>
            <Pressable
              onPress={() => setLabelMode('price')}
              style={[styles.labelPill, labelMode === 'price' && styles.labelPillActive]}>
              <Text style={[styles.labelPillText, labelMode === 'price' && styles.labelPillTextActive]}>
                {t('map.price')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setLabelMode('name')}
              style={[styles.labelPill, labelMode === 'name' && styles.labelPillActive]}>
              <Text style={[styles.labelPillText, labelMode === 'name' && styles.labelPillTextActive]}>
                {t('map.name')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setLabelMode('crop')}
              style={[styles.labelPill, labelMode === 'crop' && styles.labelPillActive]}>
              <Text style={[styles.labelPillText, labelMode === 'crop' && styles.labelPillTextActive]}>
                {t('map.crop')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 100% Free OpenStreetMap & Mandi Markers View */}
        <View style={styles.mapCanvas}>
          <OpenStreetMapViewer
            userCoords={userCoords}
            mandis={filteredMandis}
            selectedMandiId={currentSelectedMandi?.id || null}
            labelMode={labelMode}
            onSelectMandi={(mandi) => setSelectedMandi(mandi)}
            recenterTrigger={recenterCounter}
          />

          {/* Floating Re-center FAB */}
          <Pressable
            onPress={handleRecenterToUser}
            style={({ pressed }) => [styles.floatingGpsFab, pressed && styles.pressed]}>
            <Ionicons name="locate" size={20} color={ThemeColors.primary} />
          </Pressable>

          {/* Map Status Badge */}
          <View style={styles.mapInfoBadge}>
            <Ionicons name="map-outline" size={14} color={ThemeColors.primary} />
            <Text style={styles.mapInfoText}>
              {t('map.mandis_live', { count: filteredMandis.length })}
            </Text>
          </View>
        </View>

        {/* Selected Mandi Bottom Floating Sheet Card */}
        {currentSelectedMandi ? (
          <View style={styles.bottomCardContainer}>
            <View style={styles.mandiDetailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.detailTitleCol}>
                  <Text style={styles.detailName}>{translateMandiName(currentSelectedMandi.name, language)}</Text>
                  <Text style={styles.detailDistrict}>
                    {currentSelectedMandi.district} • {formatDistance(currentSelectedMandi.distanceKm)} {t('mandi.away')}
                  </Text>
                  {currentSelectedMandi.address ? (
                    <Text style={styles.detailAddress} numberOfLines={1}>
                      {currentSelectedMandi.address}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.detailPriceBox}>
                  <Text style={styles.detailPrice}>{currentSelectedMandi.modalPrice}</Text>
                  <Text style={styles.detailTrend}>
                    {currentSelectedMandi.trendDirection === 'up' ? '+ ' : '- '}
                    {currentSelectedMandi.priceTrend}
                  </Text>
                </View>
              </View>

              <View style={styles.infoPillsRow}>
                <View style={styles.tagPill}>
                  <Ionicons name="leaf-outline" size={12} color={ThemeColors.primaryDark} />
                  <Text style={styles.tagText}>{translateCropName(currentSelectedMandi.topCrop, language)}</Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="people-outline" size={12} color={ThemeColors.primary} />
                  <Text style={styles.tagText}>
                    {currentSelectedMandi.activeFarmersCount || 85} {t('mandi.in_queue')}
                  </Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="time-outline" size={12} color="#4B5563" />
                  <Text style={styles.tagText}>{currentSelectedMandi.estimatedQueueTime}</Text>
                </View>
                <View style={[styles.tagPill, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="checkmark-circle" size={12} color="#15803D" />
                  <Text style={[styles.tagText, { color: '#15803D' }]}>{t('mandi.open')}</Text>
                </View>
              </View>

              {/* Actions Row */}
              <View style={styles.actionButtonsRow}>
                <Pressable
                  onPress={() => handleOpenDirections(currentSelectedMandi)}
                  style={({ pressed }) => [styles.directionBtn, pressed && styles.pressed]}>
                  <Ionicons name="navigate-outline" size={16} color={ThemeColors.primary} />
                  <Text style={styles.directionBtnText}>{t('map.directions')}</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    onClose();
                    onSelectMandi(currentSelectedMandi);
                  }}
                  style={({ pressed }) => [styles.bookPassBtn, pressed && styles.pressed]}>
                  <Text style={styles.bookPassText}>
                    {t('map.book_slot')} • {translateMandiName(currentSelectedMandi.name, language).split(' ')[0]}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        {/* Integrated MandiFilterModal */}
        <MandiFilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          criteria={criteria}
          onApply={(newCriteria) => {
            setCriteria(newCriteria);
          }}
          onReset={() => {
            setCriteria(INITIAL_FILTER_CRITERIA);
          }}
        />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 38,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  filterToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    position: 'relative',
  },
  filterToggleActive: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primaryDark,
  },
  activeFilterCountDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  gpsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  statusBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusBannerWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    flex: 1,
    marginRight: 8,
  },
  statusBannerWarningText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B45309',
    flex: 1,
  },
  statusBannerSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusBannerSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    flex: 1,
  },
  labelModePills: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  labelPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  labelPillActive: {
    backgroundColor: '#15803D',
  },
  labelPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  labelPillTextActive: {
    color: '#FFFFFF',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E8F5E9',
  },
  floatingGpsFab: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapInfoBadge: {
    position: 'absolute',
    left: 16,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapInfoText: {
    fontSize: 11,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  bottomCardContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  mandiDetailCard: {
    gap: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailTitleCol: {
    flex: 1,
    marginRight: 12,
  },
  detailName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  detailDistrict: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  detailAddress: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  detailPriceBox: {
    alignItems: 'flex-end',
  },
  detailPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15803D',
  },
  detailTrend: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 1,
  },
  infoPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  directionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 6,
  },
  directionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  bookPassBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    height: 44,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bookPassText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
