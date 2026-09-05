import React, { memo, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { MandiFilterModal } from './MandiFilterModal';
import { MandiMapViewModal } from './MandiMapViewModal';
import type { MandiItem, MandiFilterCriteria } from '@/interfaces';

const ITEMS_PER_PAGE = 3;

const STATIC_MANDIS: MandiItem[] = [
  {
    id: 'mandi-1',
    name: 'Nashik APMC Mandi',
    district: 'Nashik, Maharashtra',
    distanceKm: 12.4,
    topCrop: 'Onion (Red) & Grapes',
    modalPrice: '₹2,680 / qtl',
    priceTrend: '+₹120 today',
    trendDirection: 'up',
    estimatedQueueTime: '25 mins wait',
    isOpen: true,
    activeFarmersCount: 142,
  },
  {
    id: 'mandi-2',
    name: 'Lasalgaon APMC Market',
    district: 'Lasalgaon, Maharashtra',
    distanceKm: 28.1,
    topCrop: 'Onion (Garva) & Wheat',
    modalPrice: '₹2,850 / qtl',
    priceTrend: '+₹190 today',
    trendDirection: 'up',
    estimatedQueueTime: '45 mins wait',
    isOpen: true,
    activeFarmersCount: 210,
  },
  {
    id: 'mandi-3',
    name: 'Pune Gultekdi Market Yard',
    district: 'Pune, Maharashtra',
    distanceKm: 42.0,
    topCrop: 'Soybean & Tomato',
    modalPrice: '₹4,920 / qtl',
    priceTrend: '-₹40 today',
    trendDirection: 'down',
    estimatedQueueTime: '15 mins wait',
    isOpen: true,
    activeFarmersCount: 88,
  },
  {
    id: 'mandi-4',
    name: 'Nagpur Cotton APMC Hub',
    district: 'Nagpur, Maharashtra',
    distanceKm: 85.0,
    topCrop: 'Cotton (Long Staple)',
    modalPrice: '₹7,150 / qtl',
    priceTrend: '+₹250 today',
    trendDirection: 'up',
    estimatedQueueTime: '30 mins wait',
    isOpen: true,
    activeFarmersCount: 165,
  },
  {
    id: 'mandi-5',
    name: 'Ahmednagar Grain Mandi',
    district: 'Ahmednagar, Maharashtra',
    distanceKm: 55.0,
    topCrop: 'Maize & Wheat',
    modalPrice: '₹2,340 / qtl',
    priceTrend: '+₹60 today',
    trendDirection: 'up',
    estimatedQueueTime: '20 mins wait',
    isOpen: true,
    activeFarmersCount: 75,
  },
  {
    id: 'mandi-6',
    name: 'Pimpalgaon Onion Yard',
    district: 'Pimpalgaon, Maharashtra',
    distanceKm: 18.5,
    topCrop: 'Onion & Tomato',
    modalPrice: '₹2,720 / qtl',
    priceTrend: '+₹80 today',
    trendDirection: 'up',
    estimatedQueueTime: '20 mins wait',
    isOpen: true,
    activeFarmersCount: 115,
  },
];

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

export const MandiSectionView = memo(function MandiSectionView() {
  const [criteria, setCriteria] = useState<MandiFilterCriteria>(INITIAL_FILTER_CRITERIA);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMandis = useMemo(() => {
    return STATIC_MANDIS.filter((mandi) => {
      // 1. Text Search query
      if (criteria.searchQuery.trim()) {
        const query = criteria.searchQuery.toLowerCase();
        const matchesName = mandi.name.toLowerCase().includes(query);
        const matchesCrop = mandi.topCrop.toLowerCase().includes(query);
        const matchesDistrict = mandi.district.toLowerCase().includes(query);
        if (!matchesName && !matchesCrop && !matchesDistrict) return false;
      }

      // 2. Crop filter (Preset or manual)
      const targetCrop = criteria.manualCrop.trim() || (criteria.selectedCrop !== 'All Crops' ? criteria.selectedCrop : '');
      if (targetCrop) {
        if (!mandi.topCrop.toLowerCase().includes(targetCrop.toLowerCase())) {
          return false;
        }
      }

      // 3. Location filter
      if (criteria.selectedLocation && criteria.selectedLocation !== 'All Locations') {
        if (!mandi.district.toLowerCase().includes(criteria.selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // 4. Farmers Count filter
      if (criteria.minFarmers.trim()) {
        const min = parseInt(criteria.minFarmers, 10);
        if (!isNaN(min) && mandi.activeFarmersCount < min) {
          return false;
        }
      }

      return true;
    });
  }, [criteria]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredMandis.length / ITEMS_PER_PAGE));
  const paginatedMandis = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMandis.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMandis, currentPage]);

  const handleBookSlot = (mandi: MandiItem) => {
    Alert.alert(
      'Book Mandi Gate Slot',
      `Booking slot at ${mandi.name} for ${criteria.manualDate || criteria.selectedDate}.`,
      [{ text: 'Proceed to Vehicle Details' }]
    );
  };

  const hasActiveFilters =
    criteria.selectedCrop !== 'All Crops' ||
    Boolean(criteria.manualCrop) ||
    criteria.selectedLocation !== 'All Locations' ||
    Boolean(criteria.manualDate) ||
    Boolean(criteria.minFarmers);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* Search Bar & Map Trigger */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={ThemeColors.textSecondary} />
          <TextInput
            placeholder="Search mandi, crop, location..."
            placeholderTextColor="#9CA3AF"
            value={criteria.searchQuery}
            onChangeText={(text) => {
              setCriteria((prev) => ({ ...prev, searchQuery: text }));
              setCurrentPage(1);
            }}
            style={styles.searchInput}
          />
          {criteria.searchQuery ? (
            <Pressable
              onPress={() => setCriteria((prev) => ({ ...prev, searchQuery: '' }))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Button */}
        <Pressable
          onPress={() => setFilterModalVisible(true)}
          style={[
            styles.iconActionBtn,
            hasActiveFilters && styles.filterBtnActive,
          ]}>
          <Ionicons
            name="options-outline"
            size={20}
            color={hasActiveFilters ? '#FFFFFF' : ThemeColors.primary}
          />
        </Pressable>

        {/* Map Radar Button */}
        <Pressable
          onPress={() => setMapModalVisible(true)}
          style={[styles.iconActionBtn, styles.mapBtn]}>
          <Ionicons name="map" size={19} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Active Filter Chips */}
      {hasActiveFilters ? (
        <View style={styles.activeFiltersRow}>
          <Text style={styles.activeFiltersLabel}>Filters:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipScroll}>
            {criteria.manualCrop || criteria.selectedCrop !== 'All Crops' ? (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>🌾 {criteria.manualCrop || criteria.selectedCrop}</Text>
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
            {criteria.selectedLocation !== 'All Locations' ? (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>📍 {criteria.selectedLocation}</Text>
              </View>
            ) : null}
            <Pressable
              onPress={() => {
                setCriteria(INITIAL_FILTER_CRITERIA);
                setCurrentPage(1);
              }}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
              <Text style={styles.clearAllText}>Clear</Text>
            </Pressable>
          </ScrollView>
        </View>
      ) : null}

      {/* Quick Location Hint */}
      <View style={styles.locationHintRow}>
        <Ionicons name="navigate-circle" size={15} color={ThemeColors.primary} />
        <Text style={styles.locationHintText}>Showing {filteredMandis.length} verified APMC mandis near Niphad</Text>
      </View>

      {/* Mandis List */}
      <View style={styles.list}>
        {paginatedMandis.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="search-outline" size={32} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No matching mandis found</Text>
            <Text style={styles.emptySubtitle}>Try changing your crop or location filters.</Text>
            <Pressable
              onPress={() => {
                setCriteria(INITIAL_FILTER_CRITERIA);
                setCurrentPage(1);
              }}
              style={styles.resetSearchBtn}>
              <Text style={styles.resetSearchText}>Reset All Filters</Text>
            </Pressable>
          </View>
        ) : (
          paginatedMandis.map((mandi) => (
            <View key={mandi.id} style={styles.card}>
              {/* Top row: Status & Distance */}
              <View style={styles.cardHeader}>
                <View style={styles.statusPill}>
                  <View style={styles.greenDot} />
                  <Text style={styles.statusText}>Open for e-Auction</Text>
                </View>
                <View style={styles.distancePill}>
                  <Ionicons name="location-outline" size={13} color={ThemeColors.textSecondary} />
                  <Text style={styles.distanceText}>{mandi.distanceKm} km</Text>
                </View>
              </View>

              {/* Mandi Name & District */}
              <Text style={styles.mandiName}>{mandi.name}</Text>
              <Text style={styles.districtText}>{mandi.district}</Text>

              {/* Price & Crop stats box */}
              <View style={styles.ratesBox}>
                <View>
                  <Text style={styles.ratesLabel}>Today's Modal Rate</Text>
                  <Text style={styles.priceValue}>{mandi.modalPrice}</Text>
                  <Text style={styles.cropName}>{mandi.topCrop}</Text>
                </View>

                <View style={styles.trendCol}>
                  <View
                    style={[
                      styles.trendBadge,
                      mandi.trendDirection === 'up' ? styles.trendBadgeUp : styles.trendBadgeDown,
                    ]}>
                    <Text
                      style={[
                        styles.trendBadgeText,
                        mandi.trendDirection === 'up' ? styles.trendTextUp : styles.trendTextDown,
                      ]}>
                      {mandi.trendDirection === 'up' ? '↑ ' : '↓ '}
                      {mandi.priceTrend}
                    </Text>
                  </View>
                  <Text style={styles.queueText}>⏱ {mandi.estimatedQueueTime}</Text>
                  <Text style={styles.farmerCountText}>👥 {mandi.activeFarmersCount} Farmers in queue</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() => handleBookSlot(mandi)}
                  style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
                  <Text style={styles.primaryBtnText}>Book Slot</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Alert.alert(
                      'Live APMC Rates',
                      `Viewing real-time arrival auctions for ${mandi.name}`,
                      [{ text: 'OK' }]
                    );
                  }}
                  style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}>
                  <Text style={styles.secondaryBtnText}>Live Rates</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Pagination Bar */}
      {totalPages > 1 ? (
        <View style={styles.paginationRow}>
          <Pressable
            disabled={currentPage <= 1}
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={[styles.pageBtn, currentPage <= 1 && styles.pageBtnDisabled]}>
            <Ionicons
              name="chevron-back"
              size={16}
              color={currentPage <= 1 ? '#9CA3AF' : ThemeColors.textPrimary}
            />
            <Text style={[styles.pageBtnText, currentPage <= 1 && styles.pageTextDisabled]}>Prev</Text>
          </Pressable>

          <View style={styles.pageIndicatorPill}>
            <Text style={styles.pageIndicatorText}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>

          <Pressable
            disabled={currentPage >= totalPages}
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            style={[styles.pageBtn, currentPage >= totalPages && styles.pageBtnDisabled]}>
            <Text style={[styles.pageBtnText, currentPage >= totalPages && styles.pageTextDisabled]}>Next</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={currentPage >= totalPages ? '#9CA3AF' : ThemeColors.textPrimary}
            />
          </Pressable>
        </View>
      ) : null}

      {/* Multi-Criteria Filter Modal */}
      <MandiFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        criteria={criteria}
        onApply={(newCriteria) => {
          setCriteria(newCriteria);
          setCurrentPage(1);
        }}
        onReset={() => {
          setCriteria(INITIAL_FILTER_CRITERIA);
          setCurrentPage(1);
        }}
      />

      {/* Interactive Map Radar Modal */}
      <MandiMapViewModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        mandis={STATIC_MANDIS}
        onSelectMandi={(mandi) => handleBookSlot(mandi)}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 110,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  iconActionBtn: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  filterBtnActive: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primaryDark,
  },
  mapBtn: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primaryDark,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 6,
  },
  activeFiltersLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ThemeColors.textMuted,
  },
  filterChipScroll: {
    gap: 6,
    alignItems: 'center',
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
  locationHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 6,
  },
  locationHintText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 14,
  },
  card: {
    backgroundColor: ThemeColors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ThemeColors.primary,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
  mandiName: {
    fontSize: 18,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.3,
  },
  districtText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginBottom: 12,
    marginTop: 2,
  },
  ratesBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  ratesLabel: {
    fontSize: 10,
    color: ThemeColors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    marginVertical: 2,
  },
  cropName: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
  trendCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trendBadgeUp: {
    backgroundColor: '#DCFCE7',
  },
  trendBadgeDown: {
    backgroundColor: '#FEE2E2',
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendTextUp: {
    color: '#15803D',
  },
  trendTextDown: {
    color: '#991B1B',
  },
  queueText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
  farmerCountText: {
    fontSize: 10,
    color: ThemeColors.textMuted,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: ThemeColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  pageBtnDisabled: {
    opacity: 0.45,
  },
  pageBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  pageTextDisabled: {
    color: '#9CA3AF',
  },
  pageIndicatorPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pageIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  emptyCard: {
    backgroundColor: ThemeColors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  resetSearchBtn: {
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetSearchText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
