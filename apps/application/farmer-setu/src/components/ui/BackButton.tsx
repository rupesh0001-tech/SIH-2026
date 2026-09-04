import React, { memo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { BackButtonProps } from '@/interfaces';

export const BackButton = memo(function BackButton({
  onPress,
  transparent = true,
  style,
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [
        styles.button,
        transparent ? styles.buttonTransparent : styles.buttonDefault,
        pressed && (transparent ? styles.pressedTransparent : styles.pressed),
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Go back">
      <Text style={styles.arrow}>‹</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTransparent: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  buttonDefault: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pressed: {
    backgroundColor: '#E5E7EB',
    transform: [{ scale: 0.94 }],
  },
  pressedTransparent: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    transform: [{ scale: 0.94 }],
  },
  arrow: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '400',
    color: '#1F2937',
    marginTop: -2,
  },
});
