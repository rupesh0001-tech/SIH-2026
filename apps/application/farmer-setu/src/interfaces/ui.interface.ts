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

export interface PickerOption {
  label: string;
  value: string;
  sublabel?: string;
  badge?: string;
}

export interface SearchablePickerModalProps {
  visible: boolean;
  title: string;
  placeholder?: string;
  options: PickerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export interface CalendarPickerModalProps {
  visible: boolean;
  selectedDate: string;
  onSelectDate: (formattedDate: string) => void;
  onClose: () => void;
}
