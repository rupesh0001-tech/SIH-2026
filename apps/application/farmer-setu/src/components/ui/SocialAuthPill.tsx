import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface SocialAuthPillsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onPhonePress?: () => void;
}

export const SocialAuthPills = memo(function SocialAuthPills({
  onGooglePress,
  onApplePress,
  onPhonePress,
}: SocialAuthPillsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onGooglePress}
        style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
        <Text style={[styles.iconText, { color: '#EA4335' }]}>G</Text>
      </Pressable>

      <Pressable
        onPress={onApplePress}
        style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
        <Text style={[styles.iconText, { color: '#000000' }]}></Text>
      </Pressable>

      <Pressable
        onPress={onPhonePress}
        style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
        <Text style={[styles.iconText, { color: '#16A34A', fontSize: 15 }]}>📞</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 12,
  },
  pill: {
    width: 64,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pressed: {
    backgroundColor: '#F3F4F6',
    transform: [{ scale: 0.96 }],
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
