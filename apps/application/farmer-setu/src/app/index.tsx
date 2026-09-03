import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppButton } from '@/components/ui/AppButton';

const { width } = Dimensions.get('window');
// Calculate height so the 9:16 portrait image takes full width edge-to-edge
const HERO_HEIGHT = Math.min(width * 1.35, 520);

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
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
            <Text style={styles.badgeText}>🌾 Farmer Setu • किसान सेतु</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F1',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  heroContainer: {
    width: '100%',
    height: HERO_HEIGHT,
    backgroundColor: '#FB923C',
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
    backgroundColor: '#FED7AA',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#9A3412',
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
    backgroundColor: '#F97316',
    height: 52,
  },
  registerBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E7E5E4',
    height: 52,
  },
  footerNote: {
    fontSize: 12,
    color: '#A8A29E',
    marginTop: 16,
    fontWeight: '500',
  },
});
