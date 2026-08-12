ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ui_language text NOT NULL DEFAULT 'fr',
  ADD COLUMN IF NOT EXISTS show_translation boolean NOT NULL DEFAULT true;