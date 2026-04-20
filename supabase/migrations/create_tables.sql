-- Meals table
create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null,
  ingredients text[] default '{}',
  image_data_url text,
  saved_at timestamptz not null default now()
);

-- Goals table (one row per user)
create table if not exists goals (
  id text primary key default 'default',
  user_id uuid references auth.users(id) on delete cascade,
  calories integer not null default 2000,
  protein integer not null default 150,
  carbs integer not null default 250,
  fat integer not null default 65
);

-- RLS
alter table meals enable row level security;
alter table goals enable row level security;

-- Users can only access their own meals
create policy "Users can manage own meals" on meals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only access their own goals
create policy "Users can manage own goals" on goals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
