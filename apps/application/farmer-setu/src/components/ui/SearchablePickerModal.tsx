import React, { memo, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import type { SearchablePickerModalProps, PickerOption } from '@/interfaces';

export const SearchablePickerModal = memo(function SearchablePickerModal({
  visible,
  title,
  placeholder = 'Search options...',
  options,
  selectedValue,
  onSelect,
  onClose,
}: SearchablePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  const handleSelectOption = (value: string) => {
    onSelect(value);
    setSearchQuery('');
    onClose();
  };

  const handleModalClose = () => {
    setSearchQuery('');
    onClose();
  };

  const renderItem = ({ item }: { item: PickerOption }) => {
    const isSelected = selectedValue === item.value;
    return (
      <Pressable
        onPress={() => handleSelectOption(item.value)}
        style={({ pressed }) => [
          styles.optionRow,
          isSelected && styles.optionRowSelected,
          pressed && styles.optionRowPressed,
        ]}>
        <View style={styles.optionTextCol}>
          <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
            {item.label}
          </Text>
          {item.sublabel ? (
            <Text style={styles.optionSublabel}>{item.sublabel}</Text>
          ) : null}
        </View>

        {item.badge ? (
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>{item.badge}</Text>
          </View>
        ) : null}

        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
          {isSelected ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleModalClose}>
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>Select one option to filter</Text>
            </View>
            <Pressable
              onPress={handleModalClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={ThemeColors.textPrimary} />
            </Pressable>
          </View>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color={ThemeColors.primary} />
            <TextInput
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
              style={styles.searchInput}
            />
            {searchQuery ? (
              <Pressable
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </Pressable>
            ) : null}
          </View>

          {/* Options List */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={28} color="#9CA3AF" />
                <Text style={styles.emptyText}>No results found for &ldquo;{searchQuery}&rdquo;</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    backgroundColor: ThemeColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    maxHeight: '80%',
    minHeight: 380,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  listContent: {
    paddingBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  optionRowSelected: {
    backgroundColor: '#F0FDF4',
  },
  optionRowPressed: {
    opacity: 0.8,
  },
  optionTextCol: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  optionLabelSelected: {
    color: ThemeColors.primaryDark,
  },
  optionSublabel: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 10,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textAlign: 'center',
  },
});
