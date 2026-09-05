import React, { memo, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from 'react-native';
import type { AppInputProps } from '@/interfaces';

export const AppInput = memo(
  forwardRef<TextInput, AppInputProps>(function AppInput(
    {
      label,
      error,
      isPassword = false,
      style,
      autoCapitalize = 'none',
      autoCorrect = false,
      editable = true,
      onFocus,
      onBlur,
      ...restProps
    },
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const internalInputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => internalInputRef.current as TextInput);

    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<any>) => {
        setIsFocused(true);
        if (onFocus) {
          onFocus(e);
        }
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<any>) => {
        setIsFocused(false);
        if (onBlur) {
          onBlur(e);
        }
      },
      [onBlur]
    );

    const handleWrapperPress = useCallback(() => {
      if (editable) {
        internalInputRef.current?.focus();
      }
    }, [editable]);

    const isSecure = isPassword ? !showPassword : restProps.secureTextEntry;

    return (
      <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Pressable
          onPress={handleWrapperPress}
          accessible={false}
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            Boolean(error) && styles.inputWrapperError,
            !editable && styles.inputWrapperDisabled,
          ]}>
          <TextInput
            ref={internalInputRef}
            placeholderTextColor="#9CA3AF"
            selectionColor="#16A34A"
            cursorColor="#16A34A"
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            spellCheck={false}
            editable={editable}
            secureTextEntry={isSecure}
            {...restProps}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[styles.input, style]}
          />
          {isPassword ? (
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.eyeButton}>
              <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          ) : null}
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  })
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    minHeight: 52,
  },
  inputWrapperFocused: {
    borderColor: '#16A34A',
    backgroundColor: '#FFFFFF',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputWrapperDisabled: {
    opacity: 0.6,
    backgroundColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    includeFontPadding: false,
  },
  eyeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  eyeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 6,
    fontWeight: '500',
  },
});
