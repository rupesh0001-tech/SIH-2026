import React, { memo, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Image,
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

const OSM_MAP_TILES = [
  'https://tile.openstreetmap.org/11/1474/914.png',
  'https://tile.openstreetmap.org/11/1475/914.png',
  'https://tile.openstreetmap.org/11/1474/915.png',
  'https://tile.openstreetmap.org/11/1475/915.png',
];

export const MandiMapViewModal = memo(function MandiMapViewModal({
  visible,
  onClose,
  mandis,
  onSelectMandi,
}: MandiMapViewModalProps) {
  const [selectedMandi, setSelectedMandi] = useState<MandiItem>(mandis[0] || null);
  const [mapSearch, setMapSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [farmerFilter, setFarmerFilter] = useState('All');

  const filteredMandis = useMemo(() => {
    return mandis.filter((m) => {
      if (selectedCrop !== 'All' && !m.topCrop.toLowerCase().includes(selectedCrop.toLowerCase())) {
        return false;
      }
      if (mapSearch.trim()) {
        const query = mapSearch.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesDistrict = m.district.toLowerCase().includes(query);
        const matchesCrop = m.topCrop.toLowerCase().includes(query);
        if (!matchesName && !matchesDistrict && !matchesCrop) return false;
      }
      if (farmerFilter === '50+' && (m.activeFarmersCount || 0) < 50) return false;
      if (farmerFilter === '100+' && (m.activeFarmersCount || 0) < 100) return false;
      return true;
    });
  }, [mandis, selectedCrop, mapSearch, farmerFilter]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Improved Sleek Map Header Bar */}
        <View style={styles.headerBar}>
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={20} color={ThemeColors.textPrimary} />
          </Pressable>

          {/* Integrated Search Bar inside Header */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color={ThemeColors.textSecondary} />
            <TextInput
              placeholder="Search mandis on map..."
              placeholderTextColor="#9CA3AF"
              value={mapSearch}
              onChangeText={setMapSearch}
              style={styles.searchInput}
            />
            {mapSearch ? (
              <Pressable onPress={() => setMapSearch('')}>
                <Ionicons name="close-circle" size={14} color="#9CA3AF" />
              </Pressable>
            ) : null}
          </View>

          {/* Calibrate GPS button */}
          <Pressable
            onPress={() => {
              Alert.alert('GPS Location Locked', 'Accuracy: 5m • Niphad Farmer Farm (Nashik)');
            }}
            style={({ pressed }) => [styles.gpsBtn, pressed && styles.pressed]}>
            <Ionicons name="locate" size={18} color="#16A34A" />
          </Pressable>
        </View>

        {/* In-Map Quick Filters: Crop & Farmer Count */}
        <View style={styles.filterStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            {['All', 'Onion', 'Soybean', 'Cotton', 'Wheat'].map((c) => {
              const active = selectedCrop === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setSelectedCrop(c)}
                  style={[styles.cropChip, active ? styles.chipActive : styles.chipInactive]}>
                  <Text style={[styles.cropChipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                    {c}
                  </Text>
                </Pressable>
              );
            })}
            <View style={styles.vDivider} />
            {['All', '50+ Farmers', '100+ Farmers'].map((f) => {
              const filterKey = f.replace(' Farmers', '');
              const active = farmerFilter === filterKey;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFarmerFilter(filterKey)}
                  style={[styles.cropChip, active ? styles.chipActive : styles.chipInactive]}>
                  <Text style={[styles.cropChipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                    👥 {f}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* OpenStreetMap Layer & Map Canvas */}
        <View style={styles.mapCanvas}>
          {/* OpenStreetMap Tile Grid */}
          <View style={styles.osmTileContainer}>
            <View style={styles.osmRow}>
              <Image
                source={{ uri: OSM_MAP_TILES[0] }}
                style={styles.osmTile}
                resizeMode="cover"
              />
              <Image
                source={{ uri: OSM_MAP_TILES[1] }}
                style={styles.osmTile}
                resizeMode="cover"
              />
            </View>
            <View style={styles.osmRow}>
              <Image
                source={{ uri: OSM_MAP_TILES[2] }}
                style={styles.osmTile}
                resizeMode="cover"
              />
              <Image
                source={{ uri: OSM_MAP_TILES[3] }}
                style={styles.osmTile}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* OSM Attribution Watermark */}
          <View style={styles.osmAttribution}>
            <Text style={styles.osmAttributionText}>© OpenStreetMap contributors</Text>
          </View>

          {/* User Location Radar Pin (Center) */}
          <View style={styles.userLocationMarker}>
            <View style={styles.userPulseRing} />
            <View style={styles.userDot}>
              <Ionicons name="navigate" size={12} color="#FFFFFF" />
            </View>
            <View style={styles.userLabelCard}>
              <Text style={styles.userLabelText}>You are here</Text>
            </View>
          </View>

          {/* Dynamic Mandi Map Markers */}
          {filteredMandis.map((mandi, index) => {
            const isSelected = selectedMandi?.id === mandi.id;

            const pinOffsets: Array<{ top: `${number}%`; left: `${number}%` }> = [
              { top: '22%', left: '58%' },
              { top: '35%', left: '16%' },
              { top: '62%', left: '68%' },
              { top: '74%', left: '24%' },
              { top: '48%', left: '76%' },
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
                    size={12}
                    color={isSelected ? '#FFFFFF' : '#16A34A'}
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

        {/* Selected Mandi Bottom Card */}
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
                  <Ionicons name="leaf-outline" size={12} color="#15803D" />
                  <Text style={styles.tagText}>{selectedMandi.topCrop}</Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="people-outline" size={12} color="#D97706" />
                  <Text style={styles.tagText}>{selectedMandi.activeFarmersCount || 85} Farmers</Text>
                </View>
                <View style={styles.tagPill}>
                  <Ionicons name="time-outline" size={12} color="#4B5563" />
                  <Text style={styles.tagText}>{selectedMandi.estimatedQueueTime}</Text>
                </View>
              </View>

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
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  gpsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  filterStrip: {
    paddingVertical: 6,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 6,
    alignItems: 'center',
  },
  cropChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: '#16A34A',
  },
  chipInactive: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cropChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: ThemeColors.textSecondary,
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E4ECF4',
    position: 'relative',
    overflow: 'hidden',
  },
  osmTileContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },


  osmRow: {
    flex: 1,
    flexDirection: 'row',
  },
  osmTile: {
    flex: 1,
    height: '100%',
  },
  osmAttribution: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  osmAttributionText: {
    fontSize: 9,
    color: '#4B5563',
    fontWeight: '600',
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
    backgroundColor: 'rgba(22, 163, 74, 0.3)',
  },
  userDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userLabelCard: {
    position: 'absolute',
    top: 28,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  userLabelText: {
    fontSize: 9,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pinBadgeSelected: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
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
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#16A34A',
    marginTop: 2,
  },
  pinAnchorDotSelected: {
    backgroundColor: '#15803D',
  },
  bottomCardContainer: {
    padding: 14,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: 'transparent',
  },
  mandiDetailCard: {
    backgroundColor: ThemeColors.white,
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailName: {
    fontSize: 16,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
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
    gap: 6,
    marginBottom: 12,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
  bookPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  bookPassText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
