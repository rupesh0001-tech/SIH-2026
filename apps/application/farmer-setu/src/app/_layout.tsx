import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#FFFFFF' },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />
            <Stack.Screen name="(auth)/verify-otp" />
            <Stack.Screen
              name="(farmer)/dashboard"
              options={{
                gestureEnabled: false,
              }}
            />
          </Stack>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
