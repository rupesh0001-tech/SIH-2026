import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ProfileCompletionModal } from './ProfileCompletionModal';

export const SettingsSectionView = memo(function SettingsSectionView() {
  const { user, farmerProfile, farmerCode, isProfileComplete, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logout_confirm'), [
      { text: t('general.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const idTypeLabel =
    farmerProfile?.idType === 'AADHAAR'
      ? 'Aadhaar Card'
      : farmerProfile?.idType === 'PAN'
      ? 'PAN Card'
      : farmerProfile?.idType === 'DRIVING_LICENSE'
      ? 'Driving License'
      : 'Govt ID Proof';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      
      {/* Profile Header Card */}
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
            <View style={styles.farmerIdRow}>
              <View style={styles.farmerIdBadge}>
                <Text style={styles.farmerIdText}>ID: {farmerCode || 'FAR001'}</Text>
              </View>
              <Text style={styles.userEmail}>{user?.email || 'farmer@setu.in'}</Text>
            </View>

            <View style={styles.verifiedBadgeRow}>
              {isProfileComplete ? (
                <View style={styles.verifiedPill}>
                  <Ionicons name="checkmark-circle" size={13} color="#15803D" />
                  <Text style={styles.verifiedText}>{t('kyc.verified')}</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => setProfileModalVisible(true)}
                  style={styles.pendingKycPill}>
                  <Ionicons name="warning" size={13} color="#B45309" />
                  <Text style={styles.pendingKycText}>{t('kyc.incomplete')}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* KYC Identity Details Card */}
      <View style={styles.sectionGroup}>
        <View style={styles.groupHeaderRow}>
          <Text style={styles.groupTitle}>{t('profile.kyc_title')}</Text>
          <Pressable
            onPress={() => setProfileModalVisible(true)}
            style={styles.editKycBtn}>
            <Ionicons name="pencil" size={14} color="#15803D" />
            <Text style={styles.editKycText}>{t('profile.edit_kyc')}</Text>
          </Pressable>
        </View>
        
        <View style={styles.card}>
          {/* Address */}
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={18} color={ThemeColors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t('profile.address')}</Text>
              <Text style={styles.rowSubtitle}>
                {farmerProfile?.address || farmerProfile?.addressLine1 || t('profile.not_provided')}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* DOB */}
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={18} color={ThemeColors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t('profile.dob')}</Text>
              <Text style={styles.rowSubtitle}>
                {farmerProfile?.dob || t('profile.not_provided')}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* ID Type & Number */}
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="card-outline" size={18} color={ThemeColors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{idTypeLabel}</Text>
              <Text style={styles.rowSubtitle}>
                {farmerProfile?.idNumber
                  ? `${farmerProfile.idNumber.slice(0, 4)} •••• ${farmerProfile.idNumber.slice(-4)}`
                  : t('profile.not_provided')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* App Preferences */}
      <View style={styles.sectionGroup}>
        <Text style={styles.groupTitle}>{t('profile.preferences')}</Text>

        <View style={styles.card}>
          <View style={styles.langRow}>
            <Text style={styles.rowTitle}>{t('profile.app_language')}</Text>
            <View style={styles.langPills}>
              <Pressable
                onPress={() => setLanguage('en')}
                style={[
                  styles.langBtn,
                  language === 'en' && styles.langBtnActive,
                ]}>
                <Text
                  style={[
                    styles.langBtnText,
                    language === 'en' && styles.langBtnTextActive,
                  ]}>
                  English
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setLanguage('mr')}
                style={[
                  styles.langBtn,
                  language === 'mr' && styles.langBtnActive,
                ]}>
                <Text
                  style={[
                    styles.langBtnText,
                    language === 'mr' && styles.langBtnTextActive,
                  ]}>
                  मराठी
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setLanguage('hi')}
                style={[
                  styles.langBtn,
                  language === 'hi' && styles.langBtnActive,
                ]}>
                <Text
                  style={[
                    styles.langBtnText,
                    language === 'hi' && styles.langBtnTextActive,
                  ]}>
                  हिंदी
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Help & Support */}
      <View style={styles.sectionGroup}>
        <Text style={styles.groupTitle}>{t('profile.helpline')}</Text>

        <View style={styles.card}>
          <Pressable
            onPress={() => {
              Alert.alert(t('profile.helpline'), 'Toll-free 24x7 Mandi Support: 1800-180-1551', [
                { text: 'Call Helpline' },
                { text: t('general.cancel'), style: 'cancel' },
              ]);
            }}
            style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={18} color={ThemeColors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t('profile.helpline')}</Text>
              <Text style={styles.rowSubtitle}>{t('profile.helpline_sub')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ThemeColors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </Pressable>
      </View>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: '#15803D',
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: ThemeColors.textPrimary,
    letterSpacing: -0.3,
  },
  farmerIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  farmerIdBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  farmerIdText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  userEmail: {
    fontSize: 11,
    color: '#6B7280',
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  pendingKycPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingKycText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  sectionGroup: {
    marginBottom: 16,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  editKycBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  editKycText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ThemeColors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  langRow: {
    paddingVertical: 12,
    gap: 10,
  },
  langPills: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBtnActive: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.textSecondary,
  },
  langBtnTextActive: {
    color: '#15803D',
    fontWeight: '800',
  },
  logoutSection: {
    marginTop: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    height: 48,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
