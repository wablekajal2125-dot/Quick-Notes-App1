import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import { Note } from '@/lib/types';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  showPin?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function NoteCard({ note, onPress, onTogglePin, onToggleFavourite, showPin = true }: NoteCardProps) {
  const preview = note.content.trim() || 'No additional text';

  return (
    <TouchableOpacity
      style={[styles.card, note.is_pinned && styles.cardPinned]}
      onPress={() => onPress(note)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          {note.is_pinned && <Feather name="chevrons-up" size={14} color={theme.gold} />}
          <Text style={styles.title} numberOfLines={1}>
            {note.title || 'Untitled'}
          </Text>
        </View>
        <Text style={styles.preview} numberOfLines={2}>
          {preview}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(note.updated_at)}</Text>
          <View style={styles.actions}>
            {showPin && (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => onTogglePin(note.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather
                  name={note.is_pinned ? 'lock' : 'chevrons-up'}
                  size={16}
                  color={note.is_pinned ? theme.gold : theme.textMuted}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onToggleFavourite(note.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name="star"
                size={16}
                color={note.is_favourite ? theme.gold : theme.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {note.is_pinned && <View style={styles.pinAccent} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.creamLight,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.borderLight,
    overflow: 'hidden',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPinned: {
    borderColor: theme.goldLight,
    backgroundColor: '#FFFCF0',
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.darkGreen,
    flex: 1,
  },
  preview: {
    fontSize: 14,
    color: theme.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: theme.textMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  pinAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.gold,
  },
});
