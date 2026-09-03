import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
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

    if (!identifier.trim()) {
      setValidationError('Please enter your phone number or email.');
      return;
    }

    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    const success = await login({
      identifier: identifier.trim(),
      password,
    });

    if (success) {
      // Navigate to farmer dashboard upon successful login
      router.replace('/(farmer)/dashboard');
    }
  }, [identifier, password, login, router, clearError]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Top Bar */}
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
          <SocialAuthPills />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or Login with</Text>
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
              label="Email or Phone Number"
              placeholder="e.g. 9876543210 or kisan@example.com"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (validationError) setValidationError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (validationError) setValidationError(null);
              }}
              isPassword
            />

            {/* Remember me & Forgot Password */}
            <View style={styles.optionsRow}>
              <Pressable
                onPress={() => setRememberMe((prev) => !prev)}
                style={styles.checkboxRow}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.checkboxLabel}>Remember me</Text>
              </Pressable>

              <Pressable onPress={() => {}}>
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
              <Pressable onPress={() => router.push('/(auth)/register')}>
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
    marginTop: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingHorizontal: 12,
    fontWeight: '500',
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
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
  },
  formSection: {
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
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
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
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
