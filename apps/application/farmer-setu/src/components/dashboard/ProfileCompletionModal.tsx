import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { SearchablePickerModal } from '@/components/ui/SearchablePickerModal';
import { useAuth } from '@/context/AuthContext';
import { pickImageAndUpload, takePhotoAndUpload } from '@/services/upload.service';
import type { FarmerIdType, PickerOption } from '@/interfaces';

interface ProfileCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

const ID_TYPE_OPTIONS: PickerOption[] = [
  {
    label: 'Aadhaar Card',
    value: 'AADHAAR',
    sublabel: '12-digit Unique Identification Authority of India ID',
  },
  {
    label: 'PAN Card',
    value: 'PAN',
    sublabel: '10-character Income Tax Permanent Account Number',
  },
  {
    label: 'Driving License',
    value: 'DRIVING_LICENSE',
    sublabel: 'RTO Maharashtra / State Transport Driving License',
  },
];

export const ProfileCompletionModal = memo(function ProfileCompletionModal({
  visible,
  onClose,
  onSuccess,
  title = 'Complete Farmer KYC Profile',
  subtitle = 'Please provide your address, date of birth, and identity proof to unlock APMC mandi auction booking.',
}: ProfileCompletionModalProps) {
  const { farmerProfile, farmerCode, updateProfile, isLoading, token } = useAuth();

  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [idType, setIdType] = useState<FarmerIdType>('AADHAAR');
  const [idNumber, setIdNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [idPickerVisible, setIdPickerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Photo Picker & ImageKit Upload
  const handlePickAvatar = useCallback(async (source: 'gallery' | 'camera') => {
    if (!token) return;
    try {
      setIsUploadingImage(true);
      setErrorMessage(null);
      const res =
        source === 'camera'
          ? await takePhotoAndUpload(token, { folder: 'farmer_avatars' })
          : await pickImageAndUpload(token, { folder: 'farmer_avatars' });

      if (res && res.url) {
        setAvatarUrl(res.url);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload photo to ImageKit.');
    } finally {
      setIsUploadingImage(false);
    }
  }, [token]);

  // Prepopulate existing profile values when opened
  useEffect(() => {
    if (visible && farmerProfile) {
      setAddress(farmerProfile.address || farmerProfile.addressLine1 || '');
      setDob(farmerProfile.dob || '');
      if (farmerProfile.idType) {
        setIdType(farmerProfile.idType);
      }
      setIdNumber(farmerProfile.idNumber || '');
      setAvatarUrl(farmerProfile.avatarUrl || '');
      setErrorMessage(null);
    }
  }, [visible, farmerProfile]);

  const selectedIdTypeLabel =
    ID_TYPE_OPTIONS.find((opt) => opt.value === idType)?.label || 'Aadhaar Card';

  const handleSubmit = useCallback(async () => {
    setErrorMessage(null);

    const cleanAddress = address.trim();
    const cleanDob = dob.trim();
    const cleanIdNumber = idNumber.trim();

    if (!cleanAddress || cleanAddress.length < 5) {
      setErrorMessage('Please enter your complete farm / residential address (min 5 characters).');
      return;
    }

    if (!cleanDob || cleanDob.length < 4) {
      setErrorMessage('Please enter your Date of Birth (e.g. 1985-06-15 or DD/MM/YYYY).');
      return;
    }

    if (!cleanIdNumber || cleanIdNumber.length < 4) {
      setErrorMessage(`Please enter a valid ${selectedIdTypeLabel} number.`);
      return;
    }

    // ID Type specific validation
    if (idType === 'AADHAAR') {
      const digitsOnly = cleanIdNumber.replace(/\s+/g, '');
      if (digitsOnly.length !== 12 || !/^\d{12}$/.test(digitsOnly)) {
        setErrorMessage('Aadhaar number must contain exactly 12 digits (e.g. 2345 6789 0123).');
        return;
      }
    } else if (idType === 'PAN') {
      if (cleanIdNumber.length !== 10) {
        setErrorMessage('PAN Card must contain exactly 10 alphanumeric characters (e.g. ABCDE1234F).');
        return;
      }
    }

    const success = await updateProfile({
      address: cleanAddress,
      dob: cleanDob,
      idType,
      idNumber: cleanIdNumber,
      avatarUrl: avatarUrl.trim() || undefined,
    });

    if (success) {
      Alert.alert(
        'Profile Completed! 🎉',
        `Your farmer profile and KYC identity are now verified. Mandi gate booking is unlocked for ${farmerCode || 'your account'}.`,
        [
          {
            text: 'Continue to App',
            onPress: () => {
              onClose();
              if (onSuccess) onSuccess();
            },
          },
        ]
      );
    } else {
      setErrorMessage('Failed to save profile. Please check your internet connection and try again.');
    }
  }, [address, dob, idType, idNumber, avatarUrl, selectedIdTypeLabel, updateProfile, farmerCode, onClose, onSuccess]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}>
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.titleCol}>
                <View style={styles.badgeRow}>
                  <View style={styles.farmerIdBadge}>
                    <Text style={styles.farmerIdText}>{farmerCode || 'FAR001'}</Text>
                  </View>
                  <View style={styles.kycTag}>
                    <Text style={styles.kycTagText}>KYC Required</Text>
                  </View>
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>

              <Pressable
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>

            {/* Error Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#B91C1C" />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <ScrollView
              style={styles.formScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets={true}>
              
              {/* Address */}
              <AppInput
                label="Full Farm / Residential Address *"
                placeholder="e.g. Gat No. 42, Morwadi Road, Near DY Patil, Pimpri, Pune"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                autoCapitalize="words"
              />

              {/* DOB */}
              <AppInput
                label="Date of Birth (DOB) *"
                placeholder="e.g. 1988-04-22 (YYYY-MM-DD)"
                value={dob}
                onChangeText={setDob}
                keyboardType="numbers-and-punctuation"
              />

              {/* ID Type Selector */}
              <View style={styles.pickerField}>
                <Text style={styles.inputLabel}>Select Government ID Proof *</Text>
                <Pressable
                  onPress={() => setIdPickerVisible(true)}
                  style={styles.pickerTrigger}>
                  <View style={styles.pickerLeft}>
                    <Ionicons name="card-outline" size={18} color={ThemeColors.primary} />
                    <Text style={styles.pickerSelectedText}>{selectedIdTypeLabel}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color="#6B7280" />
                </Pressable>
              </View>

              {/* ID Number */}
              <AppInput
                label={`${selectedIdTypeLabel} Number *`}
                placeholder={
                  idType === 'AADHAAR'
                    ? 'e.g. 1234 5678 9012'
                    : idType === 'PAN'
                    ? 'e.g. ABCDE1234F'
                    : 'e.g. MH14 20210001234'
                }
                value={idNumber}
                onChangeText={setIdNumber}
                autoCapitalize="characters"
              />

              {/* Profile Photo / Avatar with ImageKit Upload */}
              <View style={styles.avatarSection}>
                <Text style={styles.inputLabel}>Profile Photo (Stored via ImageKit)</Text>
                <View style={styles.avatarRow}>
                  <View style={styles.avatarPreviewBox}>
                    {avatarUrl ? (
                      <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                    ) : (
                      <Ionicons name="person-circle-outline" size={54} color="#9CA3AF" />
                    )}
                    {isUploadingImage && (
                      <View style={styles.uploadingOverlay}>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      </View>
                    )}
                  </View>

                  <View style={styles.avatarActionCol}>
                    <View style={styles.uploadBtnRow}>
                      <Pressable
                        onPress={() => handlePickAvatar('gallery')}
                        disabled={isUploadingImage}
                        style={({ pressed }) => [
                          styles.photoActionBtn,
                          pressed && styles.pressed,
                          isUploadingImage && styles.btnDisabled,
                        ]}>
                        <Ionicons name="images-outline" size={16} color={ThemeColors.primary} />
                        <Text style={styles.photoActionBtnText}>Gallery</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handlePickAvatar('camera')}
                        disabled={isUploadingImage}
                        style={({ pressed }) => [
                          styles.photoActionBtn,
                          pressed && styles.pressed,
                          isUploadingImage && styles.btnDisabled,
                        ]}>
                        <Ionicons name="camera-outline" size={16} color={ThemeColors.primary} />
                        <Text style={styles.photoActionBtnText}>Camera</Text>
                      </Pressable>
                    </View>

                    {avatarUrl ? (
                      <Pressable
                        onPress={() => setAvatarUrl('')}
                        style={({ pressed }) => [styles.removePhotoBtn, pressed && styles.pressed]}>
                        <Ionicons name="trash-outline" size={13} color="#EF4444" />
                        <Text style={styles.removePhotoText}>Remove Photo</Text>
                      </Pressable>
                    ) : (
                      <Text style={styles.photoHintText}>JPG, PNG up to 10MB • Saved to /farmer_avatars</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.noticeBox}>
                <Ionicons name="shield-checkmark" size={18} color="#15803D" />
                <Text style={styles.noticeText}>
                  Your identity details and images are securely stored via ImageKit & encrypted for transparent APMC mandi gate passes.
                </Text>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalFooter}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}>
                <Text style={styles.cancelBtnText}>Later</Text>
              </Pressable>

              <AppButton
                title="Save & Complete KYC"
                onPress={handleSubmit}
                isLoading={isLoading}
                variant="primary"
                style={styles.submitBtn}
              />
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Searchable ID Type Dropdown */}
        <SearchablePickerModal
          visible={idPickerVisible}
          onClose={() => setIdPickerVisible(false)}
          title="Select Identity Proof"
          placeholder="Search ID proof types..."
          options={ID_TYPE_OPTIONS}
          selectedValue={idType}
          onSelect={(val) => {
            setIdType(val as FarmerIdType);
            setIdPickerVisible(false);
          }}
        />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    maxHeight: '92%',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleCol: {
    flex: 1,
    marginRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  farmerIdBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  farmerIdText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  kycTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  kycTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 10,
  },
  errorBannerText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
    flex: 1,
  },
  formScroll: {
    maxHeight: 380,
  },
  pickerField: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerSelectedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  avatarSection: {
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  avatarPreviewBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActionCol: {
    flex: 1,
    gap: 6,
  },
  uploadBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  photoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: ThemeColors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  photoActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ThemeColors.primary,
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  removePhotoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  photoHintText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginVertical: 8,
  },
  noticeText: {
    fontSize: 11,
    color: '#166534',
    flex: 1,
    lineHeight: 15,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    alignItems: 'center',
  },
  cancelBtn: {
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  submitBtn: {
    flex: 1,
    height: 48,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
