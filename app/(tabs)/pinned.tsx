import { useMemo, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import { useNotesContext } from '@/lib/notes-context';
import { Header } from '@/components/Header';
import { NotesList } from '@/components/NotesList';

export default function PinnedScreen() {
  const { notes, loading, togglePin, toggleFavourite, refresh } = useNotesContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const pinned = useMemo(() => {
    const filtered = notes.filter((n) => n.is_pinned);
    if (!query.trim()) return filtered;
    const q = query.toLowerCase();
    return filtered.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  return (
    <View style={styles.container}>
      <Header
        title="Pinned"
        subtitle={`${pinned.length} pinned note${pinned.length !== 1 ? 's' : ''}`}
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
            placeholder="Search pinned notes..."
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
        notes={pinned}
        loading={loading}
        onRefresh={refresh}
        onTogglePin={togglePin}
        onToggleFavourite={toggleFavourite}
        emptyTitle={query ? 'No matches found' : 'No Pinned Notes'}
        emptyMessage={query ? 'Try a different search term.' : 'Pin notes by tapping the pin icon to keep them at the top.'}
        emptyIcon={query ? 'search' : 'chevrons-up'}
      />
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
});
