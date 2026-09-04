import React, { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StatCardsList } from './StatCardsList';
import { CommodityTickerSection } from './CommodityTickerSection';
import { RecentBookingsList } from './RecentBookingsList';
import type { StatCardItem, BookingItem } from '@/interfaces';

interface DashboardMainViewProps {
  onNavigateToBookings: () => void;
  onNavigateToMandi: () => void;
}

const STATIC_STATS: StatCardItem[] = [
  {
    id: 'stat-sales',
    title: 'Total Sales & Payouts',
    value: '₹1.42L',
    colorTheme: 'mint',
    iconName: 'cash-outline',
    trendText: '+14.2% month',
    trendDirection: 'up',
  },
  {
    id: 'stat-lots',
    title: 'Active Crop Lots',
    value: '450',
    unit: 'Qtl',
    colorTheme: 'peach',
    iconName: 'leaf-outline',
    subtitle: '3 Lots in Queue',
  },
  {
    id: 'stat-rate',
    title: 'Nashik APMC Rate',
    value: '₹2,680',
    unit: '/qtl',
    colorTheme: 'lavender',
    iconName: 'trending-up-outline',
    trendText: '+₹120 today',
    trendDirection: 'up',
  },
  {
    id: 'stat-msp',
    title: 'MSP Realization',
    value: '98.4%',
    colorTheme: 'softGray',
    iconName: 'shield-checkmark-outline',
    trendText: 'Above Gov MSP',
    trendDirection: 'up',
  },
];

const STATIC_RECENT_BOOKINGS: BookingItem[] = [
  {
    id: 'b-1',
    bookingCode: 'BK-9402',
    cropName: 'Onion (Red)',
    cropVariety: 'Nashik Red A-Grade',
    mandiName: 'Nashik APMC Mandi',
    gateNo: 'Gate 3',
    dateString: 'Sep 08, 2026',
    timeSlot: '09:30 AM',
    status: 'in_progress',
    statusLabel: 'In progress',
    progressPercent: 65,
    progressLabel: 'Unloaded & Quality Graded',
    quantityQuintals: 240,
  },
  {
    id: 'b-2',
    bookingCode: 'BK-8821',
    cropName: 'Cotton',
    cropVariety: 'Medium Staple',
    mandiName: 'Nagpur APMC Hub',
    gateNo: 'Gate 1',
    dateString: 'Sep 12, 2026',
    timeSlot: '11:00 AM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    progressPercent: 20,
    progressLabel: 'Vehicle Entry QR Pass Generated',
    quantityQuintals: 180,
  },
];

export const DashboardMainView = memo(function DashboardMainView({
  onNavigateToBookings,
  onNavigateToMandi,
}: DashboardMainViewProps) {
  const handleStatPress = (statId: string) => {
    if (statId === 'stat-rate') {
      onNavigateToMandi();
    } else {
      onNavigateToBookings();
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* 2x2 Grid of Pastel Stat Cards */}
      <View style={styles.statsSection}>
        <StatCardsList stats={STATIC_STATS} onCardPress={handleStatPress} />
      </View>

      {/* Live APMC Commodity Price Ticker */}
      <CommodityTickerSection onSelectCrop={() => onNavigateToMandi()} />

      {/* Recent Bookings Cards */}
      <RecentBookingsList
        bookings={STATIC_RECENT_BOOKINGS}
        onViewAllPress={onNavigateToBookings}
        onBookingPress={onNavigateToBookings}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  statsSection: {
    marginTop: 4,
    marginBottom: 6,
  },
});
