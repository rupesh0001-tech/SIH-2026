import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { AppButton } from '@/components/ui/AppButton';
import { BackButton } from '@/components/ui/BackButton';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email, phone } = useLocalSearchParams<{ email?: string; phone?: string }>();
  const { verifyOtp, sendOtp, isLoading, error, clearError } = useAuth();

  const [otpCode, setOtpCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(RESEND_COOLDOWN_SECONDS);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(null);

  const inputRef = useRef<TextInput>(null);
  const identifier = (email || phone || '').toLowerCase().trim();

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus input automatically on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleOtpChange = useCallback(
    (text: string) => {
      const clean = text.replace(/[^0-9]/g, '').slice(0, 6);
      setOtpCode(clean);
      if (validationError) setValidationError(null);
      if (resendSuccessMessage) setResendSuccessMessage(null);
      if (error) clearError();
    },
    [validationError, resendSuccessMessage, error, clearError]
  );

  const handleVerify = useCallback(async () => {
    setValidationError(null);
    clearError();

    if (!identifier) {
      setValidationError('User email or phone identifier missing. Please go back and register again.');
      return;
    }

    if (otpCode.length !== 6) {
      setValidationError('Please enter the full 6-digit verification code.');
      return;
    }

    const success = await verifyOtp({
      identifier,
      code: otpCode,
      type: 'EMAIL_VERIFICATION',
    });

    if (success) {
      router.replace('/(farmer)/dashboard');
    }
  }, [identifier, otpCode, verifyOtp, router, clearError]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    setValidationError(null);
    clearError();

    if (!identifier) {
      setValidationError('Cannot resend: user identifier missing.');
      return;
    }

    const success = await sendOtp({
      identifier,
      type: 'EMAIL_VERIFICATION',
    });

    if (success) {
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setResendSuccessMessage(`A new 6-digit verification code has been dispatched to ${identifier}.`);
    }
  }, [cooldown, identifier, sendOtp, clearError]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Top Bar */}
          <View style={styles.topBar}>
            <BackButton onPress={() => router.back()} />
          </View>

          {/* Heading */}
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>✉️</Text>
            </View>
            <Text style={styles.title}>Verify Your Account</Text>
            <Text style={styles.subtitle}>
              We have sent a 6-digit verification code to
            </Text>
            <Text style={styles.targetIdentifier}>{identifier || 'your email address'}</Text>
          </View>

          {/* Success Banner */}
          {resendSuccessMessage ? (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>{resendSuccessMessage}</Text>
            </View>
          ) : null}

          {/* Error Banner */}
          {error || validationError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error || validationError}</Text>
            </View>
          ) : null}

          {/* OTP Input Boxes */}
          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={styles.otpContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const digit = otpCode[index] || '';
              const isCurrent = otpCode.length === index;
              return (
                <View
                  key={index}
                  style={[
                    styles.otpBox,
                    isCurrent && styles.otpBoxFocused,
                    Boolean(digit) && styles.otpBoxFilled,
                    Boolean(error || validationError) && styles.otpBoxError,
                  ]}>
                  <Text style={styles.otpDigit}>{digit}</Text>
                </View>
              );
            })}
          </Pressable>

          {/* Hidden real TextInput */}
          <TextInput
            ref={inputRef}
            value={otpCode}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={6}
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            style={styles.hiddenInput}
            caretHidden
          />

          {/* CTA Button */}
          <AppButton
            title="Verify & Continue"
            onPress={handleVerify}
            isLoading={isLoading}
            variant="primary"
            style={styles.verifyButton}
          />

          {/* Resend Code Section */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendPrompt}>Didn't receive the code? </Text>
            {cooldown > 0 ? (
              <Text style={styles.cooldownText}>Resend in {cooldown}s</Text>
            ) : (
              <Pressable
                onPress={handleResend}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </Pressable>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  topBar: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  targetIdentifier: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EA580C',
    marginTop: 4,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFocused: {
    borderColor: '#EA580C',
    backgroundColor: '#FFFFFF',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  otpBoxFilled: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  otpBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  verifyButton: {
    height: 52,
    backgroundColor: '#F97316',
    borderRadius: 16,
    marginTop: 12,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  resendPrompt: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EA580C',
  },
  cooldownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  successBannerText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
