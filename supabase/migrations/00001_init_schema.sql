-- ============================================================================
-- CALORITY DATABASE SCHEMA — Fresh Supabase Project
-- ============================================================================

-- ── MEALS TABLE ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meals (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text        NOT NULL,
  calories        integer     NOT NULL CHECK (calories >= 0),
  protein         integer     NOT NULL CHECK (protein >= 0),
  carbs           integer     NOT NULL CHECK (carbs >= 0),
  fat             integer     NOT NULL CHECK (fat >= 0),
  ingredients     text[]      DEFAULT '{}',
  image_data_url  text,
  saved_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS meals_user_saved_idx ON meals(user_id, saved_at DESC);

-- ── GOALS TABLE ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  user_id   uuid    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  calories  integer NOT NULL DEFAULT 2000,
  protein   integer NOT NULL DEFAULT 150,
  carbs     integer NOT NULL DEFAULT 250,
  fat       integer NOT NULL DEFAULT 65
);

-- ── KV STORE (edge function internal storage) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS kv_store_be9d8453 (
  key   text  PRIMARY KEY,
  value jsonb NOT NULL
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
ALTER TABLE meals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meals" ON meals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
