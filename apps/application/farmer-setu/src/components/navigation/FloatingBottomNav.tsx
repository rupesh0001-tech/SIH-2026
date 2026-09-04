import React, { memo } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import type { NavTabType } from '@/interfaces';

interface FloatingBottomNavProps {
  activeTab: NavTabType;
  onTabChange: (tab: NavTabType) => void;
}

interface NavItem {
  id: NavTabType;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    activeIcon: 'grid',
    inactiveIcon: 'grid-outline',
  },
  {
    id: 'mandi',
    label: 'Mandi',
    activeIcon: 'storefront',
    inactiveIcon: 'storefront-outline',
  },
  {
    id: 'bookings',
    label: 'Bookings',
    activeIcon: 'calendar',
    inactiveIcon: 'calendar-outline',
  },
  {
    id: 'settings',
    label: 'Settings',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
];

export const FloatingBottomNav = memo(function FloatingBottomNav({
  activeTab,
  onTabChange,
}: FloatingBottomNavProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.pillBar}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => onTabChange(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={item.label}
              style={({ pressed }) => [
                styles.navItem,
                isActive && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}>
              <Ionicons
                name={isActive ? item.activeIcon : item.inactiveIcon}
                size={isActive ? 22 : 22}
                color={isActive ? ThemeColors.darkNav : 'rgba(255, 255, 255, 0.7)'}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ThemeColors.darkNav,
    borderRadius: 36,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    gap: 12,
  },
  navItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: ThemeColors.white,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  navItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
});
