import { useMemo, useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/lib/theme';
import { useNotesContext } from '@/lib/notes-context';
import { Header } from '@/components/Header';
import { NotesList } from '@/components/NotesList';

export default function AllNotesScreen() {
  const router = useRouter();
  const { notes, loading, togglePin, toggleFavourite, refresh } = useNotesContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.toLowerCase();
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  const pinnedCount = notes.filter((n) => n.is_pinned).length;
  const favCount = notes.filter((n) => n.is_favourite).length;

  return (
    <View style={styles.container}>
      <Header
        title="My Notes"
        subtitle={`${notes.length} notes · ${pinnedCount} pinned · ${favCount} favourites`}
        onSearchPress={() => setSearchOpen((s) => !s)}
        searchActive={searchOpen}
      />

      {searchOpen && (
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes..."
            placeholderTextColor={theme.textMuted}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <NotesList
        notes={filtered}
        loading={loading}
        onRefresh={refresh}
        onTogglePin={togglePin}
        onToggleFavourite={toggleFavourite}
        emptyTitle={query ? 'No matches found' : 'No Notes Yet'}
        emptyMessage={query ? 'Try a different search term.' : 'Tap the + button below to create your first note.'}
        emptyIcon={query ? 'search' : 'file-text'}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/note-editor')}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={26} color={theme.cream} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.cream,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.creamLight,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
});
