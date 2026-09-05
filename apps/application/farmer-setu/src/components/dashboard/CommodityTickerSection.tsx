import React, { memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';

interface CommodityItem {
  id: string;
  name: string;
  mandi: string;
  price: string;
  change: string;
  trend: 'up' | 'down';
}

const LIVE_COMMODITIES: CommodityItem[] = [
  { id: '1', name: 'Onion (Red)', mandi: 'Morwadi APMC', price: '₹2,750', change: '+₹140', trend: 'up' },
  { id: '2', name: 'Soybean', mandi: 'Pimpri Central', price: '₹2,890', change: '+₹80', trend: 'up' },
  { id: '3', name: 'Wheat (Sharbati)', mandi: 'Gultekdi Market Yard', price: '₹4,920', change: '+₹220', trend: 'up' },
  { id: '4', name: 'Tomato', mandi: 'Bhosari MIDC', price: '₹3,450', change: '+₹210', trend: 'up' },
  { id: '5', name: 'Green Peas', mandi: 'Chinchwad Station', price: '₹3,200', change: '-₹50', trend: 'down' },
];

export const CommodityTickerSection = memo(function CommodityTickerSection({
  onSelectCrop,
}: {
  onSelectCrop?: (cropName: string) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.liveIndicatorRow}>
          <View style={styles.liveDot} />
          <Text style={styles.title}>Live Mandi Market Rates</Text>
        </View>
        <Text style={styles.subtitle}>APMC Live e-NAM</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {LIVE_COMMODITIES.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onSelectCrop?.(item.name)}
            style={({ pressed }) => [styles.tickerCard, pressed && styles.cardPressed]}>
            <View style={styles.cropTop}>
              <Text style={styles.cropName}>{item.name}</Text>
              <Text style={styles.mandiName}>{item.mandi}</Text>
            </View>

            <View style={styles.priceBottom}>
              <Text style={styles.priceText}>{item.price}</Text>
              <View
                style={[
                  styles.trendBadge,
                  item.trend === 'up' ? styles.trendUp : styles.trendDown,
                ]}>
                <Ionicons
                  name={item.trend === 'up' ? 'arrow-up' : 'arrow-down'}
                  size={10}
                  color={item.trend === 'up' ? '#15803D' : '#DC2626'}
                />
                <Text
                  style={[
                    styles.trendText,
                    item.trend === 'up' ? styles.trendTextUp : styles.trendTextDown,
                  ]}>
                  {item.change}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tickerCard: {
    backgroundColor: ThemeColors.white,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  cropTop: {
    marginBottom: 6,
  },
  cropName: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  mandiName: {
    fontSize: 10,
    color: ThemeColors.textSecondary,
    marginTop: 1,
  },
  priceBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  trendUp: {
    backgroundColor: '#DCFCE7',
  },
  trendDown: {
    backgroundColor: '#FEE2E2',
  },
  trendText: {
    fontSize: 9,
    fontWeight: '700',
  },
  trendTextUp: {
    color: '#15803D',
  },
  trendTextDown: {
    color: '#DC2626',
  },
});
