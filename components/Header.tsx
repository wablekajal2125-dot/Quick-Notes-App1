import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearchPress: () => void;
  searchActive: boolean;
}

export function Header({ title, subtitle, onSearchPress, searchActive }: HeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const initial = user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, searchActive && styles.iconBtnActive]}
            onPress={onSearchPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="search" size={20} color={searchActive ? theme.cream : theme.darkGreen} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => {
              signOut();
            }}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.cream,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.darkGreen,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.textLight,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: theme.darkGreen,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.cream,
    fontSize: 16,
    fontWeight: '700',
  },
});
