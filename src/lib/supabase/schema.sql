-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table (Core User Profiles)
create table public.users (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  wallet_address text not null unique,
  display_name text,
  bio text,
  avatar_url text,
  role text not null default 'backer', -- 'backer', 'creator', 'admin'
  status text not null default 'active', -- 'active', 'banned', 'suspended'
  
  -- Social Links
  twitter_handle text,
  github_handle text,
  website_url text,
  discord_handle text,
  
  -- Onboarding
  onboarding_completed boolean not null default false,
  onboarding_type text, -- 'creator', 'backer'
  interests text[], -- Categories user is interested in
  
  -- Settings
  email text,
  email_verified boolean default false,
  notification_preferences jsonb default '{"email": true, "push": true, "milestone": true, "updates": true}'::jsonb,
  privacy_settings jsonb default '{"profile_public": true, "show_backed": true}'::jsonb,
  
  -- Stats (Cached)
  projects_created_count integer default 0,
  projects_backed_count integer default 0,
  total_raised numeric default 0,
  total_backed numeric default 0,
  followers_count integer default 0,
  following_count integer default 0,
  
  constraint users_pkey primary key (id)
);

create index idx_users_wallet on public.users(wallet_address);
create index idx_users_role on public.users(role);

-- Projects Table
create table public.projects (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
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
  status text not null default 'draft', -- 'draft', 'queue', 'active', 'completed', 'failed', 'withdrawn', 'rejected'
  deadline timestamp with time zone,
  launch_date timestamp with time zone,
  
  -- Social Links
  twitter_link text,
  github_link text,
  website_link text,

  -- Creator Profile (Denormalized for simplicity)
  creator_name text,
  creator_avatar text,
  creator_bio text,
  
  -- Analytics
  views_count integer default 0,
  conversion_rate numeric default 0,
  
  -- Moderation
  flagged boolean default false,
  rejection_reason text,
  admin_notes text,

  constraint projects_pkey primary key (id)
);

create index idx_projects_creator on public.projects(creator_wallet);
create index idx_projects_status on public.projects(status);
create index idx_projects_category on public.projects(category);

-- Milestones Table
create table public.milestones (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  percentage numeric not null,
  amount numeric not null,
  deadline timestamp with time zone not null,
  status text not null default 'locked', -- 'locked', 'active', 'in_review', 'completed', 'disputed', 'rejected'
  
  -- Proof of Work
  proof_url text,
  proof_description text,
  submitted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  reviewer_notes text,
  
  constraint milestones_pkey primary key (id)
);

create index idx_milestones_project on public.milestones(project_id);
create index idx_milestones_status on public.milestones(status);

-- Backers Table
create table public.backers (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  wallet_address text not null,
  amount numeric not null,
  transaction_signature text not null,
  nft_minted boolean default false,
  nft_mint_address text,

  constraint backers_pkey primary key (id),
  constraint unique_backer_project unique (project_id, wallet_address)
);

create index idx_backers_wallet on public.backers(wallet_address);
create index idx_backers_project on public.backers(project_id);

-- Project Updates Table
create table public.project_updates (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  content text not null,
  is_backers_only boolean default false,
  
  constraint project_updates_pkey primary key (id)
);

create index idx_project_updates_project on public.project_updates(project_id);

-- Follows Table (Users following creators)
create table public.follows (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  follower_wallet text not null,
  following_wallet text not null,
  
  constraint follows_pkey primary key (id),
  constraint unique_follow unique (follower_wallet, following_wallet)
);

create index idx_follows_follower on public.follows(follower_wallet);
create index idx_follows_following on public.follows(following_wallet);

-- Notifications Table
create table public.notifications (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  user_wallet text not null,
  type text not null, -- 'milestone_completed', 'project_update', 'project_funded', 'new_backer', 'follow'
  title text not null,
  message text not null,
  link text,
  read boolean default false,
  data jsonb,
  
  constraint notifications_pkey primary key (id)
);

create index idx_notifications_user on public.notifications(user_wallet);
create index idx_notifications_read on public.notifications(read);

-- Messages Table (Conversations between users)
create table public.messages (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  sender_wallet text not null,
  recipient_wallet text not null,
  project_id uuid references public.projects(id) on delete set null,
  subject text,
  content text not null,
  read boolean default false,
  conversation_id text not null, -- Format: "wallet1_wallet2" (sorted alphabetically)
  
  constraint messages_pkey primary key (id)
);

create index idx_messages_conversation on public.messages(conversation_id);
create index idx_messages_recipient on public.messages(recipient_wallet);
create index idx_messages_sender on public.messages(sender_wallet);

-- Transactions Table (Full transaction log)
create table public.transactions (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  type text not null, -- 'backing', 'withdrawal', 'refund', 'milestone_payout'
  from_wallet text not null,
  to_wallet text not null,
  amount numeric not null,
  project_id uuid references public.projects(id) on delete set null,
  milestone_id uuid references public.milestones(id) on delete set null,
  tx_signature text not null unique,
  status text not null default 'pending', -- 'pending', 'confirmed', 'failed'
  blockchain_confirmed boolean default false,
  
  constraint transactions_pkey primary key (id)
);

create index idx_transactions_from on public.transactions(from_wallet);
create index idx_transactions_to on public.transactions(to_wallet);
create index idx_transactions_project on public.transactions(project_id);
create index idx_transactions_signature on public.transactions(tx_signature);

-- Activity Feed Table (For real-time activity)
create table public.activity_feed (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  type text not null, -- 'project_launched', 'project_backed', 'milestone_completed', 'project_funded'
  user_wallet text,
  project_id uuid references public.projects(id) on delete cascade,
  data jsonb,
  
  constraint activity_feed_pkey primary key (id)
);

create index idx_activity_created on public.activity_feed(created_at desc);
create index idx_activity_type on public.activity_feed(type);

-- User Sessions Table (For wallet authentication)
create table public.user_sessions (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  expires_at timestamp with time zone not null,
  wallet_address text not null,
  session_token text not null unique,
  nonce text not null,
  
  constraint user_sessions_pkey primary key (id)
);

create index idx_sessions_wallet on public.user_sessions(wallet_address);
create index idx_sessions_token on public.user_sessions(session_token);

-- Row Level Security (RLS)

-- Users
alter table public.users enable row level security;

create policy "Users are viewable by everyone"
  on public.users for select
  using ( true );

create policy "Users can update their own profile"
  on public.users for update
  using ( wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet' );

create policy "Users can insert their own profile"
  on public.users for insert
  with check ( true );

-- Projects: Everyone can read. Only creator can update.
alter table public.projects enable row level security;

create policy "Projects are viewable by everyone"
  on public.projects for select
  using ( true );

create policy "Creators can insert projects"
  on public.projects for insert
  with check ( true );

create policy "Creators can update their own projects"
  on public.projects for update
  using ( true );

-- Milestones
alter table public.milestones enable row level security;

create policy "Milestones are viewable by everyone"
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

-- Project Updates
alter table public.project_updates enable row level security;

create policy "Updates are viewable by everyone"
  on public.project_updates for select
  using ( true );

create policy "Creators can create updates"
  on public.project_updates for insert
  with check ( true );

-- Follows
alter table public.follows enable row level security;

create policy "Follows are viewable by everyone"
  on public.follows for select
  using ( true );

create policy "Users can follow"
  on public.follows for insert
  with check ( true );

create policy "Users can unfollow"
  on public.follows for delete
  using ( true );

-- Notifications
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using ( user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet' );

create policy "System can insert notifications"
  on public.notifications for insert
  with check ( true );

create policy "Users can update their own notifications"
  on public.notifications for update
  using ( user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet' );

-- Messages
alter table public.messages enable row level security;

create policy "Users can view their own messages"
  on public.messages for select
  using ( 
    sender_wallet = current_setting('request.jwt.claims', true)::json->>'wallet' 
    or recipient_wallet = current_setting('request.jwt.claims', true)::json->>'wallet' 
  );

create policy "Users can send messages"
  on public.messages for insert
  with check ( true );

-- Transactions
alter table public.transactions enable row level security;

create policy "Transactions are viewable by involved parties"
  on public.transactions for select
  using ( 
    from_wallet = current_setting('request.jwt.claims', true)::json->>'wallet'
    or to_wallet = current_setting('request.jwt.claims', true)::json->>'wallet'
  );

-- Activity Feed
alter table public.activity_feed enable row level security;

create policy "Activity feed is viewable by everyone"
  on public.activity_feed for select
  using ( true );

-- Functions for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_users_updated_at before update on public.users
  for each row execute function update_updated_at_column();

create trigger update_projects_updated_at before update on public.projects
  for each row execute function update_updated_at_column();

create trigger update_milestones_updated_at before update on public.milestones
  for each row execute function update_updated_at_column();
