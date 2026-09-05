import React, { memo, useState, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StatCardsList } from './StatCardsList';
import { CommodityTickerSection } from './CommodityTickerSection';
import { RecentBookingsList } from './RecentBookingsList';
import { useAuth } from '@/context/AuthContext';
import { getFarmerBookingsApi, getApprovedMandisApi } from '@/services/farmer.service';
import type { StatCardItem, BookingItem } from '@/interfaces';

interface DashboardMainViewProps {
  onNavigateToBookings: () => void;
  onNavigateToMandi: () => void;
}

export const DashboardMainView = memo(function DashboardMainView({
  onNavigateToBookings,
  onNavigateToMandi,
}: DashboardMainViewProps) {
  const { token } = useAuth();
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [totalMandisCount, setTotalMandisCount] = useState<number>(22);

  // Fetch real bookings and mandi count from backend
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (token) {
        try {
          const bookingsRes = await getFarmerBookingsApi(token);
          if (isMounted && bookingsRes.success && bookingsRes.data?.bookings) {
            setDbBookings(bookingsRes.data.bookings);
          }
        } catch {}
      }

      try {
        const mandisRes = await getApprovedMandisApi(token || undefined);
        if (isMounted && mandisRes.success && mandisRes.data?.mandis) {
          setTotalMandisCount(mandisRes.data.mandis.length);
        }
      } catch {}
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Formatted booking items for recent bookings section
  const recentBookings: BookingItem[] = useMemo(() => {
    return dbBookings.map((b) => ({
      id: b.id,
      bookingCode: b.token || `BK-${b.id.slice(0, 4)}`,
      cropName: b.crop || 'Agricultural Produce',
      cropVariety: b.variety || 'Standard APMC Grade',
      mandiName: b.mandiProfile?.mandiName || 'APMC Yard',
      gateNo: 'Gate 1',
      dateString: b.slot?.date || new Date(b.createdAt).toLocaleDateString(),
      timeSlot: `${b.slot?.startTime || '07:00'} - ${b.slot?.endTime || '11:00'}`,
      status: (b.status?.toLowerCase() === 'accepted' ? 'confirmed' : b.status?.toLowerCase() === 'completed' ? 'completed' : 'in_progress') as any,
      statusLabel: b.status || 'Confirmed',
      progressPercent: b.status === 'COMPLETED' ? 100 : b.status === 'VERIFIED' ? 75 : 30,
      progressLabel: b.status === 'COMPLETED' ? 'Transaction Completed' : b.status === 'VERIFIED' ? 'Gate Verified' : 'Slot Confirmed',
      quantityQuintals: b.quantityQuintals || 0,
    }));
  }, [dbBookings]);

  // Calculate Real Metric Counts
  const totalBookingsCount = dbBookings.length;
  const activeBookingsCount = dbBookings.filter(
    (b) => b.status === 'PENDING' || b.status === 'ACCEPTED' || b.status === 'ARRIVED' || b.status === 'VERIFIED'
  ).length;

  // Total Crop Sold in kg (1 Quintal = 100 kg)
  const totalKgSold = dbBookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.quantityQuintals || 0) * 100, 0);

  const dynamicStats: StatCardItem[] = useMemo(() => {
    return [
      {
        id: 'stat-total-bookings',
        title: 'Total Bookings',
        value: String(totalBookingsCount),
        colorTheme: 'mint',
        iconName: 'calendar-outline',
        subtitle: totalBookingsCount === 0 ? 'No bookings recorded' : `${totalBookingsCount} total passes`,
      },
      {
        id: 'stat-crop-sold',
        title: 'Total Crop Sold',
        value: `${totalKgSold}`,
        unit: 'kg',
        colorTheme: 'peach',
        iconName: 'leaf-outline',
        subtitle: totalKgSold === 0 ? '0 kg completed' : `${totalKgSold} kg delivered`,
      },
      {
        id: 'stat-total-mandis',
        title: 'Total Mandis',
        value: String(totalMandisCount),
        colorTheme: 'lavender',
        iconName: 'storefront-outline',
        subtitle: 'Pune & PCMC Cluster',
      },
      {
        id: 'stat-active-bookings',
        title: 'Active Bookings',
        value: String(activeBookingsCount),
        colorTheme: 'softGray',
        iconName: 'time-outline',
        subtitle: activeBookingsCount === 0 ? 'No active slots' : `${activeBookingsCount} active gate slots`,
      },
    ];
  }, [totalBookingsCount, totalKgSold, totalMandisCount, activeBookingsCount]);

  const handleStatPress = (statId: string) => {
    if (statId === 'stat-total-mandis') {
      onNavigateToMandi();
    } else {
      onNavigateToBookings();
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* 2x2 Grid of pastel stat cards renamed as requested */}
      <View style={styles.statsSection}>
        <StatCardsList stats={dynamicStats} onCardPress={handleStatPress} />
      </View>

      {/* Live APMC Commodity Price Ticker */}
      <CommodityTickerSection onSelectCrop={() => onNavigateToMandi()} />

      {/* Recent Bookings Section (Empty state if 0 bookings) */}
      <RecentBookingsList
        bookings={recentBookings}
        onViewAllPress={onNavigateToBookings}
        onBookingPress={onNavigateToBookings}
        onExploreMandis={onNavigateToMandi}
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
