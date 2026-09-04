import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export const SettingsSectionView = memo(function SettingsSectionView() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'mr' | 'hi' | 'en'>('en');

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your Farmer account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* Profile Header Card matching Reference Image 5 */}
      <View style={styles.profileHeroCard}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {(user?.name || 'Ramesh Kisan')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{user?.name || 'Ramesh Kisan'}</Text>
            <Text style={styles.farmerId}>Farmer ID: KMS-MH-2026-881</Text>
            <View style={styles.verifiedBadgeRow}>
              <View style={styles.verifiedPill}>
                <Ionicons name="checkmark-circle" size={13} color="#15803D" />
                <Text style={styles.verifiedText}>e-KYC Verified</Text>
              </View>
              <View style={styles.kisanCreditPill}>
                <Text style={styles.kisanCreditText}>KCC Active</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Navigation Cards */}
      <View style={styles.sectionGroup}>
        <Text style={styles.groupTitle}>Farm & Landholdings</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="leaf-outline" size={18} color={ThemeColors.mintDark} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Registered Land Parcel</Text>
              <Text style={styles.rowSubtitle}>6.5 Acres • Niphad Taluka, Nashik</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ThemeColors.textMuted} />
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="card-outline" size={18} color={ThemeColors.lavenderDark} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Direct MSP Bank Account</Text>
              <Text style={styles.rowSubtitle}>State Bank of India (•• 4892)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ThemeColors.textMuted} />
          </View>
        </View>
      </View>

      {/* App Preferences */}
      <View style={styles.sectionGroup}>
        <Text style={styles.groupTitle}>Preferences & Language</Text>

        <View style={styles.card}>
          <View style={styles.langRow}>
            <Text style={styles.rowTitle}>App Language</Text>
            <View style={styles.langPills}>
              <Pressable
                onPress={() => setSelectedLanguage('en')}
                style={[
                  styles.langBtn,
                  selectedLanguage === 'en' && styles.langBtnActive,
                ]}>
                <Text
                  style={[
                    styles.langBtnText,
                    selectedLanguage === 'en' && styles.langBtnTextActive,
                  ]}>
                  English
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSelectedLanguage('mr')}
                style={[
                  styles.langBtn,
                  selectedLanguage === 'mr' && styles.langBtnActive,
                ]}>
                <Text
                  style={[
                    styles.langBtnText,
                    selectedLanguage === 'mr' && styles.langBtnTextActive,
                  ]}>
                  मराठी
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSelectedLanguage('hi')}
                style={[
                  styles.langBtn,
                  selectedLanguage === 'hi' && styles.langBtnActive,
                ]}>
                <Text
                  style={[
                    styles.langBtnText,
                    selectedLanguage === 'hi' && styles.langBtnTextActive,
                  ]}>
                  हिन्दी
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.separator} />

          <Pressable
            onPress={() => {
              Alert.alert('APMC Kisan Helpline', 'Toll-free 24x7 Mandi Support: 1800-180-1551', [
                { text: 'Call Now' },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={18} color={ThemeColors.peachDark} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>APMC Kisan Helpline</Text>
              <Text style={styles.rowSubtitle}>1800-180-1551 (24x7 Toll-free)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ThemeColors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* Sign Out Button */}
      <View style={styles.logoutContainer}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 110,
  },
  profileHeroCard: {
    marginHorizontal: 20,
    marginTop: 6,
    backgroundColor: '#F4EFFF',
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E8DEFF',
    shadowColor: ThemeColors.lavender,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ThemeColors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: ThemeColors.white,
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.3,
  },
  farmerId: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  kisanCreditPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  kisanCreditText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  sectionGroup: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ThemeColors.textSecondary,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: ThemeColors.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  langPills: {
    flexDirection: 'row',
    gap: 6,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  langBtnActive: {
    backgroundColor: ThemeColors.darkNav,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.textSecondary,
  },
  langBtnTextActive: {
    color: ThemeColors.white,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
