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

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (phone.trim() && !/^\+?[1-9]\d{9,13}$/.test(phone.trim())) {
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
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() ? phone.trim() : undefined,
      password,
    });

    if (success) {
      router.replace('/(farmer)/dashboard');
    }
  }, [name, email, phone, password, confirmPassword, register, router, clearError]);

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
            <BackButton onPress={() => router.back()} />
          </View>

          {/* Heading */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Let's go! Register in seconds.</Text>
            <Text style={styles.subtitle}>
              Set up your Farmer profile to sell directly at APMC mandis.
            </Text>
          </View>

          {/* Social Pills */}
          <SocialAuthPills />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or Register with</Text>
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
              onChangeText={(text) => {
                setName(text);
                if (validationError) setValidationError(null);
              }}
            />

            <AppInput
              label="Mobile Phone Number"
              placeholder="e.g. 9876543210"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (validationError) setValidationError(null);
              }}
              keyboardType="phone-pad"
            />

            <AppInput
              label="Email Address"
              placeholder="e.g. ramesh@kisan.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (validationError) setValidationError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <AppInput
              label="Password"
              placeholder="Min 8 characters (letters & numbers)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (validationError) setValidationError(null);
              }}
              isPassword
            />

            <AppInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (validationError) setValidationError(null);
              }}
              isPassword
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
              <Pressable onPress={() => router.push('/(auth)/login')}>
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
    marginTop: 12,
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
    marginVertical: 16,
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
  registerButton: {
    backgroundColor: '#16A34A', // High contrast fresh emerald green
    marginTop: 10,
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
  loginLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
});
