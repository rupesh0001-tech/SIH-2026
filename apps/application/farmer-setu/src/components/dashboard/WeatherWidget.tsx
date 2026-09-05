import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useLanguage } from '@/context/LanguageContext';

export const WeatherWidget = memo(function WeatherWidget() {
  const { locationName } = useUserLocation();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.weatherMain}>
            <Ionicons name="sunny" size={24} color="#F59E0B" />
            <View>
              <Text style={styles.tempText}>{t('weather.title')}</Text>
              <Text style={styles.locationText}>{locationName || 'Nashik Mandi Zone'} ({t('weather.humidity')})</Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('weather.badge')}</Text>
          </View>
        </View>

        <Text style={styles.advisoryText}>
          {t('weather.advisory')}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tempText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  locationText: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  advisoryText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
    fontWeight: '500',
  },
});
