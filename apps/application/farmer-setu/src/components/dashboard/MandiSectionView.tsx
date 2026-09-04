import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { FilterPillBar } from './FilterPillBar';
import type { MandiItem } from '@/interfaces';

const MANDI_FILTER_OPTIONS = [
  { id: 'all', label: 'All Mandis' },
  { id: 'nearby', label: 'Nearby (< 25 km)' },
  { id: 'top_rates', label: 'Top Modal Rates' },
  { id: 'low_wait', label: 'Shortest Queue' },
];

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
  },
  {
    id: 'mandi-2',
    name: 'Lasalgaon APMC Market',
    district: 'Lasalgaon, Maharashtra',
    distanceKm: 28.1,
    topCrop: 'Onion (Garva)',
    modalPrice: '₹2,850 / qtl',
    priceTrend: '+₹190 today',
    trendDirection: 'up',
    estimatedQueueTime: '45 mins wait',
    isOpen: true,
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
  },
];

export const MandiSectionView = memo(function MandiSectionView() {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleBookSlot = (mandiName: string) => {
    Alert.alert(
      'Slot Booking',
      `Ready to book gate entry pass for ${mandiName}. Select crop & vehicle in next step.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* Search & Filter pills */}
      <FilterPillBar
        options={MANDI_FILTER_OPTIONS}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Mandis List */}
      <View style={styles.list}>
        {STATIC_MANDIS.map((mandi) => (
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

            {/* Price & Crop stats card */}
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
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => handleBookSlot(mandi.name)}
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
        ))}
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
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
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
    fontSize: 19,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.4,
  },
  districtText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 14,
    marginTop: 2,
  },
  ratesBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratesLabel: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 20,
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
    gap: 6,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendBadgeUp: {
    backgroundColor: '#D1FAE5',
  },
  trendBadgeDown: {
    backgroundColor: '#FEE2E2',
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendTextUp: {
    color: '#065F46',
  },
  trendTextDown: {
    color: '#991B1B',
  },
  queueText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: ThemeColors.darkNav,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: ThemeColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
