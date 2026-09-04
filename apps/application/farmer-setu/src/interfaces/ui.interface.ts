import type { TextInputProps } from 'react-native';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  isPassword?: boolean;
}

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
}

export interface BackButtonProps {
  onPress?: () => void;
  transparent?: boolean;
  style?: any;
}
