import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import type { BookingItem, BookingStatus } from '@/interfaces';

interface RecentBookingsListProps {
  bookings: BookingItem[];
  onBookingPress?: (bookingId: string) => void;
  onViewAllPress?: () => void;
}

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

export const RecentBookingsList = memo(function RecentBookingsList({
  bookings,
  onBookingPress,
  onViewAllPress,
}: RecentBookingsListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        {onViewAllPress ? (
          <Pressable
            onPress={onViewAllPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={14} color={ThemeColors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      {/* Compact Table View */}
      <View style={styles.tableCard}>
        {/* Table Header */}
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.headerCell, { flex: 2.2 }]}>Crop & Slot</Text>
          <Text style={[styles.headerCell, { flex: 1.8 }]}>Mandi</Text>
          <Text style={[styles.headerCell, { flex: 1.4 }]}>Qty / Date</Text>
          <Text style={[styles.headerCell, { flex: 1.4, textAlign: 'right' }]}>Status</Text>
        </View>

        {/* Table Rows */}
        {bookings.map((booking, index) => {
          const statusStyle = getStatusBadge(booking.status);
          const isLast = index === bookings.length - 1;

          return (
            <Pressable
              key={booking.id}
              onPress={() => onBookingPress?.(booking.id)}
              style={({ pressed }) => [
                styles.tableRow,
                !isLast && styles.rowBorder,
                pressed && styles.rowPressed,
              ]}>
              {/* Crop & Booking Code */}
              <View style={{ flex: 2.2 }}>
                <Text numberOfLines={1} style={styles.cropText}>
                  {booking.cropName}
                </Text>
                <Text numberOfLines={1} style={styles.codeText}>
                  #{booking.bookingCode}
                </Text>
              </View>

              {/* Mandi Name */}
              <View style={{ flex: 1.8, paddingRight: 4 }}>
                <Text numberOfLines={1} style={styles.mandiText}>
                  {booking.mandiName.replace(' APMC', '').replace(' Market', '')}
                </Text>
                <Text numberOfLines={1} style={styles.subMandiText}>
                  {booking.gateNo}
                </Text>
              </View>

              {/* Quantity & Date */}
              <View style={{ flex: 1.4 }}>
                <Text numberOfLines={1} style={styles.qtyText}>
                  {booking.quantityQuintals} Qtl
                </Text>
                <Text numberOfLines={1} style={styles.dateText}>
                  {booking.dateString.split(',')[0]}
                </Text>
              </View>

              {/* Status Badge */}
              <View style={{ flex: 1.4, alignItems: 'flex-end' }}>
                <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                  <Text numberOfLines={1} style={[styles.statusText, { color: statusStyle.text }]}>
                    {statusStyle.label}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 90,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.3,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
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
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
