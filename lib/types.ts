export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_favourite: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

export type NoteSection = 'all' | 'pinned' | 'favourites';
