import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';

interface QuickActionsGridProps {
  onBookPassPress: () => void;
  onAdvisoryPress: () => void;
}

export const QuickActionsGrid = memo(function QuickActionsGrid({
  onBookPassPress,
  onAdvisoryPress,
}: QuickActionsGridProps) {
  const { t } = useLanguage();

  const handleLogistics = () => {
    Alert.alert(t('quick.book_logistics'), 'Book verified tractor / mini-truck for crop transport to mandi.');
  };

  const handleMspCalculator = () => {
    Alert.alert(t('quick.msp_calc'), 'Calculate your estimated realization based on current Grade & Moisture assay.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('quick.title')}</Text>

      <View style={styles.grid}>
        {/* Action 1 */}
        <Pressable
          onPress={onBookPassPress}
          style={({ pressed }) => [styles.actionCard, styles.bgMint, pressed && styles.cardPressed]}>
          <View style={styles.iconCircle}>
            <Ionicons name="storefront" size={18} color="#15803D" />
          </View>
          <Text style={styles.actionTitle}>{t('quick.book_pass')}</Text>
          <Text style={styles.actionSubtitle}>{t('quick.book_pass_sub')}</Text>
        </Pressable>

        {/* Action 2 */}
        <Pressable
          onPress={onAdvisoryPress}
          style={({ pressed }) => [styles.actionCard, styles.bgLavender, pressed && styles.cardPressed]}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={18} color="#0284C7" />
          </View>
          <Text style={styles.actionTitle}>{t('quick.crop_advisory')}</Text>
          <Text style={styles.actionSubtitle}>{t('quick.crop_advisory_sub')}</Text>
        </Pressable>

        {/* Action 3 */}
        <Pressable
          onPress={handleLogistics}
          style={({ pressed }) => [styles.actionCard, styles.bgPeach, pressed && styles.cardPressed]}>
          <View style={styles.iconCircle}>
            <Ionicons name="car-outline" size={18} color={ThemeColors.peachDark} />
          </View>
          <Text style={styles.actionTitle}>{t('quick.book_logistics')}</Text>
          <Text style={styles.actionSubtitle}>{t('quick.book_logistics_sub')}</Text>
        </Pressable>

        {/* Action 4 */}
        <Pressable
          onPress={handleMspCalculator}
          style={({ pressed }) => [styles.actionCard, styles.bgGray, pressed && styles.cardPressed]}>
          <View style={styles.iconCircle}>
            <Ionicons name="calculator-outline" size={18} color="#374151" />
          </View>
          <Text style={styles.actionTitle}>{t('quick.msp_calc')}</Text>
          <Text style={styles.actionSubtitle}>{t('quick.msp_calc_sub')}</Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  bgMint: {
    backgroundColor: '#EDFDF0',
  },
  bgLavender: {
    backgroundColor: '#F0F9FF',
  },
  bgPeach: {
    backgroundColor: '#FFF7EB',
  },
  bgGray: {
    backgroundColor: '#F3F4F6',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  actionSubtitle: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
});
