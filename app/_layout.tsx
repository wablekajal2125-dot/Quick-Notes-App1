import { useEffect } from 'react';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { NotesProvider } from '@/lib/notes-context';
import { theme } from '@/lib/theme';

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const navState = useRootNavigationState();

  useEffect(() => {
    if (!navState?.key || loading) return;
    if (session) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth');
    }
  }, [session, loading, navState?.key]);

  if (loading || !navState?.key) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.darkGreen} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="note-editor" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <NotesProvider>
        <RootLayoutNav />
      </NotesProvider>
      <StatusBar style="dark" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.cream,
  },
});
