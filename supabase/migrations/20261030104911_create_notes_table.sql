/*
# Create notes table (multi-user, owner-scoped)

1. New Tables
- `notes`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to the authenticated user via auth.uid())
  - `title` (text, not null) — the note title
  - `content` (text, not null, defaults to empty string) — the note body
  - `is_pinned` (boolean, default false) — whether the note is pinned to the top
  - `is_favourite` (boolean, default false) — whether the note is marked as a favourite
  - `color` (text, default 'default') — optional color tag for the note
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now()) — tracks last modification time

2. Security
- Enable RLS on `notes`.
- Grant CRUD (SELECT, INSERT, UPDATE, DELETE) to `authenticated` only — the app requires sign-in.
- Owner-scoped CRUD: each authenticated user can only access rows they own (auth.uid() = user_id).
- The user_id column defaults to auth.uid() so inserts that omit user_id still satisfy the INSERT policy.

3. Indexes
- Index on user_id for fast per-user queries.
- Index on is_pinned for sorting pinned notes first.
- Index on updated_at for sorting by most recently modified.
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_pinned boolean NOT NULL DEFAULT false,
  is_favourite boolean NOT NULL DEFAULT false,
  color text NOT NULL DEFAULT 'default',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON notes TO authenticated;

DROP POLICY IF EXISTS "select_own_notes" ON notes;
CREATE POLICY "select_own_notes"
  ON notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notes" ON notes;
CREATE POLICY "insert_own_notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notes" ON notes;
CREATE POLICY "update_own_notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notes" ON notes;
CREATE POLICY "delete_own_notes"
  ON notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
