import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import { useNotesContext } from '@/lib/notes-context';

export default function NoteEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { notes, createNote, updateNote, deleteNote, setPinned, setFavourite } = useNotesContext();

  const existingNote = params.id ? notes.find((n) => n.id === params.id) : null;
  const isNew = !params.id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!params.id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (existingNote && !loaded) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setIsPinned(existingNote.is_pinned);
      setIsFavourite(existingNote.is_favourite);
      setLoaded(true);
    }
  }, [existingNote, loaded]);

  const handleSave = useCallback(async () => {
    if (!title.trim() && !content.trim()) {
      router.back();
      return;
    }
    setSaving(true);
    if (isNew) {
      await createNote(title.trim() || 'Untitled', content.trim(), isPinned, isFavourite);
    } else if (existingNote) {
      await updateNote(existingNote.id, {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        is_pinned: isPinned,
        is_favourite: isFavourite,
      });
    }
    setSaving(false);
    router.back();
  }, [title, content, isNew, existingNote, isPinned, isFavourite, createNote, updateNote, router]);

  const handleConfirmDelete = useCallback(async () => {
    if (!existingNote) return;
    setShowDeleteModal(false);
    await deleteNote(existingNote.id);
    router.back();
  }, [existingNote, deleteNote, router]);

  const handleTogglePin = useCallback(() => {
    const newVal = !isPinned;
    setIsPinned(newVal);
    if (existingNote) {
      setPinned(existingNote.id, newVal);
    }
  }, [isPinned, existingNote, setPinned]);

  const handleToggleFavourite = useCallback(() => {
    const newVal = !isFavourite;
    setIsFavourite(newVal);
    if (existingNote) {
      setFavourite(existingNote.id, newVal);
    }
  }, [isFavourite, existingNote, setFavourite]);

  if (!loaded) {
    return <View style={styles.container} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color={theme.darkGreen} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleTogglePin}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          >
            <Feather
              name={isPinned ? 'lock' : 'chevrons-up'}
              size={20}
              color={isPinned ? theme.gold : theme.darkGreen}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleToggleFavourite}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          >
            <Feather
              name="star"
              size={20}
              color={isFavourite ? theme.gold : theme.darkGreen}
            />
          </TouchableOpacity>
          {!isNew && (
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setShowDeleteModal(true)}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            >
              <Feather name="trash-2" size={20} color={theme.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={theme.textMuted}
        />
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
          placeholderTextColor={theme.textMuted}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Feather name="check" size={18} color={theme.cream} />
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Note'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Feather name="trash-2" size={28} color={theme.danger} />
            </View>
            <Text style={styles.modalTitle}>Delete Note?</Text>
            <Text style={styles.modalMessage}>
              This note will be permanently removed from your account. This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDeleteBtn} onPress={handleConfirmDelete}>
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.cream,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  headerBtn: {
    padding: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    paddingBottom: 100,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.darkGreen,
    marginBottom: 16,
    padding: 0,
  },
  contentInput: {
    fontSize: 17,
    color: theme.text,
    lineHeight: 26,
    padding: 0,
    minHeight: 300,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.cream,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.darkGreen,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: theme.shadowStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  saveText: {
    color: theme.cream,
    fontSize: 17,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 58, 47, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: theme.creamLight,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: theme.shadowStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FBEEE9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.darkGreen,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: theme.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.creamDark,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.darkGreen,
  },
  modalDeleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.danger,
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.cream,
  },
});
