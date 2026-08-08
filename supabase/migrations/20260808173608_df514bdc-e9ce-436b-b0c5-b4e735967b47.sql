CREATE TABLE public.method_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  surah integer,
  ayah_from integer,
  ayah_to integer,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  step integer NOT NULL DEFAULT 1,
  last_step_date date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.method_plans TO authenticated;
GRANT ALL ON public.method_plans TO service_role;
ALTER TABLE public.method_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own method plans" ON public.method_plans FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);