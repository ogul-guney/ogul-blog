-- ==============================================================================
-- Supabase SQL Schema for Oğul Personal Micro-Blog
-- ==============================================================================
-- Run this SQL in your Supabase SQL Editor (takes ~5 seconds):

-- 1. Create posts table
create table if not exists public.posts (
  id text primary key,
  content text not null,
  category text not null default 'timeline',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  pinned boolean default false,
  tags text[] default '{}',
  author_name text default 'Oğul',
  user_id uuid references auth.users(id) on delete set null
);

-- 2. Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- 3. Allow public read access so everyone can read the blog entries
create policy "Allow public read access"
  on public.posts for select
  using (true);

-- 4. Allow insert, update, and delete
create policy "Allow authenticated or anon insert"
  on public.posts for insert
  with check (true);

create policy "Allow update for all"
  on public.posts for update
  using (true);

create policy "Allow delete for all"
  on public.posts for delete
  using (true);

-- 5. Enable Realtime cross-device synchronization
alter publication supabase_realtime add table public.posts;
