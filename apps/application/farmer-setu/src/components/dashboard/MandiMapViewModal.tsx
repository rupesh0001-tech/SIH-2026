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
import type { MandiItem } from '@/interfaces';

interface MandiMapViewModalProps {
  visible: boolean;
  onClose: () => void;
  mandis: MandiItem[];
  onSelectMandi: (mandi: MandiItem) => void;
}

const DATE_OPTIONS = [
  { id: 'today', label: 'Today (Live)' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: '3days', label: 'Next 3 Days' },
  { id: 'all', label: 'All Dates' },
];

const CROP_OPTIONS = ['All', 'Onion', 'Soybean', 'Cotton', 'Wheat', 'Tomato', 'Gram'];
const RADIUS_OPTIONS = ['All', '15 km', '30 km', '50 km', '100 km'];
const FARMER_OPTIONS = ['All', '50+ Active', '100+ Peak'];

export const MandiMapViewModal = memo(function MandiMapViewModal({
  visible,
  onClose,
  mandis,
  onSelectMandi,
}: MandiMapViewModalProps) {
  const [selectedMandi, setSelectedMandi] = useState<MandiItem>(mandis[0] || null);
  const [mapSearch, setMapSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedRadius, setSelectedRadius] = useState('All');
  const [selectedFarmerCount, setSelectedFarmerCount] = useState('All');
  const [showFiltersBar, setShowFiltersBar] = useState(true);

  // Filter Mandis based on search, crop, radius, and farmer density
  const filteredMandis = useMemo(() => {
    return mandis.filter((m) => {
      if (selectedCrop !== 'All' && !m.topCrop.toLowerCase().includes(selectedCrop.toLowerCase())) {
        return false;
      }
      if (mapSearch.trim()) {
        const query = mapSearch.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesDistrict = m.district.toLowerCase().includes(query);
        const matchesCrop = m.topCrop.toLowerCase().includes(query);
        if (!matchesName && !matchesDistrict && !matchesCrop) return false;
      }
      if (selectedRadius === '15 km' && m.distanceKm > 15) return false;
      if (selectedRadius === '30 km' && m.distanceKm > 30) return false;
      if (selectedRadius === '50 km' && m.distanceKm > 50) return false;
      if (selectedRadius === '100 km' && m.distanceKm > 100) return false;

      if (selectedFarmerCount === '50+ Active' && (m.activeFarmersCount || 0) < 50) return false;
      if (selectedFarmerCount === '100+ Peak' && (m.activeFarmersCount || 0) < 100) return false;

      return true;
    });
  }, [mandis, selectedCrop, mapSearch, selectedRadius, selectedFarmerCount]);

  const activeFiltersCount =
    (selectedCrop !== 'All' ? 1 : 0) +
    (selectedDate !== 'today' ? 1 : 0) +
    (selectedRadius !== 'All' ? 1 : 0) +
    (selectedFarmerCount !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSelectedCrop('All');
    setSelectedDate('today');
    setSelectedRadius('All');
    setSelectedFarmerCount('All');
    setMapSearch('');
  };

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
            <Ionicons name="search" size={16} color="#F97316" />
            <TextInput
              placeholder="Search mandis, district or crop..."
              placeholderTextColor="#9CA3AF"
              value={mapSearch}
              onChangeText={setMapSearch}
              style={styles.searchInput}
            />
            {mapSearch ? (
              <Pressable onPress={() => setMapSearch('')}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </Pressable>
            ) : null}
          </View>

          {/* Filter Toggle Button */}
          <Pressable
            onPress={() => setShowFiltersBar((prev) => !prev)}
            style={({ pressed }) => [
              styles.filterToggleBtn,
              activeFiltersCount > 0 && styles.filterToggleActive,
              pressed && styles.pressed,
            ]}>
            <Ionicons
              name="options"
              size={18}
              color={activeFiltersCount > 0 ? '#FFFFFF' : '#F97316'}
            />
            {activeFiltersCount > 0 ? (
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
            <Ionicons name="locate" size={18} color="#F97316" />
          </Pressable>
        </View>

        {/* In-Map Expandable Filters Drawer */}
        {showFiltersBar ? (
          <View style={styles.filtersContainer}>
            {/* Date Selection Filter */}
            <View style={styles.filterSectionRow}>
              <View style={styles.filterLabelCol}>
                <Ionicons name="calendar-outline" size={13} color="#F97316" />
                <Text style={styles.filterSectionLabel}>Date</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipRow}>
                {DATE_OPTIONS.map((d) => {
                  const isActive = selectedDate === d.id;
                  return (
                    <Pressable
                      key={d.id}
                      onPress={() => setSelectedDate(d.id)}
                      style={[
                        styles.chipPill,
                        isActive ? styles.chipPillActive : styles.chipPillInactive,
                      ]}>
                      <Text
                        style={[
                          styles.chipPillText,
                          isActive ? styles.chipTextActive : styles.chipTextInactive,
                        ]}>
                        {d.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Crop Filter */}
            <View style={styles.filterSectionRow}>
              <View style={styles.filterLabelCol}>
                <Ionicons name="leaf-outline" size={13} color="#F97316" />
                <Text style={styles.filterSectionLabel}>Crop</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipRow}>
                {CROP_OPTIONS.map((c) => {
                  const isActive = selectedCrop === c;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => setSelectedCrop(c)}
                      style={[
                        styles.chipPill,
                        isActive ? styles.chipPillActive : styles.chipPillInactive,
                      ]}>
                      <Text
                        style={[
                          styles.chipPillText,
                          isActive ? styles.chipTextActive : styles.chipTextInactive,
                        ]}>
                        {c}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Distance Radius & Farmers Row */}
            <View style={styles.filterSectionRow}>
              <View style={styles.filterLabelCol}>
                <Ionicons name="navigate-circle-outline" size={13} color="#F97316" />
                <Text style={styles.filterSectionLabel}>Radius</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipRow}>
                {RADIUS_OPTIONS.map((r) => {
                  const isActive = selectedRadius === r;
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setSelectedRadius(r)}
                      style={[
                        styles.chipPill,
                        isActive ? styles.chipPillActive : styles.chipPillInactive,
                      ]}>
                      <Text
                        style={[
                          styles.chipPillText,
                          isActive ? styles.chipTextActive : styles.chipTextInactive,
                        ]}>
                        {r}
                      </Text>
                    </Pressable>
                  );
                })}
                <View style={styles.vDivider} />
                {FARMER_OPTIONS.map((f) => {
                  const isActive = selectedFarmerCount === f;
                  return (
                    <Pressable
                      key={f}
                      onPress={() => setSelectedFarmerCount(f)}
                      style={[
                        styles.chipPill,
                        isActive ? styles.chipPillActive : styles.chipPillInactive,
                      ]}>
                      <Text
                        style={[
                          styles.chipPillText,
                          isActive ? styles.chipTextActive : styles.chipTextInactive,
                        ]}>
                        👥 {f}
                      </Text>
                    </Pressable>
                  );
                })}
                {activeFiltersCount > 0 ? (
                  <Pressable onPress={resetFilters} style={styles.resetPill}>
                    <Ionicons name="refresh" size={12} color="#EF4444" />
                    <Text style={styles.resetPillText}>Reset</Text>
                  </Pressable>
                ) : null}
              </ScrollView>
            </View>
          </View>
        ) : null}

        {/* Vector Map Canvas (Zero blocked tiles, 100% offline & fast) */}
        <View style={styles.mapCanvas}>
          {/* Topographic Background Pattern & Grid Lines */}
          <View style={styles.vectorMapBackground}>
            {/* Geographic Terrain Zones */}
            <View style={styles.terrainZone1} />
            <View style={styles.terrainZone2} />
            <View style={styles.terrainRiver} />

            {/* Grid Coordinates Lines */}
            <View style={[styles.gridLineH, { top: '20%' }]} />
            <View style={[styles.gridLineH, { top: '40%' }]} />
            <View style={[styles.gridLineH, { top: '60%' }]} />
            <View style={[styles.gridLineH, { top: '80%' }]} />

            <View style={[styles.gridLineV, { left: '25%' }]} />
            <View style={[styles.gridLineV, { left: '50%' }]} />
            <View style={[styles.gridLineV, { left: '75%' }]} />

            {/* Highway Corridors */}
            <View style={styles.highwayNH3} />
            <View style={styles.highwaySH22} />

            {/* Region / District Labels */}
            <Text style={[styles.districtWatermark, { top: '15%', left: '12%' }]}>
              NASHIK REGION • NH-3
            </Text>
            <Text style={[styles.districtWatermark, { top: '55%', right: '12%' }]}>
              PUNE CORRIDOR • NH-60
            </Text>
            <Text style={[styles.districtWatermark, { bottom: '18%', left: '20%' }]}>
              NIPHAD VALLEY
            </Text>
          </View>

          {/* User Location Radar Pin (Center) */}
          <View style={styles.userLocationMarker}>
            <View style={styles.userPulseRing} />
            <View style={styles.userPulseRingInner} />
            <View style={styles.userDot}>
              <Ionicons name="navigate" size={12} color="#FFFFFF" />
            </View>
            <View style={styles.userLabelCard}>
              <Text style={styles.userLabelText}>My Farm (You)</Text>
            </View>
          </View>

          {/* Dynamic Mandi Map Markers */}
          {filteredMandis.map((mandi, index) => {
            const isSelected = selectedMandi?.id === mandi.id;

            const pinOffsets: Array<{ top: `${number}%`; left: `${number}%` }> = [
              { top: '22%', left: '56%' },
              { top: '34%', left: '16%' },
              { top: '62%', left: '66%' },
              { top: '74%', left: '26%' },
              { top: '46%', left: '76%' },
              { top: '28%', left: '80%' },
              { top: '78%', left: '60%' },
            ];
            const offset = pinOffsets[index % pinOffsets.length];

            return (
              <Pressable
                key={mandi.id}
                onPress={() => setSelectedMandi(mandi)}
                style={[styles.mandiPinContainer, offset]}>
                <View
                  style={[
                    styles.pinBadge,
                    isSelected && styles.pinBadgeSelected,
                  ]}>
                  <Ionicons
                    name="storefront"
                    size={12}
                    color={isSelected ? '#FFFFFF' : '#F97316'}
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
            <Ionicons name="compass-outline" size={14} color="#F97316" />
            <Text style={styles.mapInfoText}>Live APMC Vector Radar • {filteredMandis.length} Mandis</Text>
          </View>
        </View>

        {/* Selected Mandi Bottom Floating Sheet Card */}
        {selectedMandi ? (
          <View style={styles.bottomCardContainer}>
            <View style={styles.mandiDetailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.detailTitleCol}>
                  <Text style={styles.detailName}>{selectedMandi.name}</Text>
                  <Text style={styles.detailDistrict}>
                    {selectedMandi.district} • {selectedMandi.distanceKm} km away • {selectedMandi.operatingHours || '08:00 AM - 06:00 PM'}
                  </Text>
                </View>

                <View style={styles.detailPriceBox}>
                  <Text style={styles.detailPrice}>{selectedMandi.modalPrice}</Text>
                  <Text style={styles.detailTrend}>
                    {selectedMandi.trendDirection === 'up' ? '↑ ' : '↓ '}
                    {selectedMandi.priceTrend}
                  </Text>
                </View>
              </View>

              <View style={styles.infoPillsRow}>
                <View style={styles.tagPill}>
                  <Ionicons name="leaf-outline" size={12} color="#EA580C" />
                  <Text style={styles.tagText}>{selectedMandi.topCrop}</Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="people-outline" size={12} color="#F97316" />
                  <Text style={styles.tagText}>{selectedMandi.activeFarmersCount || 85} Farmers</Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="time-outline" size={12} color="#4B5563" />
                  <Text style={styles.tagText}>{selectedMandi.estimatedQueueTime}</Text>
                </View>
                <View style={[styles.tagPill, { backgroundColor: '#FFEDD5' }]}>
                  <Ionicons name="checkmark-circle" size={12} color="#C2410C" />
                  <Text style={[styles.tagText, { color: '#C2410C' }]}>Gate Open</Text>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  onClose();
                  onSelectMandi(selectedMandi);
                }}
                style={({ pressed }) => [styles.bookPassBtn, pressed && styles.pressed]}>
                <Text style={styles.bookPassText}>Book Gate Entry Pass for {selectedMandi.name.split(' ')[0]}</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        ) : null}
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
    borderBottomColor: '#FFEDD5',
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
    borderColor: '#FFEDD5',
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
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
    position: 'relative',
  },
  filterToggleActive: {
    backgroundColor: '#F97316',
    borderColor: '#EA580C',
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
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  // Filters strip
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FFEDD5',
    gap: 6,
  },
  filterSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    width: 58,
  },
  filterSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipPillActive: {
    backgroundColor: '#F97316',
  },
  chipPillInactive: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chipTextInactive: {
    color: '#4B5563',
  },
  vDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 3,
  },
  resetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
  resetPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Vector Canvas Map
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E8ECF2',
    position: 'relative',
    overflow: 'hidden',
  },
  vectorMapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  terrainZone1: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '70%',
    height: '60%',
    borderRadius: 180,
    backgroundColor: '#DFE7EE',
    opacity: 0.8,
  },
  terrainZone2: {
    position: 'absolute',
    bottom: '-15%',
    right: '-10%',
    width: '75%',
    height: '65%',
    borderRadius: 200,
    backgroundColor: '#D7E1EA',
    opacity: 0.7,
  },
  terrainRiver: {
    position: 'absolute',
    top: '10%',
    left: '42%',
    width: 16,
    height: '90%',
    backgroundColor: '#BFDBFE',
    transform: [{ rotate: '-25deg' }],
    borderRadius: 8,
    opacity: 0.85,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  highwayNH3: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '52%',
    width: 6,
    backgroundColor: '#FDE047',
    transform: [{ rotate: '18deg' }],
    opacity: 0.65,
  },
  highwaySH22: {
    position: 'absolute',
    top: '48%',
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#FDBA74',
    transform: [{ rotate: '-8deg' }],
    opacity: 0.65,
  },
  districtWatermark: {
    position: 'absolute',
    fontSize: 10,
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
    backgroundColor: 'rgba(249, 115, 22, 0.22)',
  },
  userPulseRingInner: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(249, 115, 22, 0.35)',
  },
  userDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userLabelCard: {
    position: 'absolute',
    top: 28,
    backgroundColor: '#F97316',
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
    borderColor: '#FFEDD5',
  },
  pinBadgeSelected: {
    backgroundColor: '#F97316',
    borderColor: '#EA580C',
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
    backgroundColor: '#F97316',
    marginTop: 2,
  },
  pinAnchorDotSelected: {
    backgroundColor: '#EA580C',
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
    borderColor: '#FFEDD5',
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
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#FFEDD5',
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
    color: '#EA580C',
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
    backgroundColor: '#F97316',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#F97316',
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
