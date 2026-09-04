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

const getStatusStyles = (status: BookingStatus) => {
  switch (status) {
    case 'in_progress':
      return {
        bg: '#FFE8C6',
        text: '#8D4004',
        barColor: '#F97316',
      };
    case 'confirmed':
      return {
        bg: '#D8F7D9',
        text: '#1B5E20',
        barColor: '#16A34A',
      };
    case 'completed':
      return {
        bg: '#EAECEE',
        text: '#374151',
        barColor: '#4B5563',
      };
    case 'cancelled':
    default:
      return {
        bg: '#FEE2E2',
        text: '#991B1B',
        barColor: '#EF4444',
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

      <View style={styles.list}>
        {bookings.map((booking) => {
          const statusStyle = getStatusStyles(booking.status);

          return (
            <Pressable
              key={booking.id}
              onPress={() => onBookingPress?.(booking.id)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
              
              {/* Status Pill Badge */}
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                  {booking.statusLabel}
                </Text>
              </View>

              {/* Crop & Booking Title */}
              <Text style={styles.cropTitle}>
                {booking.cropName} ({booking.cropVariety})
              </Text>
              <Text style={styles.mandiSubtitle}>
                {booking.mandiName} • {booking.gateNo}
              </Text>

              {/* Info Row: Date, Quantity, Comments */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={14} color={ThemeColors.textSecondary} />
                  <Text style={styles.infoText}>{booking.dateString}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="chatbox-outline" size={14} color={ThemeColors.textSecondary} />
                  <Text style={styles.infoText}>{booking.commentsCount ?? 2} updates</Text>
                </View>
              </View>

              {/* Two-part Progress Bar matching Reference Design */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.max(booking.progressPercent, 12)}%`,
                        backgroundColor: statusStyle.barColor,
                      },
                    ]}
                  />
                </View>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabelText}>{booking.progressLabel}</Text>
                  <Text style={styles.quantityText}>{booking.quantityQuintals} Qtl</Text>
                </View>
              </View>

              {/* Inspector Badge if available */}
              {booking.inspectorName ? (
                <View style={styles.inspectorRow}>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={12} color={ThemeColors.textSecondary} />
                  </View>
                  <Text style={styles.inspectorName}>{booking.inspectorName}</Text>
                </View>
              ) : null}
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
    marginTop: 10,
    marginBottom: 100, // accommodate floating bottom nav
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
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
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: ThemeColors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cropTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  mandiSubtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 14,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  progressLabelText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  inspectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  avatarCircle: {
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
});
