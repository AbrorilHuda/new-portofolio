-- Create Thoughts Table
create table public.thoughts (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_public boolean default true,
  likes_count integer default 0,
  comments_count integer default 0
);

-- Create Likes Table
create table public.thought_likes (
  id uuid default gen_random_uuid() primary key,
  thought_id uuid references public.thoughts(id) on delete cascade not null,
  user_ip text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Comments Table
create table public.thought_comments (
  id uuid default gen_random_uuid() primary key,
  thought_id uuid references public.thoughts(id) on delete cascade not null,
  name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.thoughts enable row level security;
alter table public.thought_likes enable row level security;
alter table public.thought_comments enable row level security;

-- Policies for Thoughts (Public Read, Admin Write)
create policy "Public thoughts are viewable by everyone." on public.thoughts for select using (true);
create policy "Admin can insert thoughts." on public.thoughts for insert with check (true); -- Assuming you handle auth in app logic or add stricter RLS if user auth is set up
create policy "Admin can update thoughts." on public.thoughts for update using (true);
create policy "Admin can delete thoughts." on public.thoughts for delete using (true);

-- Policies for Likes (Public Insert, Public Read)
create policy "Likes are viewable by everyone." on public.thought_likes for select using (true);
create policy "Anyone can like a thought." on public.thought_likes for insert with check (true);

-- Policies for Comments (Public Insert, Public Read)
create policy "Comments are viewable by everyone." on public.thought_comments for select using (true);
create policy "Anyone can comment on a thought." on public.thought_comments for insert with check (true);

-- Function to increment likes count
create or replace function increment_likes(row_id uuid)
returns void as $$
begin
  update public.thoughts
  set likes_count = likes_count + 1
  where id = row_id;
end;
$$ language plpgsql;

-- Function to increment comments count
create or replace function increment_comments(row_id uuid)
returns void as $$
begin
  update public.thoughts
  set comments_count = comments_count + 1
  where id = row_id;
end;
$$ language plpgsql;
