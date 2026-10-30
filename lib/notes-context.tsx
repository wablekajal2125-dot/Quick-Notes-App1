import { createContext, useContext, ReactNode } from 'react';
import { useNotes as useNotesInternal } from './use-notes';
import { Note } from './types';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  createNote: (title: string, content: string, isPinned?: boolean, isFavourite?: boolean) => Promise<Note | null>;
  updateNote: (
    id: string,
    updates: Partial<Pick<Note, 'title' | 'content' | 'is_pinned' | 'is_favourite' | 'color'>>
  ) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  togglePin: (id: string) => void;
  toggleFavourite: (id: string) => void;
  setPinned: (id: string, isPinned: boolean) => void;
  setFavourite: (id: string, isFavourite: boolean) => void;
  refresh: () => void;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  loading: true,
  error: null,
  createNote: async () => null,
  updateNote: async () => false,
  deleteNote: async () => false,
  togglePin: () => {},
  toggleFavourite: () => {},
  setPinned: () => {},
  setFavourite: () => {},
  refresh: () => {},
});

export function NotesProvider({ children }: { children: ReactNode }) {
  const value = useNotesInternal();
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotesContext() {
  return useContext(NotesContext);
}
