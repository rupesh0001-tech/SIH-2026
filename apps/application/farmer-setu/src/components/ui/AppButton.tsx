import React, { memo } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const AppButton = memo(function AppButton({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  children,
}: AppButtonProps) {
  const isActionDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isActionDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        isActionDisabled && styles.disabled,
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#16A34A' : '#FFFFFF'}
        />
      ) : children ? (
        children
      ) : (
        <Text
          style={[
            styles.baseText,
            styles[`${variant}Text`],
            isActionDisabled && styles.disabledText,
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    width: '100%',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
  primary: {
    backgroundColor: '#16A34A', // Emerald green
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  accent: {
    backgroundColor: '#15803D', // Deep forest green
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  secondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#16A34A',
  },
  baseText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  accentText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#1F2937',
  },
  outlineText: {
    color: '#16A34A',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

