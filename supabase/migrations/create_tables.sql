-- Meals table
create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null,
  ingredients text[] default '{}',
  image_data_url text,
  saved_at timestamptz not null default now()
);

-- Goals table (single row per user, using a fixed id for anonymous use)
create table if not exists goals (
  id text primary key default 'default',
  calories integer not null default 2000,
  protein integer not null default 150,
  carbs integer not null default 250,
  fat integer not null default 65
);

-- Allow public access (no auth for now)
alter table meals enable row level security;
alter table goals enable row level security;

create policy "Allow all on meals" on meals for all using (true) with check (true);
create policy "Allow all on goals" on goals for all using (true) with check (true);
