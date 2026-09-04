import React, { memo } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { StatCardsList } from './StatCardsList';
import { SuggestionCard } from './SuggestionCard';
import { RecentBookingsList } from './RecentBookingsList';
import type { StatCardItem, SuggestionItem, BookingItem } from '@/interfaces';

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

const STATIC_SUGGESTION: SuggestionItem = {
  id: 'sug-1',
  title: 'Favorable selling window for Soybean',
  description:
    'Prices are expected to peak by 4-6% over the next 3 days at Pune APMC due to lower arrivals from Marathwada.',
  badge: 'AI Market Advisory',
  accentColor: 'lavender',
  actionLabel: 'View Mandi Forecast',
};

const STATIC_RECENT_BOOKINGS: BookingItem[] = [
  {
    id: 'b-1',
    bookingCode: 'BK-9402',
    cropName: 'Onion (Red)',
    cropVariety: 'Nashik Red A-Grade',
    mandiName: 'Nashik APMC Mandi',
    gateNo: 'Gate 3',
    dateString: 'May 28, 2026',
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
    dateString: 'May 30, 2026',
    timeSlot: '11:00 AM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    progressPercent: 20,
    progressLabel: 'Vehicle Entry QR Pass Generated',
    quantityQuintals: 180,
  },
  {
    id: 'b-3',
    bookingCode: 'BK-7612',
    cropName: 'Wheat (Sharbati)',
    cropVariety: 'Grade A',
    mandiName: 'Lasalgaon Mandi',
    gateNo: 'Gate 2',
    dateString: 'Jun 02, 2026',
    timeSlot: '02:00 PM',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    progressPercent: 10,
    progressLabel: 'QR Pass Issued',
    quantityQuintals: 320,
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

  const handleSuggestionPress = () => {
    Alert.alert(
      'AI Crop Advisory',
      'Soybean prices are anticipated to remain strong. Consider booking a slot at Pune or Lasalgaon Mandi for highest realized modal value.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Slot', onPress: onNavigateToMandi },
      ]
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* 2x2 Grid of Pastel Stat Cards */}
      <View style={styles.statsSection}>
        <StatCardsList stats={STATIC_STATS} onCardPress={handleStatPress} />
      </View>

      {/* AI Suggestion Advisory */}
      <SuggestionCard
        suggestion={STATIC_SUGGESTION}
        onPress={handleSuggestionPress}
      />

      {/* Recent Bookings Compact Table */}
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
