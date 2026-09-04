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

      {/* Sleek Booking Cards (No heavy progression bars) */}
      <View style={styles.cardsList}>
        {bookings.map((booking) => {
          const statusStyle = getStatusBadge(booking.status);

          return (
            <Pressable
              key={booking.id}
              onPress={() => onBookingPress?.(booking.id)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
              
              {/* Header: Status pill and Slot Code */}
              <View style={styles.cardHeader}>
                <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {statusStyle.label}
                  </Text>
                </View>
                <Text style={styles.codeText}>#{booking.bookingCode}</Text>
              </View>

              {/* Crop & Mandi info */}
              <Text style={styles.cropTitle}>
                {booking.cropName} ({booking.cropVariety})
              </Text>
              <Text style={styles.mandiSubtitle}>
                {booking.mandiName} • {booking.gateNo}
              </Text>

              {/* Details footer */}
              <View style={styles.cardFooter}>
                <View style={styles.infoCol}>
                  <Ionicons name="calendar-outline" size={13} color={ThemeColors.textSecondary} />
                  <Text style={styles.infoText}>{booking.dateString}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Ionicons name="time-outline" size={13} color={ThemeColors.textSecondary} />
                  <Text style={styles.infoText}>{booking.timeSlot}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Ionicons name="cube-outline" size={13} color={ThemeColors.textSecondary} />
                  <Text style={styles.infoText}>{booking.quantityQuintals} Qtl</Text>
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
    marginTop: 16,
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
  cardsList: {
    gap: 10,
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
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  cardHeader: {
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
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.textMuted,
  },
  cropTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.3,
  },
  mandiSubtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
});
