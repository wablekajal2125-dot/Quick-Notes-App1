import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { theme } from '@/lib/theme';
import { Feather } from '@expo/vector-icons';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    setError(null);
    const result = mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Feather name="feather" size={32} color={theme.cream} />
          </View>
          <Text style={styles.appName}>My Notes</Text>
          <Text style={styles.tagline}>Your personal notes, secured in the cloud</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, mode === 'signin' && styles.tabActive]}
              onPress={() => {
                setMode('signin');
                setError(null);
              }}
            >
              <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'signup' && styles.tabActive]}
              onPress={() => {
                setMode('signup');
                setError(null);
              }}
            >
              <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
              autoCapitalize="none"
            />

            {error && (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={theme.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={busy}>
              {busy ? (
                <ActivityIndicator color={theme.cream} />
              ) : (
                <Text style={styles.submitText}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.hint}>
              {mode === 'signin'
                ? "Don't have an account? Tap Sign Up above."
                : 'Already have an account? Tap Sign In above.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.cream,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.darkGreen,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 15,
    color: theme.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.creamLight,
    borderRadius: 20,
    padding: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.creamDark,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.darkGreen,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textLight,
  },
  tabTextActive: {
    color: theme.cream,
  },
  form: {},
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.darkGreen,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: theme.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FBEEE9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
  },
  errorText: {
    color: theme.danger,
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    backgroundColor: theme.darkGreen,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: theme.shadowStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  submitText: {
    color: theme.cream,
    fontSize: 17,
    fontWeight: '700',
  },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 16,
  },
});
