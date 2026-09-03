import React, { memo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface BackButtonProps {
  onPress?: () => void;
}

export const BackButton = memo(function BackButton({ onPress }: BackButtonProps) {
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
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Go back">
      <Text style={styles.arrow}>‹</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: '#E5E7EB',
    transform: [{ scale: 0.96 }],
  },
  arrow: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
    color: '#1F2937',
    marginTop: -2,
  },
});
