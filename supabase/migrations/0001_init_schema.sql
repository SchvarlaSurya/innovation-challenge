-- =====================================================
-- SitaanKu — Database Schema Migration
-- Run this in Supabase SQL Editor (Database -> SQL Editor)
-- =====================================================

-- ===========================
-- 1. CLASSES
-- ===========================
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,           -- e.g. "X RPL 1"
  grade TEXT NOT NULL,                 -- e.g. "X", "XI", "XII"
  total_students INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================
-- 2. CLASS WARNINGS (one row per class)
-- ===========================
CREATE TABLE IF NOT EXISTS public.class_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL UNIQUE REFERENCES public.classes(id) ON DELETE CASCADE,
  offense_count INTEGER NOT NULL DEFAULT 0,
  total_unpaid_fine INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================
-- 3. CONFISCATED ITEMS
-- ===========================
CREATE TABLE IF NOT EXISTS public.confiscated_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,                          -- e.g. "Topi", "Dasi"
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  photo_url TEXT,                                    -- Supabase Storage path / URL
  confiscated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'warning' CHECK (status IN ('warning', 'fined', 'resolved')),
  fine_amount INTEGER NOT NULL DEFAULT 0,           -- Rp (no decimals)
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_confiscated_class_id ON public.confiscated_items(class_id);
CREATE INDEX IF NOT EXISTS idx_confiscated_status ON public.confiscated_items(status);

-- ===========================
-- 4. CLEANLINESS SCORES
-- ===========================
CREATE TABLE IF NOT EXISTS public.cleanliness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  period TEXT NOT NULL,                              -- e.g. "Minggu 1 - Juni 2026"
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  checklist_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- { sweeping: true, mopping: false, ... }
  scored_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scored_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_scores_class_id ON public.cleanliness_scores(class_id);
CREATE INDEX IF NOT EXISTS idx_scores_scored_at ON public.cleanliness_scores(scored_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confiscated_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleanliness_scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "public read classes" ON public.classes;
DROP POLICY IF EXISTS "public read warnings" ON public.class_warnings;
DROP POLICY IF EXISTS "public read confiscations" ON public.confiscated_items;
DROP POLICY IF EXISTS "public read scores" ON public.cleanliness_scores;

DROP POLICY IF EXISTS "admin write classes" ON public.classes;
DROP POLICY IF EXISTS "admin write warnings" ON public.class_warnings;
DROP POLICY IF EXISTS "admin write confiscations" ON public.confiscated_items;
DROP POLICY IF EXISTS "admin write scores" ON public.cleanliness_scores;

-- PUBLIC READ: anyone (anon + authenticated) can read
CREATE POLICY "public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "public read warnings" ON public.class_warnings FOR SELECT USING (true);
CREATE POLICY "public read confiscations" ON public.confiscated_items FOR SELECT USING (true);
CREATE POLICY "public read scores" ON public.cleanliness_scores FOR SELECT USING (true);

-- ADMIN WRITE: only authenticated users (OSIS admins) can insert/update/delete.
-- (Email whitelist can be added later by creating an admins table.)
CREATE POLICY "admin write classes" ON public.classes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin write warnings" ON public.class_warnings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin write confiscations" ON public.confiscated_items FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin write scores" ON public.cleanliness_scores FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- STORAGE: confiscated-item-photos bucket
-- Run separately in Supabase Dashboard if needed:
--
--   1. Create a public bucket called "confiscated-item-photos"
--   2. Allow authenticated users to upload (INSERT, UPDATE, DELETE)
--   3. Allow public read
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('confiscated-item-photos', 'confiscated-item-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public can view; only authenticated can upload
DROP POLICY IF EXISTS "public read photos" ON storage.objects;
DROP POLICY IF EXISTS "admin upload photos" ON storage.objects;
DROP POLICY IF EXISTS "admin update photos" ON storage.objects;
DROP POLICY IF EXISTS "admin delete photos" ON storage.objects;

CREATE POLICY "public read photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'confiscated-item-photos');

CREATE POLICY "admin upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'confiscated-item-photos' AND auth.role() = 'authenticated');

CREATE POLICY "admin update photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'confiscated-item-photos' AND auth.role() = 'authenticated');

CREATE POLICY "admin delete photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'confiscated-item-photos' AND auth.role() = 'authenticated');

-- =====================================================
-- SEED DATA: 10 sample classes
-- =====================================================
INSERT INTO public.classes (name, grade, total_students) VALUES
  ('X RPL 1', 'X', 36),
  ('X RPL 2', 'X', 35),
  ('X TKJ 1', 'X', 36),
  ('X TKJ 2', 'X', 35),
  ('XI RPL 1', 'XI', 34),
  ('XI RPL 2', 'XI', 33),
  ('XI TKJ 1', 'XI', 34),
  ('XI TKJ 2', 'XI', 33),
  ('XII RPL 1', 'XII', 32),
  ('XII TKJ 1', 'XII', 31)
ON CONFLICT (name) DO NOTHING;

-- Initialize class_warnings for all classes
INSERT INTO public.class_warnings (class_id, offense_count, total_unpaid_fine)
SELECT id, 0, 0 FROM public.classes
ON CONFLICT (class_id) DO NOTHING;

-- Sample confiscation data: X RPL 1 (warning), XI RPL 1 (fined)
DO $$
DECLARE
  x_rpl_1_id UUID;
  xi_rpl_1_id UUID;
BEGIN
  SELECT id INTO x_rpl_1_id FROM public.classes WHERE name = 'X RPL 1' LIMIT 1;
  SELECT id INTO xi_rpl_1_id FROM public.classes WHERE name = 'XI RPL 1' LIMIT 1;

  IF x_rpl_1_id IS NOT NULL THEN
    INSERT INTO public.confiscated_items (class_id, item_type, quantity, status, fine_amount, notes)
    VALUES
      (x_rpl_1_id, 'Topi', 2, 'warning', 0, 'Ditemukan di koridor lantai 2'),
      (x_rpl_1_id, 'Dasi', 1, 'warning', 0, 'Ditinggal di kelas');

    UPDATE public.class_warnings
    SET offense_count = 2, total_unpaid_fine = 0, last_updated = now()
    WHERE class_id = x_rpl_1_id;
  END IF;

  IF xi_rpl_1_id IS NOT NULL THEN
    INSERT INTO public.confiscated_items (class_id, item_type, quantity, status, fine_amount, notes)
    VALUES
      (xi_rpl_1_id, 'Sepatu', 3, 'fined', 15000, 'Bukan sepatu hitam sesuai aturan'),
      (xi_rpl_1_id, 'Kaos kaki', 2, 'fined', 10000, 'Warna tidak sesuai seragam');

    UPDATE public.class_warnings
    SET offense_count = 2, total_unpaid_fine = 25000, last_updated = now()
    WHERE class_id = xi_rpl_1_id;
  END IF;
END $$;

-- Sample cleanliness scores
DO $$
DECLARE
  c_id UUID;
BEGIN
  FOR c_id IN SELECT id FROM public.classes LIMIT 10 LOOP
    INSERT INTO public.cleanliness_scores (class_id, period, score, checklist_data)
    VALUES (
      c_id,
      'Minggu 1 - Juni 2026',
      (70 + floor(random() * 25))::int,
      jsonb_build_object(
        'menyapu', true,
        'mengepel', true,
        'membersihkan_papan_tulis', true,
        'membuang_sampah', true,
        'merapikan_meja_kursi', true
      )
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
