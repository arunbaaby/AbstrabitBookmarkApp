-- Create the bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  url text not null,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table bookmarks enable row level security;

-- Create a policy that allows users to view only their own bookmarks
create policy "Users can see their own bookmarks"
on bookmarks for select
using ( auth.uid() = user_id );

-- Create a policy that allows users to insert their own bookmarks
create policy "Users can insert their own bookmarks"
on bookmarks for insert
with check ( auth.uid() = user_id );

-- Create a policy that allows users to delete their own bookmarks
create policy "Users can delete their own bookmarks"
on bookmarks for delete
using ( auth.uid() = user_id );

-- Make sure to enable Realtime for this table in the Supabase Dashboard!
-- 1. Go to "Database" -> "Replication"
-- 2. Toggle "Source" for the "bookmarks" table.
