import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { ThemeColors } from '@/constants/theme';
import { FloatingBottomNav } from '@/components/navigation/FloatingBottomNav';
import {
  DashboardHeader,
  DashboardMainView,
  MandiSectionView,
  BookingsSectionView,
  SettingsSectionView,
} from '@/components/dashboard';
import type { NavTabType } from '@/interfaces';

export default function FarmerDashboardScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTabType>('dashboard');

  const farmerName = user?.name || 'Ramesh Kisan';

  const getHeaderInfo = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: `Namaste, ${farmerName} 🌾`,
        };
      case 'mandi':
        return {
          title: 'Market Mandis',
          subtitle: 'Live APMC Rates & Auctions',
        };
      case 'bookings':
        return {
          title: 'My Bookings',
          subtitle: 'Gate Passes & Auction Slots',
        };
      case 'settings':
        return {
          title: 'My Profile',
          subtitle: 'Kisan KYC & App Settings',
        };
    }
  }, [activeTab, farmerName]);

  const handleSearchPress = useCallback(() => {
    Alert.alert('Search Mandi Setu', 'Search crops, modal prices, mandi slots, or token numbers.', [
      { text: 'OK' },
    ]);
  }, []);

  const handleNotificationPress = useCallback(() => {
    Alert.alert(
      'Mandi Notifications',
      '• Onion slot #BK-9402 assay is completed.\n• Tomorrow MSP rates announced for Lasalgaon APMC.',
      [{ text: 'OK' }]
    );
  }, []);

  const headerInfo = getHeaderInfo();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Top Header */}
        <DashboardHeader
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onSearchPress={handleSearchPress}
          onNotificationPress={handleNotificationPress}
          hasUnreadNotifications={true}
        />

        {/* Dynamic Section Content */}
        <View style={styles.contentArea}>
          {activeTab === 'dashboard' ? (
            <DashboardMainView
              onNavigateToBookings={() => setActiveTab('bookings')}
              onNavigateToMandi={() => setActiveTab('mandi')}
            />
          ) : null}

          {activeTab === 'mandi' ? <MandiSectionView /> : null}

          {activeTab === 'bookings' ? <BookingsSectionView /> : null}

          {activeTab === 'settings' ? <SettingsSectionView /> : null}
        </View>

        {/* Sleek Floating Bottom Navigation Bar */}
        <FloatingBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: ThemeColors.background,
  },
  contentArea: {
    flex: 1,
  },
});
