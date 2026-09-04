import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import type { MandiItem } from '@/interfaces';

interface MandiMapViewModalProps {
  visible: boolean;
  onClose: () => void;
  mandis: MandiItem[];
  onSelectMandi: (mandi: MandiItem) => void;
}

const MAP_CROPS = ['All', 'Onion', 'Soybean', 'Cotton', 'Wheat'];

export const MandiMapViewModal = memo(function MandiMapViewModal({
  visible,
  onClose,
  mandis,
  onSelectMandi,
}: MandiMapViewModalProps) {
  const [selectedMandi, setSelectedMandi] = useState<MandiItem>(mandis[0] || null);
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');

  const filteredMandis = mandis.filter((m) => {
    if (selectedCropFilter === 'All') return true;
    return m.topCrop.toLowerCase().includes(selectedCropFilter.toLowerCase());
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Map Header Bar */}
        <View style={styles.headerBar}>
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}>
            <Ionicons name="close" size={22} color={ThemeColors.textPrimary} />
          </Pressable>

          <View style={styles.headerTitles}>
            <Text style={styles.mapTitle}>Live Mandi Radar & Map</Text>
            <Text style={styles.mapSubtitle}>Your Location: Niphad, Nashik 📍</Text>
          </View>

          <Pressable
            onPress={() => {
              Alert.alert('GPS Calibrated', 'Your location is accurate within 10 meters.');
            }}
            style={({ pressed }) => [styles.gpsBtn, pressed && styles.pressed]}>
            <Ionicons name="locate" size={18} color={ThemeColors.lavenderDark} />
          </Pressable>
        </View>

        {/* Filter chips directly on the map */}
        <View style={styles.filterStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            {MAP_CROPS.map((crop) => {
              const active = selectedCropFilter === crop;
              return (
                <Pressable
                  key={crop}
                  onPress={() => setSelectedCropFilter(crop)}
                  style={[
                    styles.cropChip,
                    active ? styles.cropChipActive : styles.cropChipInactive,
                  ]}>
                  <Text
                    style={[
                      styles.cropChipText,
                      active ? styles.cropChipTextActive : styles.cropChipTextInactive,
                    ]}>
                    {crop}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Visual Map Canvas */}
        <View style={styles.mapCanvas}>
          {/* Subtle grid and terrain graphics */}
          <View style={styles.gridLineHorizontal1} />
          <View style={styles.gridLineHorizontal2} />
          <View style={styles.gridLineVertical1} />
          <View style={styles.gridLineVertical2} />

          {/* Highway curves */}
          <View style={styles.roadHighway} />
          <View style={styles.roadSecondary} />

          {/* User Location Radar Pin (Center) */}
          <View style={styles.userLocationMarker}>
            <View style={styles.userPulseRing} />
            <View style={styles.userPulseRingOuter} />
            <View style={styles.userDot}>
              <Ionicons name="navigate" size={12} color="#FFFFFF" />
            </View>
            <View style={styles.userLabelCard}>
              <Text style={styles.userLabelText}>You are here</Text>
            </View>
          </View>

          {/* Nearby Mandi Pins */}
          {filteredMandis.map((mandi, index) => {
            const isSelected = selectedMandi?.id === mandi.id;

            // Map pin positioning offsets based on index
            const pinOffsets: Array<{ top: `${number}%`; left: `${number}%` }> = [
              { top: '22%', left: '60%' },
              { top: '35%', left: '18%' },
              { top: '65%', left: '70%' },
              { top: '75%', left: '26%' },
            ];
            const offset = pinOffsets[index % pinOffsets.length];


            return (
              <Pressable
                key={mandi.id}
                onPress={() => setSelectedMandi(mandi)}
                style={[styles.mandiPinContainer, offset]}>
                <View
                  style={[
                    styles.pinBadge,
                    isSelected && styles.pinBadgeSelected,
                  ]}>
                  <Ionicons
                    name="storefront"
                    size={13}
                    color={isSelected ? '#FFFFFF' : ThemeColors.darkNav}
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.pinBadgeText,
                      isSelected && styles.pinBadgeTextSelected,
                    ]}>
                    {mandi.modalPrice.split(' ')[0]}
                  </Text>
                </View>
                <View
                  style={[
                    styles.pinAnchorDot,
                    isSelected && styles.pinAnchorDotSelected,
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        {/* Selected Mandi Bottom Sheet Info Card */}
        {selectedMandi ? (
          <View style={styles.bottomCardContainer}>
            <View style={styles.mandiDetailCard}>
              <View style={styles.detailHeader}>
                <View>
                  <Text style={styles.detailName}>{selectedMandi.name}</Text>
                  <Text style={styles.detailDistrict}>
                    {selectedMandi.district} • {selectedMandi.distanceKm} km away
                  </Text>
                </View>

                <View style={styles.detailPriceBox}>
                  <Text style={styles.detailPrice}>{selectedMandi.modalPrice}</Text>
                  <Text style={styles.detailTrend}>
                    {selectedMandi.trendDirection === 'up' ? '↑ ' : '↓ '}
                    {selectedMandi.priceTrend}
                  </Text>
                </View>
              </View>

              <View style={styles.infoPillsRow}>
                <View style={styles.tagPill}>
                  <Ionicons name="leaf-outline" size={12} color={ThemeColors.mintDark} />
                  <Text style={styles.tagText}>{selectedMandi.topCrop}</Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="time-outline" size={12} color={ThemeColors.peachDark} />
                  <Text style={styles.tagText}>{selectedMandi.estimatedQueueTime}</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => {
                    onClose();
                    onSelectMandi(selectedMandi);
                  }}
                  style={({ pressed }) => [styles.bookPassBtn, pressed && styles.pressed]}>
                  <Text style={styles.bookPassText}>Book Gate Entry Slot</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#EAF0F6',
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitles: {
    alignItems: 'center',
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  mapSubtitle: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  gpsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  filterStrip: {
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  cropChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  cropChipActive: {
    backgroundColor: ThemeColors.darkNav,
  },
  cropChipInactive: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cropChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cropChipTextActive: {
    color: '#FFFFFF',
  },
  cropChipTextInactive: {
    color: ThemeColors.textSecondary,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E4ECF4',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLineHorizontal1: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    top: '70%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  gridLineVertical1: {
    position: 'absolute',
    left: '30%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  gridLineVertical2: {
    position: 'absolute',
    left: '70%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  roadHighway: {
    position: 'absolute',
    top: '45%',
    left: '-20%',
    width: '140%',
    height: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-25deg' }],
    borderRadius: 6,
  },
  roadSecondary: {
    position: 'absolute',
    top: '30%',
    left: '-10%',
    width: '120%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ rotate: '40deg' }],
    borderRadius: 4,
  },
  userLocationMarker: {
    position: 'absolute',
    top: '50%',
    left: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(162, 142, 249, 0.35)',
  },
  userPulseRingOuter: {
    position: 'absolute',
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(162, 142, 249, 0.15)',
  },
  userDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ThemeColors.lavenderDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userLabelCard: {
    position: 'absolute',
    top: 30,
    backgroundColor: ThemeColors.darkNav,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  userLabelText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mandiPinContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ThemeColors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pinBadgeSelected: {
    backgroundColor: ThemeColors.darkNav,
    borderColor: ThemeColors.darkNav,
    transform: [{ scale: 1.08 }],
  },
  pinBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  pinBadgeTextSelected: {
    color: '#FFFFFF',
  },
  pinAnchorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ThemeColors.darkNav,
    marginTop: 2,
  },
  pinAnchorDotSelected: {
    backgroundColor: ThemeColors.lavenderDark,
  },
  bottomCardContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    backgroundColor: 'transparent',
  },
  mandiDetailCard: {
    backgroundColor: ThemeColors.white,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  detailName: {
    fontSize: 17,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.3,
  },
  detailDistrict: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  detailPriceBox: {
    alignItems: 'flex-end',
  },
  detailPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  detailTrend: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    marginTop: 2,
  },
  infoPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
  },
  bookPassBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeColors.darkNav,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  bookPassText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
