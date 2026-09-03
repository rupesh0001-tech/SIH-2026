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

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLogin = useCallback(async () => {
    setValidationError(null);
    clearError();

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setValidationError('Please enter your phone number or email.');
      return;
    }

    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    const success = await login({
      identifier: cleanIdentifier,
      password,
    });

    if (success) {
      // Navigate to farmer dashboard upon successful login
      router.replace('/(farmer)/dashboard');
    }
  }, [identifier, password, login, router, clearError]);

  const handleIdentifierChange = useCallback(
    (text: string) => {
      setIdentifier(text);
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

  const handleSocialPress = useCallback((provider: string) => {
    Alert.alert(
      `${provider} Sign-In`,
      `Please use your registered Farmer mobile number or email to log in directly.`,
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
            <BackButton onPress={() => router.replace('/')} />
          </View>

          {/* Heading */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Hey, welcome back!</Text>
            <Text style={styles.subtitle}>
              Good to see you again. Log in to your Farmer account.
            </Text>
          </View>

          {/* Social Auth Pills */}
          <SocialAuthPills
            onGooglePress={() => handleSocialPress('Google')}
            onApplePress={() => handleSocialPress('Apple')}
            onPhonePress={() => handleSocialPress('Phone')}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or Login with credentials</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Error Banner */}
          {error || validationError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error || validationError}</Text>
            </View>
          ) : null}

          {/* Form Inputs */}
          <View style={styles.formSection}>
            <AppInput
              label="Email or Mobile Phone Number"
              placeholder="e.g. 7028083300 or farmer@example.com"
              value={identifier}
              onChangeText={handleIdentifierChange}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="username"
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={handlePasswordChange}
              isPassword
              autoComplete="current-password"
            />

            {/* Remember me & Forgot Password */}
            <View style={styles.optionsRow}>
              <Pressable
                onPress={() => setRememberMe((prev) => !prev)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.checkboxRow}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.checkboxLabel}>Remember me</Text>
              </Pressable>

              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => {
                  Alert.alert(
                    'Forgot Password',
                    'Please contact your APMC mandi helpdesk or reset via web portal.',
                    [{ text: 'OK' }]
                  );
                }}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            {/* CTA Button */}
            <AppButton
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              variant="primary"
              style={styles.loginButton}
            />

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Pressable
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.signUpText}>Sign Up</Text>
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
    paddingBottom: 36,
  },
  topBar: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSection: {
    marginBottom: 16,
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#F97316',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F97316',
  },
});
