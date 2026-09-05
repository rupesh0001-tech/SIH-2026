import React, { memo, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { BookingsFilterModal } from './BookingsFilterModal';
import type { BookingItem, BookingStatus, BookingsFilterCriteria } from '@/interfaces';

const ITEMS_PER_PAGE = 3;

const STATIC_ALL_BOOKINGS: BookingItem[] = [
  {
    id: 'b-1',
    bookingCode: 'BK-9402',
    cropName: 'Onion',
    cropVariety: 'Nashik Red A-Grade',
    mandiName: 'Nashik APMC Mandi',
    gateNo: 'Gate 3 (Bay 12)',
    dateString: '08/09/2026',
    timeSlot: '08:30 AM – 10:00 AM',
    status: 'in_progress',
    statusLabel: 'In Progress',
    progressPercent: 65,
    progressLabel: 'Grading & Quality Assay',
    inspectorName: 'Assayer R. Patil',
    quantityQuintals: 240,
  },
  {
    id: 'b-2',
    bookingCode: 'BK-8821',
    cropName: 'Soybean',
    cropVariety: 'JS-335 Organic',
    mandiName: 'Pune Market Yard',
    gateNo: 'Gate 1 (E-Weighbridge)',
    dateString: '12/09/2026',
    timeSlot: '10:30 AM – 12:00 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    progressPercent: 20,
    progressLabel: 'QR Pass Issued',
    inspectorName: 'Officer Deshmukh',
    quantityQuintals: 160,
  },
  {
    id: 'b-3',
    bookingCode: 'BK-7612',
    cropName: 'Wheat',
    cropVariety: 'Sharbati Premium',
    mandiName: 'Lasalgaon Mandi',
    gateNo: 'Gate 2',
    dateString: '15/09/2026',
    timeSlot: '02:00 PM – 03:30 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    progressPercent: 10,
    progressLabel: 'Slot Confirmed',
    inspectorName: 'Inspector Shinde',
    quantityQuintals: 300,
  },
  {
    id: 'b-4',
    bookingCode: 'BK-6504',
    cropName: 'Cotton',
    cropVariety: 'Long Staple BT',
    mandiName: 'Nagpur APMC Hub',
    gateNo: 'Gate 4',
    dateString: '02/09/2026',
    timeSlot: '09:00 AM – 11:00 AM',
    status: 'completed',
    statusLabel: 'Completed',
    progressPercent: 100,
    progressLabel: 'Auction & Payout Settled',
    inspectorName: 'Officer Kale',
    quantityQuintals: 420,
  },
  {
    id: 'b-5',
    bookingCode: 'BK-5520',
    cropName: 'Maize',
    cropVariety: 'Yellow Hybrid',
    mandiName: 'Ahmednagar Mandi',
    gateNo: 'Gate 1',
    dateString: '18/09/2026',
    timeSlot: '11:30 AM – 01:00 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    progressPercent: 15,
    progressLabel: 'Gate Token Generated',
    inspectorName: 'Officer Pawar',
    quantityQuintals: 190,
  },
];

const INITIAL_BOOKING_CRITERIA: BookingsFilterCriteria = {
  searchQuery: '',
  selectedCrop: 'All Crops',
  manualDate: '',
  manualCrop: '',
  minFarmers: '',
  status: 'all',
};

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case 'in_progress':
      return {
        bg: '#FFE8C6',
        text: '#8D4004',
        label: 'In Progress',
      };
    case 'confirmed':
      return {
        bg: '#DCFCE7',
        text: '#15803D',
        label: 'Confirmed',
      };
    case 'completed':
      return {
        bg: '#EAECEE',
        text: '#374151',
        label: 'Done',
      };
    case 'cancelled':
    default:
      return {
        bg: '#FEE2E2',
        text: '#991B1B',
        label: 'Cancelled',
      };
  }
};

export const BookingsSectionView = memo(function BookingsSectionView() {
  const [criteria, setCriteria] = useState<BookingsFilterCriteria>(INITIAL_BOOKING_CRITERIA);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = useMemo(() => {
    return STATIC_ALL_BOOKINGS.filter((b) => {
      // 1. Search Query (ID, Crop, Mandi)
      if (criteria.searchQuery.trim()) {
        const query = criteria.searchQuery.toLowerCase();
        const matchesCode = b.bookingCode.toLowerCase().includes(query);
        const matchesCrop = b.cropName.toLowerCase().includes(query);
        const matchesMandi = b.mandiName.toLowerCase().includes(query);
        if (!matchesCode && !matchesCrop && !matchesMandi) return false;
      }

      // 2. Status Filter
      if (criteria.status !== 'all' && b.status !== criteria.status) {
        return false;
      }

      // 3. Crop Filter
      const targetCrop = criteria.manualCrop.trim() || (criteria.selectedCrop !== 'All Crops' ? criteria.selectedCrop : '');
      if (targetCrop) {
        if (!b.cropName.toLowerCase().includes(targetCrop.toLowerCase())) {
          return false;
        }
      }

      // 4. Date Filter
      if (criteria.manualDate.trim()) {
        if (!b.dateString.includes(criteria.manualDate.trim())) {
          return false;
        }
      }

      // 5. Quantity Filter
      if (criteria.minFarmers.trim()) {
        const min = parseInt(criteria.minFarmers, 10);
        if (!isNaN(min) && b.quantityQuintals < min) {
          return false;
        }
      }

      return true;
    });
  }, [criteria]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE));
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  const handleShowQrPass = (booking: BookingItem) => {
    Alert.alert(
      'Mandi Gate Entry Pass',
      `Booking #${booking.bookingCode}\nCrop: ${booking.cropName} (${booking.quantityQuintals} Qtl)\nSlot: ${booking.timeSlot}\nGate: ${booking.gateNo}\n\nPresent this pass at APMC Entry Toll.`,
      [{ text: 'Close' }]
    );
  };

  const hasActiveFilters =
    criteria.status !== 'all' ||
    Boolean(criteria.manualCrop) ||
    criteria.selectedCrop !== 'All Crops' ||
    Boolean(criteria.manualDate) ||
    Boolean(criteria.minFarmers);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* Search Bar & Filter Trigger */}
      <View style={styles.topControlSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={ThemeColors.textSecondary} />
          <TextInput
            placeholder="Search booking ID, crop, mandi..."
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
              onPress={() => {
                setCriteria((prev) => ({ ...prev, searchQuery: '' }));
                setCurrentPage(1);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Modal Button */}
        <Pressable
          onPress={() => setFilterModalVisible(true)}
          style={[
            styles.filterBtn,
            hasActiveFilters && styles.filterBtnActive,
          ]}>
          <Ionicons
            name="options-outline"
            size={20}
            color={hasActiveFilters ? '#FFFFFF' : ThemeColors.primary}
          />
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
                <Text style={styles.activePillText}>📦 {criteria.minFarmers}+ Qtl</Text>
              </View>
            ) : null}
            {criteria.status !== 'all' ? (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>🏷️ {criteria.status}</Text>
              </View>
            ) : null}
            <Pressable
              onPress={() => {
                setCriteria(INITIAL_BOOKING_CRITERIA);
                setCurrentPage(1);
              }}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
              <Text style={styles.clearAllText}>Clear</Text>
            </Pressable>
          </ScrollView>
        </View>
      ) : null}

      {/* Status Quick Filter Chips */}
      <View style={styles.statusPillsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusPillsContent}>
          {['all', 'in_progress', 'confirmed', 'completed'].map((st) => {
            const active = criteria.status === st;
            const label = st === 'all' ? 'All Slots' : st === 'in_progress' ? 'In Progress' : st === 'confirmed' ? 'Confirmed' : 'Completed';
            return (
              <Pressable
                key={st}
                onPress={() => {
                  setCriteria((prev) => ({ ...prev, status: st }));
                  setCurrentPage(1);
                }}
                style={[
                  styles.statusChip,
                  active ? styles.statusChipActive : styles.statusChipInactive,
                ]}>
                <Text
                  style={[
                    styles.statusChipText,
                    active ? styles.statusChipTextActive : styles.statusChipTextInactive,
                  ]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Cards List (By Default - No Table Toggle) */}
      <View style={styles.cardsList}>
        {paginatedBookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={32} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>Try changing your search term or filters.</Text>
            <Pressable
              onPress={() => {
                setCriteria(INITIAL_BOOKING_CRITERIA);
                setCurrentPage(1);
              }}
              style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </Pressable>
          </View>
        ) : (
          paginatedBookings.map((b) => {
            const statusStyle = getStatusBadge(b.status);
            return (
              <View key={b.id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                  <Text style={styles.cardCode}>#{b.bookingCode}</Text>
                </View>

                <Text style={styles.cardCropTitle}>
                  {b.cropName} ({b.cropVariety})
                </Text>
                <Text style={styles.cardMandiSubtitle}>
                  {b.mandiName} • {b.gateNo}
                </Text>

                <View style={styles.cardInfoRow}>
                  <View style={styles.infoCol}>
                    <Ionicons name="calendar-outline" size={13} color={ThemeColors.textSecondary} />
                    <Text style={styles.infoColText}>{b.dateString}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Ionicons name="time-outline" size={13} color={ThemeColors.textSecondary} />
                    <Text style={styles.infoColText}>{b.timeSlot}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Ionicons name="cube-outline" size={13} color={ThemeColors.textSecondary} />
                    <Text style={styles.infoColText}>{b.quantityQuintals} Qtl</Text>
                  </View>
                </View>

                <View style={styles.cardFooterRow}>
                  <Text style={styles.inspectorText}>Inspector: {b.inspectorName}</Text>
                  <Pressable
                    onPress={() => handleShowQrPass(b)}
                    style={({ pressed }) => [styles.passBtn, pressed && styles.pressed]}>
                    <Ionicons name="qr-code-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.passBtnText}>QR Pass</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Pagination Controls */}
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

      {/* Bookings Multi-Criteria Filter Modal */}
      <BookingsFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        criteria={criteria}
        onApply={(newCriteria) => {
          setCriteria(newCriteria);
          setCurrentPage(1);
        }}
        onReset={() => {
          setCriteria(INITIAL_BOOKING_CRITERIA);
          setCurrentPage(1);
        }}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 110,
  },
  topControlSection: {
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
  filterBtn: {
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
  statusPillsRow: {
    marginTop: 10,
  },
  statusPillsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusChipActive: {
    backgroundColor: ThemeColors.primary,
  },
  statusChipInactive: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusChipTextActive: {
    color: '#FFFFFF',
  },
  statusChipTextInactive: {
    color: ThemeColors.textSecondary,
  },
  cardsList: {
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 12,
  },
  card: {
    backgroundColor: ThemeColors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardCode: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.textMuted,
  },
  cardCropTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  cardMandiSubtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 10,
    marginTop: 2,
  },
  cardInfoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoColText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  inspectorText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
  passBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  passBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
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
    marginBottom: 14,
  },
  resetBtn: {
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
