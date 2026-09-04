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
    <View style={styles.container}>
      {stats.map((stat) => {
        const bg = getBackgroundColor(stat.colorTheme);
        const textColor = getTextColor(stat.colorTheme);
        const iconColor = getIconColor(stat.colorTheme);

        return (
          <Pressable
            key={stat.id}
            onPress={() => onCardPress?.(stat.id)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: bg },
              pressed && styles.cardPressed,
            ]}>
            
            {/* Header: Title & Circular Floating Icon */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.cardTitle, { color: textColor }]}>{stat.title}</Text>
                {stat.badgeLabel ? (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{stat.badgeLabel}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.floatingIconCircle}>
                <Ionicons name={stat.iconName as any} size={20} color={iconColor} />
              </View>
            </View>

            {/* Big Value Display */}
            <View style={styles.valueRow}>
              <Text style={styles.valueText}>{stat.value}</Text>
              {stat.unit ? <Text style={styles.unitText}>{stat.unit}</Text> : null}
            </View>

            {/* Optional Progress Bar matching Ref Image 1 & 2 */}
            {stat.progressPercent !== undefined ? (
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${stat.progressPercent}%`,
                      backgroundColor: iconColor,
                    },
                  ]}
                />
              </View>
            ) : null}

            {/* Footer / Trend / Subtitle */}
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
                  <Text style={[styles.trendText, { color: textColor }]}>
                    {stat.trendText}
                  </Text>
                </View>
              ) : null}

              {stat.subtitle ? (
                <Text style={styles.subtitleText}>{stat.subtitle}</Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    borderRadius: 26,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  badgePill: {
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  floatingIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  valueText: {
    fontSize: 32,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.8,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: ThemeColors.textSecondary,
    marginLeft: 6,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendArrow: {
    fontSize: 13,
    fontWeight: '800',
    marginRight: 4,
  },
  trendUp: {
    color: '#16A34A',
  },
  trendDown: {
    color: '#DC2626',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subtitleText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
});
