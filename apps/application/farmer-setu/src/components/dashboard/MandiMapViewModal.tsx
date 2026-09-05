import React, { memo, useState, useMemo } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { MandiFilterModal } from './MandiFilterModal';
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
  mandis,
  onSelectMandi,
}: MandiMapViewModalProps) {
  const [selectedMandi, setSelectedMandi] = useState<MandiItem>(mandis[0] || null);
  const [mapSearch, setMapSearch] = useState('');
  const [criteria, setCriteria] = useState<MandiFilterCriteria>(INITIAL_FILTER_CRITERIA);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter Mandis based on search and the full MandiFilterCriteria
  const filteredMandis = useMemo(() => {
    return mandis.filter((m) => {
      // 1. Map top search
      if (mapSearch.trim()) {
        const query = mapSearch.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesDistrict = m.district.toLowerCase().includes(query);
        const matchesCrop = m.topCrop.toLowerCase().includes(query);
        if (!matchesName && !matchesDistrict && !matchesCrop) return false;
      }

      // 2. Crop filter
      const targetCrop = criteria.manualCrop.trim() || (criteria.selectedCrop !== 'All Crops' ? criteria.selectedCrop : '');
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
  }, [mandis, mapSearch, criteria]);

  // Keep selected mandi valid when filter changes
  const currentSelectedMandi = useMemo(() => {
    if (selectedMandi && filteredMandis.some((m) => m.id === selectedMandi.id)) {
      return selectedMandi;
    }
    return filteredMandis[0] || null;
  }, [selectedMandi, filteredMandis]);

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
        {/* Sleek Top Map Header Bar */}
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
              placeholder="Search mandis, district or crop on map..."
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

          {/* Filter Modal Trigger Button (Opens same filter as Mandi page) */}
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
            onPress={() => {
              Alert.alert('GPS Location Calibrated', 'Accurate to 5m • Niphad, Nashik District (Live)');
            }}
            style={({ pressed }) => [styles.gpsBtn, pressed && styles.pressed]}>
            <Ionicons name="locate" size={18} color={ThemeColors.primary} />
          </Pressable>
        </View>

        {/* Active Filter Badges Strip on Map */}
        {hasActiveFilters ? (
          <View style={styles.activeFiltersStrip}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipScroll}>
              {criteria.selectedCrop !== 'All Crops' ? (
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>🌾 {criteria.selectedCrop}</Text>
                </View>
              ) : null}
              {criteria.selectedLocation !== 'All Locations' ? (
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>📍 {criteria.selectedLocation}</Text>
                </View>
              ) : null}
              {criteria.manualDate ? (
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>📅 {criteria.manualDate}</Text>
                </View>
              ) : null}
              {criteria.minFarmers ? (
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>👥 {criteria.minFarmers}+ Farmers</Text>
                </View>
              ) : null}
              <Pressable
                onPress={() => setCriteria(INITIAL_FILTER_CRITERIA)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Text style={styles.clearAllText}>Clear</Text>
              </Pressable>
            </ScrollView>
          </View>
        ) : null}

        {/* Realistic GIS Map Canvas Canvas */}
        <View style={styles.mapCanvas}>
          {/* Vector Road and Terrain Grid Lines */}
          <View style={styles.gridOverlay}>
            <View style={[styles.terrainContour, { top: '15%', left: '-10%', width: '120%', height: 180 }]} />
            <View style={[styles.terrainContour, { top: '55%', right: '-20%', width: '130%', height: 220 }]} />
            
            {/* Highways */}
            <View style={styles.highwayNorthSouth} />
            <View style={styles.highwayEastWest} />
            <View style={styles.diagonalExpressway} />

            {/* River contour */}
            <View style={styles.godavariRiver} />
          </View>

          {/* District Boundary Labels */}
          <Text style={[styles.districtWatermark, { top: '12%', left: '8%' }]}>NIPHAD ZONE</Text>
          <Text style={[styles.districtWatermark, { top: '38%', right: '12%' }]}>LASALGAON MANDI AREA</Text>
          <Text style={[styles.districtWatermark, { bottom: '22%', left: '20%' }]}>PUNE HIGHWAY CORRIDOR</Text>

          {/* User Live Location Marker */}
          <View style={styles.userLocationMarker}>
            <View style={styles.userPulseRing} />
            <View style={styles.userPulseRingInner} />
            <View style={styles.userDot}>
              <Ionicons name="person" size={12} color="#FFFFFF" />
            </View>
            <View style={styles.userLabelCard}>
              <Text style={styles.userLabelText}>YOU (Farm Location)</Text>
            </View>
          </View>

          {/* Dynamic Mandi Marker Pins */}
          {filteredMandis.map((mandi, idx) => {
            const isSelected = currentSelectedMandi?.id === mandi.id;
            
            // Map coordinates relative positions
            const positions = [
              { top: '22%', left: '24%' },
              { top: '34%', right: '18%' },
              { top: '65%', left: '30%' },
              { top: '28%', right: '35%' },
              { top: '72%', right: '22%' },
              { top: '48%', left: '16%' },
            ];
            const pos = positions[idx % positions.length];

            return (
              <Pressable
                key={mandi.id}
                onPress={() => setSelectedMandi(mandi)}
                style={[
                  styles.mandiPinContainer,
                  { top: pos.top as any, left: (pos as any).left, right: (pos as any).right },
                ]}>
                <View
                  style={[
                    styles.pinBadge,
                    isSelected && styles.pinBadgeSelected,
                  ]}>
                  <Ionicons
                    name="storefront"
                    size={12}
                    color={isSelected ? '#FFFFFF' : ThemeColors.primary}
                  />
                  <View>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.pinBadgeText,
                        isSelected && styles.pinBadgeTextSelected,
                      ]}>
                      {mandi.modalPrice.split(' ')[0]}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.pinAnchorDot,
                    isSelected && styles.pinAnchorDotSelected,
                  ]}
                />
              </Pressable>
            );
          })}

          {/* Map Compass & Scale Info */}
          <View style={styles.mapInfoBadge}>
            <Ionicons name="compass-outline" size={14} color={ThemeColors.primary} />
            <Text style={styles.mapInfoText}>Live APMC Vector Radar • {filteredMandis.length} Mandis</Text>
          </View>
        </View>

        {/* Selected Mandi Bottom Floating Sheet Card */}
        {currentSelectedMandi ? (
          <View style={styles.bottomCardContainer}>
            <View style={styles.mandiDetailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.detailTitleCol}>
                  <Text style={styles.detailName}>{currentSelectedMandi.name}</Text>
                  <Text style={styles.detailDistrict}>
                    {currentSelectedMandi.district} • {currentSelectedMandi.distanceKm} km away • {currentSelectedMandi.operatingHours || '08:00 AM - 06:00 PM'}
                  </Text>
                </View>

                <View style={styles.detailPriceBox}>
                  <Text style={styles.detailPrice}>{currentSelectedMandi.modalPrice}</Text>
                  <Text style={styles.detailTrend}>
                    {currentSelectedMandi.trendDirection === 'up' ? '↑ ' : '↓ '}
                    {currentSelectedMandi.priceTrend}
                  </Text>
                </View>
              </View>

              <View style={styles.infoPillsRow}>
                <View style={styles.tagPill}>
                  <Ionicons name="leaf-outline" size={12} color={ThemeColors.primaryDark} />
                  <Text style={styles.tagText}>{currentSelectedMandi.topCrop}</Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="people-outline" size={12} color={ThemeColors.primary} />
                  <Text style={styles.tagText}>{currentSelectedMandi.activeFarmersCount || 85} Farmers</Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="time-outline" size={12} color="#4B5563" />
                  <Text style={styles.tagText}>{currentSelectedMandi.estimatedQueueTime}</Text>
                </View>
                <View style={[styles.tagPill, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="checkmark-circle" size={12} color="#15803D" />
                  <Text style={[styles.tagText, { color: '#15803D' }]}>Gate Open</Text>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  onClose();
                  onSelectMandi(currentSelectedMandi);
                }}
                style={({ pressed }) => [styles.bookPassBtn, pressed && styles.pressed]}>
                <Text style={styles.bookPassText}>Book Gate Entry Pass for {currentSelectedMandi.name.split(' ')[0]}</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Integrated MandiFilterModal (Exact Same as Mandi Page) */}
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

  // Active filter strip
  activeFiltersStrip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChipScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  clearAllText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
    marginLeft: 4,
  },

  // Map Canvas
  mapCanvas: {
    flex: 1,
    backgroundColor: '#EBF4EC',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
  },
  terrainContour: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(187, 247, 208, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.5)',
  },
  highwayNorthSouth: {
    position: 'absolute',
    left: '48%',
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: '#FED7AA',
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#FDBA74',
  },
  highwayEastWest: {
    position: 'absolute',
    top: '46%',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  diagonalExpressway: {
    position: 'absolute',
    top: '20%',
    left: '-20%',
    width: '140%',
    height: 6,
    backgroundColor: '#FEF08A',
    transform: [{ rotate: '28deg' }],
  },
  godavariRiver: {
    position: 'absolute',
    top: '60%',
    left: '-10%',
    width: '120%',
    height: 18,
    backgroundColor: '#BAE6FD',
    borderRadius: 12,
    transform: [{ rotate: '-12deg' }],
    opacity: 0.8,
  },
  districtWatermark: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: 'rgba(107, 114, 128, 0.45)',
  },

  // User Marker
  userLocationMarker: {
    position: 'absolute',
    top: '50%',
    left: '46%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulseRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(22, 163, 74, 0.22)',
  },
  userPulseRingInner: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(22, 163, 74, 0.35)',
  },
  userDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ThemeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userLabelCard: {
    position: 'absolute',
    top: 28,
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  userLabelText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Mandi Markers
  mandiPinContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
  },
  pinBadgeSelected: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primaryDark,
    transform: [{ scale: 1.1 }],
  },
  pinBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  pinBadgeTextSelected: {
    color: '#FFFFFF',
  },
  pinAnchorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ThemeColors.primary,
    marginTop: 2,
  },
  pinAnchorDotSelected: {
    backgroundColor: ThemeColors.primaryDark,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mapInfoBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  mapInfoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },

  // Bottom Detail Card
  bottomCardContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: 'transparent',
  },
  mandiDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  detailTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  detailName: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  detailDistrict: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  detailPriceBox: {
    alignItems: 'flex-end',
  },
  detailPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  detailTrend: {
    fontSize: 11,
    fontWeight: '700',
    color: ThemeColors.primaryDark,
    marginTop: 2,
  },
  infoPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
  bookPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeColors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bookPassText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
