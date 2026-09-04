import React, { memo, useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { FilterPillBar } from './FilterPillBar';
import { StatCardsList } from './StatCardsList';
import { SuggestionCard } from './SuggestionCard';
import { RecentBookingsList } from './RecentBookingsList';
import type { StatCardItem, SuggestionItem, BookingItem } from '@/interfaces';

interface DashboardMainViewProps {
  onNavigateToBookings: () => void;
  onNavigateToMandi: () => void;
}

const DASHBOARD_FILTER_OPTIONS = [
  { id: 'all', label: 'All Overview' },
  { id: 'crops', label: 'Active Crops' },
  { id: 'prices', label: 'Price Trends' },
  { id: 'auctions', label: 'Auctions' },
];

const STATIC_STATS: StatCardItem[] = [
  {
    id: 'stat-sales',
    title: 'Total Sales & Payouts',
    value: '₹1,42,800',
    colorTheme: 'mint',
    iconName: 'cash-outline',
    trendText: '+14.2% vs last month',
    trendDirection: 'up',
    badgeLabel: 'Direct Bank Credit',
  },
  {
    id: 'stat-lots',
    title: 'Active Crop Lots',
    value: '450',
    unit: 'Quintals',
    colorTheme: 'peach',
    iconName: 'leaf-outline',
    subtitle: '3 Lots in APMC Auction Queue',
    progressPercent: 72,
    badgeLabel: 'In Transit / Gate',
  },
  {
    id: 'stat-rate',
    title: 'Nashik APMC Onion Rate',
    value: '₹2,680',
    unit: '/ qtl',
    colorTheme: 'lavender',
    iconName: 'trending-up-outline',
    trendText: '↑ +₹120 today (High Demand)',
    trendDirection: 'up',
    badgeLabel: 'Market Rate',
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
    cropName: 'Onion',
    cropVariety: 'Nashik Red A-Grade',
    mandiName: 'Nashik APMC Mandi',
    gateNo: 'Gate 3',
    dateString: 'May 28, 2026',
    timeSlot: '09:30 AM',
    status: 'in_progress',
    statusLabel: 'In progress',
    progressPercent: 65,
    progressLabel: 'Unloaded & Quality Graded',
    inspectorName: 'Patil (Grading Officer)',
    quantityQuintals: 240,
    commentsCount: 12,
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
    statusLabel: 'Confirmed Pass',
    progressPercent: 20,
    progressLabel: 'Vehicle Entry QR Pass Generated',
    inspectorName: 'Officer Deshmukh',
    quantityQuintals: 180,
    commentsCount: 2,
  },
];

export const DashboardMainView = memo(function DashboardMainView({
  onNavigateToBookings,
  onNavigateToMandi,
}: DashboardMainViewProps) {
  const [activeFilter, setActiveFilter] = useState('all');

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
      
      {/* Filter Tabs */}
      <FilterPillBar
        options={DASHBOARD_FILTER_OPTIONS}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Pastel Stat Cards matching reference design */}
      <View style={styles.statsSection}>
        <StatCardsList stats={STATIC_STATS} onCardPress={handleStatPress} />
      </View>

      {/* AI Suggestion Advisory */}
      <SuggestionCard
        suggestion={STATIC_SUGGESTION}
        onPress={handleSuggestionPress}
      />

      {/* Recent Bookings matching reference cards */}
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
    marginTop: 10,
    marginBottom: 10,
  },
});
