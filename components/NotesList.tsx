import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/lib/theme';
import { Note } from '@/lib/types';
import { NoteCard } from './NoteCard';

interface NotesListProps {
  notes: Note[];
  loading: boolean;
  onRefresh: () => void;
  onTogglePin: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  emptyTitle: string;
  emptyMessage: string;
  emptyIcon: string;
}

export function NotesList({
  notes,
  loading,
  onRefresh,
  onTogglePin,
  onToggleFavourite,
  emptyTitle,
  emptyMessage,
  emptyIcon,
}: NotesListProps) {
  const router = useRouter();

  const handlePress = (note: Note) => {
    router.push({ pathname: '/note-editor', params: { id: note.id } });
  };

  if (!loading && notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Feather name={emptyIcon as any} size={32} color={theme.darkGreenLight} />
        </View>
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NoteCard
          note={item}
          onPress={handlePress}
          onTogglePin={onTogglePin}
          onToggleFavourite={onToggleFavourite}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={theme.darkGreen} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.darkGreen,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    color: theme.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});
