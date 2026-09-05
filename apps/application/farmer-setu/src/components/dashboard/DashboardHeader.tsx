import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showSearchButton?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  hasUnreadNotifications?: boolean;
}

export const DashboardHeader = memo(function DashboardHeader({
  title,
  subtitle,
  showSearchButton = false,
  onSearchPress,
  onNotificationPress,
  hasUnreadNotifications = true,
}: DashboardHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.actionsRow}>
        {showSearchButton ? (
          <Pressable
            onPress={onSearchPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
            <Ionicons name="search-outline" size={20} color={ThemeColors.textPrimary} />
          </Pressable>
        ) : null}

        <Pressable
          onPress={onNotificationPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
          <Ionicons name="notifications-outline" size={20} color={ThemeColors.textPrimary} />
          {hasUnreadNotifications ? <View style={styles.unreadBadgeDot} /> : null}
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.lavender,
  },
});
