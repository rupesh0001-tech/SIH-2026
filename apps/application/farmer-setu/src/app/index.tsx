import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { AppButton } from '@/components/ui/AppButton';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = Math.min(width * 1.35, 520);

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, token, isInitializing } = useAuth();

  // If user is already authenticated, automatically navigate to dashboard
  useEffect(() => {
    if (!isInitializing && user && token) {
      router.replace('/(farmer)/dashboard');
    }
  }, [user, token, isInitializing, router]);

  // While restoring session from storage, show a clean splash loader
  if (isInitializing || (user && token)) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('@/assets/images/farmer-mascot.jpg')}
          style={styles.splashImage}
          resizeMode="cover"
        />
        <View style={styles.splashContent}>
          <Text style={styles.splashBrand}>🌾 Mandi Setu</Text>
          <Text style={styles.splashSubtitle}>Loading your farmer dashboard...</Text>
          <ActivityIndicator size="small" color="#8B5CF6" style={styles.splashSpinner} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        
        {/* Full-width Top Hero Container extending height as per design */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/farmer-mascot.jpg')}
            style={styles.mascotImage}
            resizeMode="cover"
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>🌾 Mandi Setu • किसान सेतु</Text>
          </View>

          <Text style={styles.title}>
            Direct Mandi Access for Every Farmer.
          </Text>

          <Text style={styles.subtitle}>
            Eliminate middlemen. Check real-time APMC mandi prices, book digital entry passes, and trade transparently.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <AppButton
              title="Log In as Farmer"
              onPress={() => router.push('/(auth)/login')}
              variant="primary"
              style={styles.loginBtn}
            />

            <AppButton
              title="Register as Farmer"
              onPress={() => router.push('/(auth)/register')}
              variant="secondary"
              style={styles.registerBtn}
            />
          </View>

          {/* Guarantee / Footer */}
          <Text style={styles.footerNote}>
            Dedicated to Indian Farmers • सुरक्षित एवं पारदर्शी
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
  },
  splashContent: {
    alignItems: 'center',
  },
  splashBrand: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  splashSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  splashSpinner: {
    marginTop: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  heroContainer: {
    width: '100%',
    height: HERO_HEIGHT,
    backgroundColor: '#8B5CF6',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1917',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  loginBtn: {
    backgroundColor: '#8B5CF6',
    height: 52,
  },
  registerBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    height: 52,
  },
  footerNote: {
    fontSize: 12,
    color: '#A8A29E',
    marginTop: 16,
    fontWeight: '500',
  },
});
