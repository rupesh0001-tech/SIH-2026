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
import type { BookingItem, BookingStatus, BookingViewMode } from '@/interfaces';

const STATIC_ALL_BOOKINGS: BookingItem[] = [
  {
    id: 'b-1',
    bookingCode: 'BK-9402',
    cropName: 'Onion',
    cropVariety: 'Nashik Red A-Grade',
    mandiName: 'Nashik APMC Mandi',
    gateNo: 'Gate 3 (Bay 12)',
    dateString: 'Sep 08, 2026',
    timeSlot: '08:30 AM – 10:00 AM',
    status: 'in_progress',
    statusLabel: 'In Progress',
    progressPercent: 65,
    progressLabel: 'Grading & Assay in Progress',
    inspectorName: 'Assayer R. Patil',
    quantityQuintals: 240,
    commentsCount: 3,
  },
  {
    id: 'b-2',
    bookingCode: 'BK-8821',
    cropName: 'Soybean',
    cropVariety: 'JS-335 Organic',
    mandiName: 'Pune Market Yard',
    gateNo: 'Gate 1 (E-Weighbridge)',
    dateString: 'Sep 12, 2026',
    timeSlot: '10:30 AM – 12:00 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    progressPercent: 20,
    progressLabel: 'QR Pass Issued',
    inspectorName: 'Officer Deshmukh',
    quantityQuintals: 160,
    commentsCount: 1,
  },
  {
    id: 'b-3',
    bookingCode: 'BK-7612',
    cropName: 'Wheat',
    cropVariety: 'Sharbati Premium',
    mandiName: 'Lasalgaon Mandi',
    gateNo: 'Gate 2',
    dateString: 'Sep 15, 2026',
    timeSlot: '02:00 PM – 03:30 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    progressPercent: 10,
    progressLabel: 'Slot Confirmed',
    inspectorName: 'Inspector Shinde',
    quantityQuintals: 300,
    commentsCount: 0,
  },
  {
    id: 'b-4',
    bookingCode: 'BK-6504',
    cropName: 'Cotton',
    cropVariety: 'Long Staple BT',
    mandiName: 'Nagpur APMC Hub',
    gateNo: 'Gate 4',
    dateString: 'Sep 02, 2026',
    timeSlot: '09:00 AM – 11:00 AM',
    status: 'completed',
    statusLabel: 'Completed',
    progressPercent: 100,
    progressLabel: 'Auction & Payout Settled',
    inspectorName: 'Officer Kale',
    quantityQuintals: 420,
    commentsCount: 4,
  },
];

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
];

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
        bg: '#D8F7D9',
        text: '#1B5E20',
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
  const [viewMode, setViewMode] = useState<BookingViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');

  const filteredBookings = useMemo(() => {
    return STATIC_ALL_BOOKINGS.filter((b) => {
      // Status filter
      if (activeStatus !== 'all' && b.status !== activeStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCode = b.bookingCode.toLowerCase().includes(query);
        const matchesCrop = b.cropName.toLowerCase().includes(query);
        const matchesMandi = b.mandiName.toLowerCase().includes(query);
        if (!matchesCode && !matchesCrop && !matchesMandi) return false;
      }
      return true;
    });
  }, [searchQuery, activeStatus]);

  const handleShowQrPass = (booking: BookingItem) => {
    Alert.alert(
      'Mandi Gate Entry Pass',
      `Booking #${booking.bookingCode}\nCrop: ${booking.cropName} (${booking.quantityQuintals} Qtl)\nSlot: ${booking.timeSlot}\nGate: ${booking.gateNo}\n\nPresent this pass to Mandi Security at gate entry.`,
      [{ text: 'Close' }]
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* Search Bar & Mode Toggle Section */}
      <View style={styles.topControlSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={ThemeColors.textSecondary} />
          <TextInput
            placeholder="Search booking ID, crop, mandi..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>

        {/* View Mode Toggle: Table / Cards */}
        <View style={styles.modeTogglePill}>
          <Pressable
            onPress={() => setViewMode('table')}
            style={[
              styles.modeBtn,
              viewMode === 'table' && styles.modeBtnActive,
            ]}>
            <Ionicons
              name="list"
              size={17}
              color={viewMode === 'table' ? '#FFFFFF' : ThemeColors.textSecondary}
            />
          </Pressable>

          <Pressable
            onPress={() => setViewMode('cards')}
            style={[
              styles.modeBtn,
              viewMode === 'cards' && styles.modeBtnActive,
            ]}>
            <Ionicons
              name="grid"
              size={16}
              color={viewMode === 'cards' ? '#FFFFFF' : ThemeColors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {/* Filter Status Pills */}
      <View style={styles.statusFilterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusFilterContent}>
          {STATUS_FILTERS.map((f) => {
            const active = activeStatus === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setActiveStatus(f.id)}
                style={[
                  styles.filterPill,
                  active ? styles.filterPillActive : styles.filterPillInactive,
                ]}>
                <Text
                  style={[
                    styles.filterPillText,
                    active ? styles.filterPillTextActive : styles.filterPillTextInactive,
                  ]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content based on View Mode */}
      <View style={styles.contentSection}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={32} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>Try changing your search term or status filter.</Text>
          </View>
        ) : viewMode === 'table' ? (
          /* Compact Table View */
          <View style={styles.tableCard}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.headerCell, { flex: 2.2 }]}>Crop / Slot</Text>
              <Text style={[styles.headerCell, { flex: 1.8 }]}>Mandi</Text>
              <Text style={[styles.headerCell, { flex: 1.5 }]}>Date / Qty</Text>
              <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Status / Pass</Text>
            </View>

            {/* Table Rows */}
            {filteredBookings.map((b, index) => {
              const statusStyle = getStatusBadge(b.status);
              const isLast = index === filteredBookings.length - 1;

              return (
                <Pressable
                  key={b.id}
                  onPress={() => handleShowQrPass(b)}
                  style={({ pressed }) => [
                    styles.tableRow,
                    !isLast && styles.rowBorder,
                    pressed && styles.rowPressed,
                  ]}>
                  {/* Crop & Booking Code */}
                  <View style={{ flex: 2.2 }}>
                    <Text numberOfLines={1} style={styles.cropText}>
                      {b.cropName}
                    </Text>
                    <Text numberOfLines={1} style={styles.codeText}>
                      #{b.bookingCode}
                    </Text>
                  </View>

                  {/* Mandi Name & Gate */}
                  <View style={{ flex: 1.8, paddingRight: 4 }}>
                    <Text numberOfLines={1} style={styles.mandiText}>
                      {b.mandiName.replace(' APMC', '').replace(' Market', '')}
                    </Text>
                    <Text numberOfLines={1} style={styles.subMandiText}>
                      {b.gateNo.split('(')[0]}
                    </Text>
                  </View>

                  {/* Date & Quantity */}
                  <View style={{ flex: 1.5 }}>
                    <Text numberOfLines={1} style={styles.qtyText}>
                      {b.quantityQuintals} Qtl
                    </Text>
                    <Text numberOfLines={1} style={styles.dateText}>
                      {b.dateString}
                    </Text>
                  </View>

                  {/* Status Pill & Pass Trigger */}
                  <View style={{ flex: 1.5, alignItems: 'flex-end', gap: 3 }}>
                    <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                      <Text numberOfLines={1} style={[styles.statusText, { color: statusStyle.text }]}>
                        {statusStyle.label}
                      </Text>
                    </View>
                    <Text style={styles.viewPassLink}>Pass →</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          /* Cards View (No loader/progress bars, small height) */
          <View style={styles.cardsList}>
            {filteredBookings.map((b) => {
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
            })}
          </View>
        )}
      </View>
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
    gap: 10,
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
  modeTogglePill: {
    flexDirection: 'row',
    backgroundColor: ThemeColors.white,
    borderRadius: 18,
    padding: 3,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  modeBtn: {
    width: 38,
    height: 38,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBtnActive: {
    backgroundColor: ThemeColors.darkNav,
  },
  statusFilterRow: {
    marginTop: 10,
  },
  statusFilterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  filterPillActive: {
    backgroundColor: ThemeColors.darkNav,
  },
  filterPillInactive: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterPillTextInactive: {
    color: ThemeColors.textSecondary,
  },
  contentSection: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  tableCard: {
    backgroundColor: ThemeColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerCell: {
    fontSize: 11,
    fontWeight: '700',
    color: ThemeColors.textMuted,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rowPressed: {
    backgroundColor: '#F9FAFB',
  },
  cropText: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  codeText: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    fontWeight: '500',
  },
  mandiText: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.textPrimary,
  },
  subMandiText: {
    fontSize: 10,
    color: ThemeColors.textSecondary,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  dateText: {
    fontSize: 10,
    color: ThemeColors.textSecondary,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  viewPassLink: {
    fontSize: 10,
    color: ThemeColors.lavenderDark,
    fontWeight: '700',
  },
  cardsList: {
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
    fontSize: 12,
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
    backgroundColor: ThemeColors.darkNav,
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
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
