import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import type { SuggestionItem } from '@/interfaces';

interface SuggestionCardProps {
  suggestion: SuggestionItem;
  onPress?: () => void;
}

export const SuggestionCard = memo(function SuggestionCard({
  suggestion,
  onPress,
}: SuggestionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.badgePill}>
            <Ionicons name="sparkles" size={13} color={ThemeColors.lavenderDark} />
            <Text style={styles.badgeText}>{suggestion.badge}</Text>
          </View>
        </View>

        <Text style={styles.title}>{suggestion.title}</Text>
        <Text style={styles.description}>{suggestion.description}</Text>

        <Pressable
          onPress={onPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}>
          <Text style={styles.actionText}>{suggestion.actionLabel}</Text>
          <Ionicons name="arrow-forward" size={14} color={ThemeColors.lavenderDark} />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#F4EFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8DEFF',
    shadowColor: '#A28EF9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ThemeColors.lavenderDark,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: ThemeColors.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 6,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.lavenderDark,
  },
});
