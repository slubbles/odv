-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects Table
create table public.projects (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  title text not null,
  tagline text not null,
  description text not null,
  category text not null,
  goal numeric not null,
  raised numeric not null default 0,
  backers_count integer not null default 0,
  video_url text,
  image_url text,
  creator_wallet text not null,
  status text not null default 'draft', -- 'draft', 'queue', 'active', 'completed'
  deadline timestamp with time zone,
  
  -- Social Links
  twitter_link text,
  github_link text,
  website_link text,

  -- Creator Profile (Denormalized for simplicity)
  creator_name text,
  creator_avatar text,
  creator_bio text,

  constraint projects_pkey primary key (id)
);

-- Milestones Table
create table public.milestones (
  id uuid not null default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  percentage numeric not null,
  amount numeric not null,
  deadline timestamp with time zone not null,
  status text not null default 'locked', -- 'locked', 'active', 'in_review', 'completed', 'disputed'
  
  constraint milestones_pkey primary key (id)
);

-- Backers Table
create table public.backers (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  wallet_address text not null,
  amount numeric not null,
  transaction_signature text not null,

  constraint backers_pkey primary key (id)
);

-- Row Level Security (RLS)

-- Projects: Everyone can read. Only creator can update.
  on public.milestones for select
  using ( true );

create policy "Creators can insert milestones"
  on public.milestones for insert
  with check ( true );

-- Backers: Everyone can read (transparency).
alter table public.backers enable row level security;

create policy "Backers are viewable by everyone"
  on public.backers for select
  using ( true );

create policy "Users can back projects"
  on public.backers for insert
  with check ( true );
