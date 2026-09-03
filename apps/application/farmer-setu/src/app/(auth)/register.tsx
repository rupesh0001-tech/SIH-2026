import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { BackButton } from '@/components/ui/BackButton';
import { SocialAuthPills } from '@/components/ui/SocialAuthPill';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRegister = useCallback(async () => {
    setValidationError(null);
    clearError();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || cleanName.length < 2) {
      setValidationError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setValidationError('Please provide a valid email address.');
      return;
    }
    if (cleanPhone && cleanPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setValidationError('Password must contain at least one letter and one number.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const success = await register({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || undefined,
      password,
    });

    if (success) {
      router.push({
        pathname: '/(auth)/verify-otp',
        params: {
          email: cleanEmail,
          phone: cleanPhone || '',
        },
      });
    }
  }, [name, email, phone, password, confirmPassword, register, router, clearError]);

  const handleNameChange = useCallback(
    (text: string) => {
      setName(text);
      if (validationError) setValidationError(null);
      if (error) clearError();
    },
    [validationError, error, clearError]
  );

  const handlePhoneChange = useCallback(
    (text: string) => {
      setPhone(text);
      if (validationError) setValidationError(null);
      if (error) clearError();
    },
    [validationError, error, clearError]
  );

  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      if (validationError) setValidationError(null);
      if (error) clearError();
    },
    [validationError, error, clearError]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      if (validationError) setValidationError(null);
      if (error) clearError();
    },
    [validationError, error, clearError]
  );

  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      if (validationError) setValidationError(null);
      if (error) clearError();
    },
    [validationError, error, clearError]
  );

  const handleSocialPress = useCallback((provider: string) => {
    Alert.alert(
      `${provider} Registration`,
      `Please fill in the quick details below to create your verified Farmer profile.`,
      [{ text: 'OK' }]
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Top Bar with Safe Inset */}
          <View style={styles.topBar}>
            <BackButton onPress={() => router.back()} />
          </View>

          {/* Heading */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Let's go! Register in seconds.</Text>
            <Text style={styles.subtitle}>
              Create your Farmer profile to access transparent APMC mandi auctions.
            </Text>
          </View>

          {/* Social Pills */}
          <SocialAuthPills
            onGooglePress={() => handleSocialPress('Google')}
            onApplePress={() => handleSocialPress('Apple')}
            onPhonePress={() => handleSocialPress('Phone')}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or Register with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Error Banner */}
          {error || validationError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error || validationError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.formSection}>
            <AppInput
              label="Farmer Full Name"
              placeholder="e.g. Ramesh Kisan"
              value={name}
              onChangeText={handleNameChange}
              autoCapitalize="words"
              autoComplete="name"
            />

            <AppInput
              label="Mobile Phone Number"
              placeholder="e.g. 9876543210"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              autoComplete="tel"
            />

            <AppInput
              label="Email Address"
              placeholder="e.g. ramesh@kisan.com"
              value={email}
              onChangeText={handleEmailChange}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <AppInput
              label="Password"
              placeholder="Min 8 chars (at least 1 letter & 1 number)"
              value={password}
              onChangeText={handlePasswordChange}
              isPassword
              autoComplete="new-password"
            />

            <AppInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              isPassword
              autoComplete="new-password"
            />

            {/* CTA */}
            <AppButton
              title="Register as Farmer"
              onPress={handleRegister}
              isLoading={isLoading}
              variant="primary"
              style={styles.registerButton}
            />

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLinkText}>Log in</Text>
              </Pressable>
            </View>
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
    paddingBottom: 40,
  },
  topBar: {
    marginTop: 8,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSection: {
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  formSection: {
    marginTop: 2,
  },
  registerButton: {
    backgroundColor: '#16A34A',
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
});
