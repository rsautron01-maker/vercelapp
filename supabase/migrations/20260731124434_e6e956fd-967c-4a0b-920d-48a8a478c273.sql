ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_done boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reads_arabic text NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS tajweed_level text NOT NULL DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS script_mode text NOT NULL DEFAULT 'arabic',
  ADD COLUMN IF NOT EXISTS show_tajweed boolean NOT NULL DEFAULT true;