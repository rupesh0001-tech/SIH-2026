import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { DateSelectorStrip } from './DateSelectorStrip';
import { FilterPillBar } from './FilterPillBar';
import type { BookingItem, DayPickerItem } from '@/interfaces';

const DAYS_DATA: DayPickerItem[] = [
  { dayName: 'Mon', dayNumber: '15', dateKey: '2026-09-15' },
  { dayName: 'Tue', dayNumber: '16', dateKey: '2026-09-16' },
  { dayName: 'Wed', dayNumber: '17', dateKey: '2026-09-17', isToday: true },
  { dayName: 'Thu', dayNumber: '18', dateKey: '2026-09-18' },
  { dayName: 'Fri', dayNumber: '19', dateKey: '2026-09-19' },
];

const BOOKING_FILTERS = [
  { id: 'all', label: 'All Slots' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

const STATIC_DETAILED_BOOKINGS: BookingItem[] = [
  {
    id: 'b-1',
    bookingCode: 'BK-9402',
    cropName: 'Onion',
    cropVariety: 'Nashik Red A-Grade',
    mandiName: 'Nashik APMC Mandi',
    gateNo: 'Gate 3 (Bay 12)',
    dateString: 'Wed, Sep 17, 2026',
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
    dateString: 'Thu, Sep 18, 2026',
    timeSlot: '10:30 AM – 12:00 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed Pass',
    progressPercent: 20,
    progressLabel: 'QR Pass Issued • Ready for Entry',
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
    dateString: 'Fri, Sep 19, 2026',
    timeSlot: '02:00 PM – 03:30 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed Pass',
    progressPercent: 10,
    progressLabel: 'Waiting for slot window',
    inspectorName: 'Inspector Shinde',
    quantityQuintals: 300,
    commentsCount: 0,
  },
];

export const BookingsSectionView = memo(function BookingsSectionView() {
  const [selectedDateKey, setSelectedDateKey] = useState('2026-09-17');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleShowQrPass = (bookingCode: string) => {
    Alert.alert(
      'Mandi Gate Entry Pass',
      `Gate Pass #${bookingCode} is verified. Show QR Code to APMC Security at the toll gate.`,
      [{ text: 'Close' }]
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* Date selector strip matching reference image */}
      <DateSelectorStrip
        days={DAYS_DATA}
        selectedDateKey={selectedDateKey}
        onSelectDate={setSelectedDateKey}
      />

      {/* Filter pills */}
      <FilterPillBar
        options={BOOKING_FILTERS}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Timeline List */}
      <View style={styles.list}>
        {STATIC_DETAILED_BOOKINGS.map((booking) => {
          const isInProgress = booking.status === 'in_progress';
          return (
            <View
              key={booking.id}
              style={[
                styles.scheduleCard,
                isInProgress && styles.scheduleCardHighlighted,
              ]}>
              
              {/* Left Timeline Bar & Time badge */}
              <View style={styles.timeHeader}>
                <View style={styles.timeBadge}>
                  <Ionicons name="time-outline" size={15} color={ThemeColors.textPrimary} />
                  <Text style={styles.timeText}>{booking.timeSlot}</Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    isInProgress ? styles.statusInProgress : styles.statusConfirmed,
                  ]}>
                  <Text
                    style={[
                      styles.statusPillText,
                      isInProgress ? styles.statusTextProgress : styles.statusTextConfirmed,
                    ]}>
                    {booking.statusLabel}
                  </Text>
                </View>
              </View>

              {/* Crop & Mandi Information */}
              <Text style={styles.cropTitle}>
                {booking.cropName} — {booking.cropVariety}
              </Text>
              <Text style={styles.mandiLocation}>
                {booking.mandiName} • {booking.gateNo}
              </Text>

              {/* Progress Bar & Details */}
              <View style={styles.progressBox}>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${booking.progressPercent}%`,
                        backgroundColor: isInProgress ? '#F97316' : '#16A34A',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressLabel}>{booking.progressLabel}</Text>
              </View>

              {/* Footer: Inspector Info & View Pass Button */}
              <View style={styles.footerRow}>
                <View style={styles.inspectorInfo}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={12} color={ThemeColors.textSecondary} />
                  </View>
                  <Text style={styles.inspectorName}>{booking.inspectorName}</Text>
                </View>

                <Pressable
                  onPress={() => handleShowQrPass(booking.bookingCode)}
                  style={({ pressed }) => [styles.qrPassBtn, pressed && styles.pressed]}>
                  <Ionicons name="qr-code-outline" size={14} color={ThemeColors.darkNav} />
                  <Text style={styles.qrPassText}>View Pass</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 110,
  },
  list: {
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 14,
  },
  scheduleCard: {
    backgroundColor: ThemeColors.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleCardHighlighted: {
    borderColor: '#FED7AA',
    backgroundColor: '#FFFCF8',
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusInProgress: {
    backgroundColor: '#FFE8C6',
  },
  statusConfirmed: {
    backgroundColor: '#D8F7D9',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextProgress: {
    color: '#8D4004',
  },
  statusTextConfirmed: {
    color: '#1B5E20',
  },
  cropTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.3,
  },
  mandiLocation: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  progressBox: {
    marginBottom: 14,
  },
  track: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
    marginTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inspectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectorName: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.textSecondary,
  },
  qrPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  qrPassText: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.darkNav,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
