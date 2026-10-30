import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Note } from './types';
import { useAuth } from './auth-context';

function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

export function useNotes() {
  const { session } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!session) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setNotes(sortNotes((data as Note[]) ?? []));
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes, session?.user?.id]);

  const createNote = useCallback(
    async (title: string, content: string, isPinned = false, isFavourite = false): Promise<Note | null> => {
      const { data, error: err } = await supabase
        .from('notes')
        .insert({ title, content, is_pinned: isPinned, is_favourite: isFavourite })
        .select()
        .single();

      if (err) {
        setError(err.message);
        return null;
      }
      const newNote = data as Note;
      setNotes((prev) => sortNotes([newNote, ...prev]));
      return newNote;
    },
    []
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'is_pinned' | 'is_favourite' | 'color'>>): Promise<boolean> => {
      const { error: err } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (err) {
        setError(err.message);
        return false;
      }
      setNotes((prev) =>
        sortNotes(
          prev.map((n) => (n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n))
        )
      );
      return true;
    },
    []
  );

  const deleteNote = useCallback(
    async (id: string): Promise<boolean> => {
      const { error: err } = await supabase.from('notes').delete().eq('id', id);
      if (err) {
        setError(err.message);
        return false;
      }
      setNotes((prev) => prev.filter((n) => n.id !== id));
      return true;
    },
    []
  );

  const setPinned = useCallback(
    (id: string, isPinned: boolean) => {
      updateNote(id, { is_pinned: isPinned });
    },
    [updateNote]
  );

  const setFavourite = useCallback(
    (id: string, isFavourite: boolean) => {
      updateNote(id, { is_favourite: isFavourite });
    },
    [updateNote]
  );

  const togglePin = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const note = prev.find((n) => n.id === id);
        if (note) {
          const newVal = !note.is_pinned;
          updateNote(id, { is_pinned: newVal });
          return sortNotes(
            prev.map((n) => (n.id === id ? { ...n, is_pinned: newVal } : n))
          );
        }
        return prev;
      });
    },
    [updateNote]
  );

  const toggleFavourite = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const note = prev.find((n) => n.id === id);
        if (note) {
          const newVal = !note.is_favourite;
          updateNote(id, { is_favourite: newVal });
          return prev.map((n) => (n.id === id ? { ...n, is_favourite: newVal } : n));
        }
        return prev;
      });
    },
    [updateNote]
  );

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavourite,
    setPinned,
    setFavourite,
    refresh: fetchNotes,
  };
}
