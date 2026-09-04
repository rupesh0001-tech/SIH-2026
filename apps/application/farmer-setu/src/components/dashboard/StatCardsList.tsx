import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import type { StatCardItem, StatColorTheme } from '@/interfaces';

interface StatCardsListProps {
  stats: StatCardItem[];
  onCardPress?: (statId: string) => void;
}

const getBackgroundColor = (theme: StatColorTheme) => {
  switch (theme) {
    case 'mint':
      return '#D8F7D9';
    case 'peach':
      return '#FFE8C6';
    case 'lavender':
      return '#E7E0FF';
    case 'softGray':
    default:
      return '#EAECEE';
  }
};

const getTextColor = (theme: StatColorTheme) => {
  switch (theme) {
    case 'mint':
      return '#1B5E20';
    case 'peach':
      return '#8D4004';
    case 'lavender':
      return '#43289E';
    case 'softGray':
    default:
      return '#1F2937';
  }
};

const getIconColor = (theme: StatColorTheme) => {
  switch (theme) {
    case 'mint':
      return '#16A34A';
    case 'peach':
      return '#EA580C';
    case 'lavender':
      return '#7C3AED';
    case 'softGray':
    default:
      return '#4B5563';
  }
};

export const StatCardsList = memo(function StatCardsList({
  stats,
  onCardPress,
}: StatCardsListProps) {
  return (
    <View style={styles.gridContainer}>
      {stats.map((stat) => {
        const bg = getBackgroundColor(stat.colorTheme);
        const textColor = getTextColor(stat.colorTheme);
        const iconColor = getIconColor(stat.colorTheme);

        return (
          <Pressable
            key={stat.id}
            onPress={() => onCardPress?.(stat.id)}
            style={({ pressed }) => [
              styles.gridCard,
              { backgroundColor: bg },
              pressed && styles.cardPressed,
            ]}>
            
            {/* Top row: Title and Floating Icon */}
            <View style={styles.cardHeader}>
              <Text numberOfLines={1} style={[styles.cardTitle, { color: textColor }]}>
                {stat.title}
              </Text>
              <View style={styles.floatingIconCircle}>
                <Ionicons name={stat.iconName as any} size={16} color={iconColor} />
              </View>
            </View>

            {/* Big Value Display */}
            <View style={styles.valueRow}>
              <Text numberOfLines={1} style={styles.valueText}>
                {stat.value}
              </Text>
              {stat.unit ? (
                <Text style={styles.unitText}>{stat.unit}</Text>
              ) : null}
            </View>

            {/* Trend or Subtitle */}
            <View style={styles.cardFooter}>
              {stat.trendText ? (
                <View style={styles.trendRow}>
                  <Text
                    style={[
                      styles.trendArrow,
                      stat.trendDirection === 'down' ? styles.trendDown : styles.trendUp,
                    ]}>
                    {stat.trendDirection === 'down' ? '↓' : '↑'}
                  </Text>
                  <Text numberOfLines={1} style={[styles.trendText, { color: textColor }]}>
                    {stat.trendText}
                  </Text>
                </View>
              ) : stat.subtitle ? (
                <Text numberOfLines={1} style={styles.subtitleText}>
                  {stat.subtitle}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    borderRadius: 22,
    padding: 14,
    minHeight: 125,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    marginRight: 4,
    letterSpacing: -0.2,
  },
  floatingIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  valueText: {
    fontSize: 21,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.textSecondary,
    marginLeft: 3,
  },
  cardFooter: {
    marginTop: 2,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  trendArrow: {
    fontSize: 10,
    fontWeight: '800',
    marginRight: 2,
  },
  trendUp: {
    color: '#16A34A',
  },
  trendDown: {
    color: '#DC2626',
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subtitleText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
});
