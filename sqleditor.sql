-- ============================================================================
-- ODV CROWDFUNDING PLATFORM - COMPLETE SCHEMA WITH MODAL LOOP FIXES
-- ============================================================================
-- 
-- ⚡ CRITICAL FIXES APPLIED:
-- 1. increment_backers function has SECURITY DEFINER (bypasses RLS)
-- 2. Projects table has UPDATE policies
-- 3. Backers table has explicit service role INSERT policy
--
-- INSTRUCTIONS:
-- 1. Go to Supabase SQL Editor: https://zsfujmvltpumleszcrwh.supabase.co
-- 2. Copy this ENTIRE file
-- 3. Paste into SQL Editor
-- 4. Click "Run" button
-- 5. Run verification queries at bottom to confirm
--
-- ============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Cleanup (Drop existing to ensure clean state)
DROP TABLE IF EXISTS public.activity_feed CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.follows CASCADE;
DROP TABLE IF EXISTS public.project_updates CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.backers CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;

-- ============================================================================
-- 3. SCHEMA DEFINITION
-- ============================================================================

-- Users Table
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  wallet_address text NOT NULL UNIQUE,
  name text,
  bio text,
  avatar_url text,
  role text NOT NULL DEFAULT 'backer',
  status text NOT NULL DEFAULT 'active',
  twitter_handle text,
  github_handle text,
  website_url text,
  discord_handle text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  onboarding_type text,
  interests text[],
  email text,
  email_verified boolean DEFAULT false,
  notification_preferences jsonb DEFAULT '{"email": true, "push": true, "milestone": true, "updates": true}'::jsonb,
  privacy_settings jsonb DEFAULT '{"profile_public": true, "show_backed": true}'::jsonb,
  projects_created_count integer DEFAULT 0,
  projects_backed_count integer DEFAULT 0,
  total_raised numeric DEFAULT 0,
  total_backed numeric DEFAULT 0,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Projects Table
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  goal numeric NOT NULL,
  raised numeric NOT NULL DEFAULT 0,
  backers_count integer NOT NULL DEFAULT 0,
  video_url text,
  image_url text,
  creator_wallet text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  deadline timestamp with time zone,
  launch_date timestamp with time zone,
  twitter_link text,
  github_link text,
  website_link text,
  creator_name text,
  creator_avatar text,
  creator_bio text,
  views_count integer DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  flagged boolean DEFAULT false,
  rejection_reason text,
  admin_notes text,
  campaign_id integer,
  campaign_pda text,
  initialize_tx text,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

-- Milestones Table
CREATE TABLE public.milestones (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  percentage numeric NOT NULL,
  amount numeric NOT NULL,
  deadline timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'locked',
  proof_url text,
  proof_description text,
  submitted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  reviewer_notes text,
  CONSTRAINT milestones_pkey PRIMARY KEY (id)
);

-- Backers Table
CREATE TABLE public.backers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  amount numeric NOT NULL,
  transaction_signature text NOT NULL,
  nft_minted boolean DEFAULT false,
  nft_mint_address text,
  CONSTRAINT backers_pkey PRIMARY KEY (id),
  CONSTRAINT unique_backer_project UNIQUE (project_id, wallet_address)
);

-- Comments Table
CREATE TABLE public.comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES public.comments(id),
  likes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Project Updates Table
CREATE TABLE public.project_updates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  is_backers_only boolean DEFAULT false,
  CONSTRAINT project_updates_pkey PRIMARY KEY (id)
);

-- Follows Table
CREATE TABLE public.follows (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  follower_wallet text NOT NULL,
  following_wallet text NOT NULL,
  CONSTRAINT follows_pkey PRIMARY KEY (id),
  CONSTRAINT unique_follow UNIQUE (follower_wallet, following_wallet)
);

-- Notifications Table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  wallet_address text NOT NULL,
  project_id uuid REFERENCES public.projects(id),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean DEFAULT false,
  data jsonb,
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Activity Feed Table
CREATE TABLE public.activity_feed (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  type text NOT NULL,
  user_wallet text,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  data jsonb,
  CONSTRAINT activity_feed_pkey PRIMARY KEY (id)
);

-- Transactions Table
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  tx_signature text NOT NULL UNIQUE,
  from_wallet text,
  to_wallet text,
  amount numeric,
  type text,
  status text DEFAULT 'pending',
  blockchain_confirmed boolean DEFAULT false,
  project_id uuid REFERENCES public.projects(id),
  CONSTRAINT transactions_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- ⚡ CRITICAL FIX: increment_backers Function with SECURITY DEFINER
-- ============================================================================

DROP FUNCTION IF EXISTS increment_backers(uuid, numeric);

CREATE OR REPLACE FUNCTION increment_backers(project_id uuid, amount_to_add numeric)
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER  -- ⚡ KEY FIX - Runs with elevated privileges, bypasses RLS
SET search_path = public
AS $$
BEGIN
  UPDATE public.projects
  SET 
    raised = raised + amount_to_add,
    backers_count = backers_count + 1,
    updated_at = NOW()
  WHERE id = project_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found: %', project_id;
  END IF;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_backers(uuid, numeric) TO service_role;
GRANT EXECUTE ON FUNCTION increment_backers(uuid, numeric) TO anon;
GRANT EXECUTE ON FUNCTION increment_backers(uuid, numeric) TO authenticated;

-- ============================================================================
-- 4. SEED DATA
-- ============================================================================

INSERT INTO users (id, wallet_address, name, bio, avatar_url, twitter_handle, github_handle, website_url, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'CrEaT0r1WaLLeT111111111111111111111111111', 'Sarah Chen', 'Full-stack dev building the future of creator economy. Ex-Meta, now indie.', 'https://i.pravatar.cc/150?u=sarah', 'sarahbuilds', 'sarahchen', 'https://sarahchen.dev', NOW() - INTERVAL '90 days'),
('22222222-2222-2222-2222-222222222222', 'CrEaT0r2WaLLeT222222222222222222222222222', 'Marcus Johnson', 'Climate tech founder. MIT grad. Passionate about sustainability & blockchain.', 'https://i.pravatar.cc/150?u=marcus', 'marcusclimate', 'mjohnson', 'https://greentech.io', NOW() - INTERVAL '75 days'),
('33333333-3333-3333-3333-333333333333', 'CrEaT0r3WaLLeT333333333333333333333333333', 'Yuki Tanaka', 'Game designer from Tokyo. Making web3 games actually fun.', 'https://i.pravatar.cc/150?u=yuki', 'yukigamedev', 'yukitanaka', 'https://yukiverse.game', NOW() - INTERVAL '60 days'),
('44444444-4444-4444-4444-444444444444', 'CrEaT0r4WaLLeT444444444444444444444444444', 'Priya Patel', 'Healthcare innovator. Building accessible medical tech for everyone.', 'https://i.pravatar.cc/150?u=priya', 'priyahealth', 'ppatel', 'https://medtech.health', NOW() - INTERVAL '45 days'),
('55555555-5555-5555-5555-555555555555', 'CrEaT0r5WaLLeT555555555555555555555555555', 'Alex Rivera', 'Artist & educator. Bringing coding to underserved communities.', 'https://i.pravatar.cc/150?u=alex', 'alexteaches', 'arivera', 'https://codeforall.org', NOW() - INTERVAL '30 days'),
('66666666-6666-6666-6666-666666666666', 'BaCKeR1WaLLeT666666666666666666666666666', 'Crypto Enthusiast', 'Supporting cool projects!', 'https://i.pravatar.cc/150?u=backer1', NULL, NULL, NULL, NOW() - INTERVAL '20 days'),
('77777777-7777-7777-7777-777777777777', 'BaCKeR2WaLLeT777777777777777777777777777', 'VC Investor', 'Early stage backing', 'https://i.pravatar.cc/150?u=backer2', NULL, NULL, NULL, NOW() - INTERVAL '15 days'),
('88888888-8888-8888-8888-888888888888', 'BaCKeR3WaLLeT888888888888888888888888888', 'Community Builder', NULL, 'https://i.pravatar.cc/150?u=backer3', NULL, NULL, NULL, NOW() - INTERVAL '10 days'),
('99999999-9999-9999-9999-999999999999', 'BaCKeR4WaLLeT999999999999999999999999999', 'Tech Scout', 'Finding gems', 'https://i.pravatar.cc/150?u=backer4', NULL, NULL, NULL, NOW() - INTERVAL '5 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BaCKeR5WaLLeT000000000000000000000000000', 'Angel Investor', NULL, 'https://i.pravatar.cc/150?u=backer5', NULL, NULL, NULL, NOW() - INTERVAL '2 days');

INSERT INTO projects (id, creator_wallet, title, tagline, description, category, status, goal, raised, backers_count, image_url, video_url, twitter_link, github_link, website_link, created_at, deadline) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD', 'DeFi Dashboard Pro', 'Track all your crypto in one beautiful dashboard', 'Tired of jumping between 10 different apps to check your portfolio? DeFi Dashboard Pro aggregates all your wallets, protocols, and NFTs into one stunning interface.', 'Technology', 'active', 15000, 12847, 289, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://twitter.com/defidashpro', 'https://github.com/sarahchen/defi-dashboard', 'https://defidashboard.pro', NOW() - INTERVAL '25 days', NOW() + INTERVAL '5 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE', 'Carbon Credit NFT Marketplace', 'Make offsetting your carbon footprint transparent & verifiable', 'Every company claims to be "carbon neutral" but nobody can verify it. We''re building an NFT marketplace where carbon credits are tokenized.', 'Social Impact', 'active', 25000, 18923, 412, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', NULL, 'https://twitter.com/carbonnft', 'https://github.com/mjohnson/carbon-nft', 'https://carbonchain.io', NOW() - INTERVAL '20 days', NOW() + INTERVAL '10 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF', 'Pixels & Potions', 'Roguelike RPG where your NFTs are actually useful', 'Most NFT games are glorified JPEGs. Pixels & Potions is an actual roguelike where your NFTs grant unique abilities.', 'Gaming', 'active', 30000, 24156, 567, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://twitter.com/pixelspotions', 'https://github.com/yukitanaka/pixels-potions', 'https://pixelsandpotions.game', NOW() - INTERVAL '18 days', NOW() + INTERVAL '12 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'FZy1sSt7OzsZtlYYxNeZgT0jAApM2NaZ1BP6MsTaAsP', 'HealthChain Medical Records', 'Own your medical data. Share it securely. Get paid for research.', 'Your medical records are scattered across dozens of providers, and you have zero control. HealthChain puts YOU in charge.', 'Health & Wellness', 'funded', 20000, 23457, 389, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', NULL, 'https://twitter.com/healthchain', 'https://github.com/ppatel/healthchain', 'https://healthchain.medical', NOW() - INTERVAL '60 days', NOW() - INTERVAL '10 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'GAz2tTu8PAtZumZZyOfZhU1kBBqN3ObZ2CQ7NtUbBtQG', 'CodeCamp for Kids', 'Teaching underprivileged kids to code through interactive games', 'Kids in low-income neighborhoods don''t get access to coding education. We''re changing that with a free, gamified curriculum.', 'Social Impact', 'funded', 12000, 15234, 412, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://twitter.com/codecamp4kids', 'https://github.com/arivera/codecamp', 'https://codecampforkids.org', NOW() - INTERVAL '45 days', NOW() - INTERVAL '5 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD', 'DecentralChat', 'Encrypted messaging that you actually own', 'Discord, Telegram, WhatsApp—all read your messages. DecentralChat is truly peer-to-peer, end-to-end encrypted.', 'Technology', 'active', 18000, 5234, 156, 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800', NULL, NULL, 'https://github.com/sarahchen/decentralchat', NULL, NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE', 'Solar Microgrids for Rural India', 'Bringing electricity to villages through blockchain-funded solar', '800 million people lack reliable electricity. We install solar microgrids in rural villages, funded by crypto.', 'Social Impact', 'active', 40000, 8945, 201, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://twitter.com/solarmicrogrids', NULL, 'https://solarmicrogrids.org', NOW() - INTERVAL '12 days', NOW() + INTERVAL '18 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF', 'MetaArcade', 'Retro arcade games meet NFT rewards', 'Remember arcade high scores? Now they''re NFTs. Beat Pac-Man? Mint your score.', 'Gaming', 'active', 22000, 14567, 389, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', NULL, 'https://twitter.com/metaarcade', 'https://github.com/yukitanaka/metaarcade', 'https://metaarcade.gg', NOW() - INTERVAL '22 days', NOW() + INTERVAL '8 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000009', 'FZy1sSt7OzsZtlYYxNeZgT0jAApM2NaZ1BP6MsTaAsP', 'AI Diagnosis Assistant', 'Helping doctors catch diseases earlier with ML', 'Doctors miss things. AI doesn''t. Our model analyzes medical scans alongside patient history.', 'Health & Wellness', 'active', 35000, 3421, 78, 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800', NULL, NULL, 'https://github.com/ppatel/ai-diagnosis', 'https://aidiagnosis.health', NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000010', 'GAz2tTu8PAtZumZZyOfZhU1kBBqN3ObZ2CQ7NtUbBtQG', 'Open Source Textbooks DAO', 'Free, community-maintained textbooks for everyone', 'College textbooks cost $200+ and get outdated immediately. We''re building a DAO to maintain open-source textbooks.', 'Social Impact', 'active', 15000, 2156, 89, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800', NULL, 'https://twitter.com/textbooksdao', 'https://github.com/arivera/textbooks-dao', 'https://textbooksdao.org', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000011', 'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD', 'Web3 Email Client', 'Email, but on-chain and encrypted', 'Email hasn''t changed in 50 years. We''re rebuilding it on blockchain.', 'Technology', 'pending', 10000, 0, 0, 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800', NULL, NULL, NULL, NULL, NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000012', 'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE', 'Plastic Ocean Cleanup Tokens', 'Fund ocean cleanup, earn impact NFTs', 'Every $10 backs cleanup of 1kg of ocean plastic. Get an NFT proving your impact.', 'Social Impact', 'draft', 50000, 0, 0, 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800', NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 day', NULL);

-- Milestones
INSERT INTO milestones (id, project_id, title, description, percentage, amount, deadline, status, submitted_at, reviewed_at) VALUES
('11111111-1111-1111-1111-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'MVP with 5 wallet integrations', 'Core dashboard with multi-wallet support', 30, 4500, NOW() - INTERVAL '10 days', 'completed', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days'),
('11111111-1111-1111-1111-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'NFT tracking + gas optimizer', 'Aggregate NFTs and optimize gas fees', 40, 6000, NOW() + INTERVAL '15 days', 'active', NULL, NULL),
('11111111-1111-1111-1111-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Tax reporting + mobile app', 'Full tax reporting and mobile version', 30, 4500, NOW() + INTERVAL '45 days', 'locked', NULL, NULL),
('22222222-2222-2222-2222-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Smart contract audit & deployment', 'Professional audit and mainnet deployment', 35, 8750, NOW() - INTERVAL '5 days', 'completed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Partner with 10 carbon projects', 'Onboard verified carbon credit providers', 30, 7500, NOW() + INTERVAL '20 days', 'active', NULL, NULL),
('22222222-2222-2222-2222-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Launch marketplace + mobile app', 'Public marketplace launch and mobile apps', 35, 8750, NOW() + INTERVAL '50 days', 'locked', NULL, NULL),
('33333333-3333-3333-3333-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Alpha launch with 3 character classes', 'Playable alpha with warrior, mage, rogue', 25, 7500, NOW() - INTERVAL '8 days', 'completed', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days'),
('33333333-3333-3333-3333-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'NFT breeding mechanics', 'Cross-breed NFTs for new traits', 25, 7500, NOW() + INTERVAL '10 days', 'active', NULL, NULL),
('33333333-3333-3333-3333-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'PvP arena + tournaments', 'Competitive multiplayer arena', 25, 7500, NOW() + INTERVAL '30 days', 'locked', NULL, NULL),
('33333333-3333-3333-3333-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Beta launch with 10 classes', 'Full beta with all character classes', 25, 7500, NOW() + INTERVAL '60 days', 'locked', NULL, NULL),
('44444444-4444-4444-4444-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'HIPAA compliance certification', 'Full HIPAA audit and certification', 40, 8000, NOW() - INTERVAL '30 days', 'completed', NOW() - INTERVAL '31 days', NOW() - INTERVAL '30 days'),
('44444444-4444-4444-4444-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Hospital integrations (5 partners)', 'Integrate with 5 major hospital systems', 30, 6000, NOW() - INTERVAL '15 days', 'completed', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days'),
('44444444-4444-4444-4444-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Patient app + research marketplace', 'Launch patient app and research platform', 30, 6000, NOW() + INTERVAL '30 days', 'active', NULL, NULL),
('55555555-5555-5555-5555-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Curriculum development (20 lessons)', 'Complete gamified coding curriculum', 50, 6000, NOW() - INTERVAL '20 days', 'completed', NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days'),
('55555555-5555-5555-5555-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Pilot in 5 schools', 'Run pilot program in 5 schools', 30, 3600, NOW() - INTERVAL '5 days', 'completed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
('55555555-5555-5555-5555-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Scale to 20 schools', 'Expand to 20 schools nationwide', 20, 2400, NOW() + INTERVAL '60 days', 'active', NULL, NULL),
('66666666-6666-6666-6666-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'Core messaging protocol', 'P2P encrypted messaging protocol', 50, 9000, NOW() + INTERVAL '20 days', 'active', NULL, NULL),
('66666666-6666-6666-6666-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'Desktop + mobile apps', 'Native desktop and mobile clients', 50, 9000, NOW() + INTERVAL '50 days', 'locked', NULL, NULL),
('77777777-7777-7777-7777-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'Install 3 microgrids', 'Deploy solar microgrids in 3 villages', 40, 16000, NOW() - INTERVAL '2 days', 'completed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
('77777777-7777-7777-7777-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'DAO governance framework', 'Setup DAO for community management', 30, 12000, NOW() + INTERVAL '25 days', 'active', NULL, NULL),
('77777777-7777-7777-7777-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'Scale to 10 villages', 'Expand to 10 villages total', 30, 12000, NOW() + INTERVAL '90 days', 'locked', NULL, NULL),
('88888888-8888-8888-8888-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'Launch 5 classic games', 'Deploy Pac-Man, Space Invaders, etc', 60, 13200, NOW() + INTERVAL '12 days', 'active', NULL, NULL),
('88888888-8888-8888-8888-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'NFT marketplace integration', 'Enable NFT minting and trading', 40, 8800, NOW() + INTERVAL '40 days', 'locked', NULL, NULL);

-- Backers
INSERT INTO backers (id, project_id, wallet_address, amount, transaction_signature, created_at) VALUES
('b1111111-1111-1111-1111-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 50, '5tx1signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '24 days'),
('b1111111-1111-1111-1111-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR2WaLLeT777777777777777777777777777', 100, '5tx1signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '23 days'),
('b1111111-1111-1111-1111-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR3WaLLeT888888888888888888888888888', 25, '5tx1signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '20 days'),
('b1111111-1111-1111-1111-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR4WaLLeT999999999999999999999999999', 75, '5tx1signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '18 days'),
('b1111111-1111-1111-1111-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR5WaLLeT000000000000000000000000000', 200, '5tx1signature5555555555555555555555555555555555555555555555555', NOW() - INTERVAL '15 days'),
('b2222222-2222-2222-2222-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR1WaLLeT666666666666666666666666666', 30, '5tx2signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '19 days'),
('b2222222-2222-2222-2222-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR2WaLLeT777777777777777777777777777', 50, '5tx2signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '17 days'),
('b2222222-2222-2222-2222-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR3WaLLeT888888888888888888888888888', 100, '5tx2signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '15 days'),
('b2222222-2222-2222-2222-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR4WaLLeT999999999999999999999999999', 40, '5tx2signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '12 days'),
('b2222222-2222-2222-2222-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR5WaLLeT000000000000000000000000000', 150, '5tx2signature5555555555555555555555555555555555555555555555555', NOW() - INTERVAL '8 days'),
('b3333333-3333-3333-3333-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR1WaLLeT666666666666666666666666666', 10, '5tx3signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '17 days'),
('b3333333-3333-3333-3333-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR2WaLLeT777777777777777777777777777', 25, '5tx3signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '16 days'),
('b3333333-3333-3333-3333-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR3WaLLeT888888888888888888888888888', 50, '5tx3signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '14 days'),
('b3333333-3333-3333-3333-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR4WaLLeT999999999999999999999999999', 15, '5tx3signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '10 days'),
('b3333333-3333-3333-3333-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR5WaLLeT000000000000000000000000000', 100, '5tx3signature5555555555555555555555555555555555555555555555555', NOW() - INTERVAL '5 days'),
('b4444444-4444-4444-4444-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'BaCKeR1WaLLeT666666666666666666666666666', 75, '5tx4signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '55 days'),
('b4444444-4444-4444-4444-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'BaCKeR2WaLLeT777777777777777777777777777', 120, '5tx4signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '50 days'),
('b4444444-4444-4444-4444-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'BaCKeR3WaLLeT888888888888888888888888888', 90, '5tx4signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '45 days'),
('b4444444-4444-4444-4444-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'BaCKeR4WaLLeT999999999999999999999999999', 60, '5tx4signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '40 days'),
('b5555555-5555-5555-5555-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'BaCKeR1WaLLeT666666666666666666666666666', 25, '5tx5signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '40 days'),
('b5555555-5555-5555-5555-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'BaCKeR2WaLLeT777777777777777777777777777', 50, '5tx5signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '35 days'),
('b5555555-5555-5555-5555-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'BaCKeR3WaLLeT888888888888888888888888888', 30, '5tx5signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '30 days'),
('b5555555-5555-5555-5555-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'BaCKeR4WaLLeT999999999999999999999999999', 40, '5tx5signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '25 days'),
('b6666666-6666-6666-6666-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'BaCKeR2WaLLeT777777777777777777777777777', 35, '5tx6signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '12 days'),
('b6666666-6666-6666-6666-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'BaCKeR3WaLLeT888888888888888888888888888', 20, '5tx6signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '10 days'),
('b7777777-7777-7777-7777-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'BaCKeR1WaLLeT666666666666666666666666666', 45, '5tx7signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '11 days'),
('b7777777-7777-7777-7777-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'BaCKeR4WaLLeT999999999999999999999999999', 80, '5tx7signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '9 days'),
('b8888888-8888-8888-8888-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'BaCKeR2WaLLeT777777777777777777777777777', 30, '5tx8signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '20 days'),
('b8888888-8888-8888-8888-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'BaCKeR5WaLLeT000000000000000000000000000', 60, '5tx8signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '15 days');

-- Project Updates
INSERT INTO project_updates (id, project_id, title, content, created_at) VALUES
('01111111-1111-1111-1111-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'MVP is Live! 🎉', 'Huge milestone! The dashboard now supports MetaMask, Phantom, WalletConnect, Coinbase Wallet, and Ledger. Real-time price feeds working beautifully. Next up: NFT tracking!', NOW() - INTERVAL '10 days'),
('01111111-1111-1111-1111-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'NFT Module in Testing', 'Just finished the NFT aggregator. It pulls from OpenSea, Magic Eden, and Tensor. Shows floor prices, rarity ranks, and your P&L. Beta testers wanted!', NOW() - INTERVAL '3 days'),
('02222222-2222-2222-2222-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Smart Contracts Audited ✅', 'CertiK just completed our audit with zero critical issues. Contracts are deployed and verified. Moving fast toward launch!', NOW() - INTERVAL '5 days'),
('02222222-2222-2222-2222-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Partnership Announcement', 'Excited to announce partnerships with Verra, Gold Standard, and Climate Action Reserve. These are the REAL carbon credit verifiers. No BS.', NOW() - INTERVAL '1 day'),
('03333333-3333-3333-3333-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Alpha Launched! Playable Now', '300 players in the first 24 hours! The feedback is incredible. People love the breeding mechanics. PvP arena coming next month!', NOW() - INTERVAL '8 days'),
('03333333-3333-3333-3333-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'New Character Class: Necromancer', 'Just shipped our 4th character class. Necromancers can resurrect defeated enemies to fight for them. Totally changes the meta.', NOW() - INTERVAL '2 days'),
('04444444-4444-4444-4444-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'HIPAA Certified! 🏥', 'Passed all compliance audits. We can legally handle protected health information. This was the biggest hurdle and we crushed it.', NOW() - INTERVAL '30 days'),
('04444444-4444-4444-4444-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'First 5 Hospitals Onboarded', 'Mayo Clinic, Cleveland Clinic, Johns Hopkins, Stanford Health, and Mass General are all live on HealthChain. This is huge.', NOW() - INTERVAL '15 days'),
('05555555-5555-5555-5555-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Pilot Results Are In!', '87% of students showed improvement in problem-solving. 92% said coding was "fun". Teachers are blown away. Scaling to 20 schools next!', NOW() - INTERVAL '6 days');

-- Follows
INSERT INTO follows (id, follower_wallet, following_wallet, created_at) VALUES
('e1111111-1111-1111-1111-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD', NOW() - INTERVAL '24 days'),
('e1111111-1111-1111-1111-000000000002', 'BaCKeR2WaLLeT777777777777777777777777777', 'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD', NOW() - INTERVAL '23 days'),
('e2222222-2222-2222-2222-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE', NOW() - INTERVAL '19 days'),
('e2222222-2222-2222-2222-000000000002', 'BaCKeR3WaLLeT888888888888888888888888888', 'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE', NOW() - INTERVAL '15 days'),
('e3333333-3333-3333-3333-000000000001', 'BaCKeR2WaLLeT777777777777777777777777777', 'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF', NOW() - INTERVAL '16 days'),
('e3333333-3333-3333-3333-000000000002', 'BaCKeR3WaLLeT888888888888888888888888888', 'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF', NOW() - INTERVAL '14 days'),
('e3333333-3333-3333-3333-000000000003', 'BaCKeR4WaLLeT999999999999999999999999999', 'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF', NOW() - INTERVAL '10 days');

-- Notifications
INSERT INTO notifications (id, wallet_address, type, title, message, data, created_at, read, project_id) VALUES
('d1111111-1111-1111-1111-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'project_update', 'DeFi Dashboard Pro posted an update', 'MVP is Live! 🎉', '{"project_id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000001"}'::jsonb, NOW() - INTERVAL '10 days', true, 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'),
('d1111111-1111-1111-1111-000000000002', 'BaCKeR1WaLLeT666666666666666666666666666', 'project_update', 'DeFi Dashboard Pro posted an update', 'NFT Module in Testing', '{"project_id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000001"}'::jsonb, NOW() - INTERVAL '3 days', false, 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'),
('d2222222-2222-2222-2222-000000000001', 'BaCKeR2WaLLeT777777777777777777777777777', 'milestone_completed', 'DeFi Dashboard Pro completed a milestone', 'MVP with 5 wallet integrations', '{"project_id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000001"}'::jsonb, NOW() - INTERVAL '10 days', true, 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'),
('d3333333-3333-3333-3333-000000000001', 'BaCKeR3WaLLeT888888888888888888888888888', 'project_funded', 'Carbon Credit NFT Marketplace is 75% funded!', 'Only $6,077 to go!', '{"project_id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000002"}'::jsonb, NOW() - INTERVAL '5 days', false, 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002');

-- Activity Feed
INSERT INTO activity_feed (id, user_wallet, project_id, type, data, created_at) VALUES
('c1111111-1111-1111-1111-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'project_backed', '{"amount": 50}', NOW() - INTERVAL '24 days'),
('c1111111-1111-1111-1111-000000000002', 'BaCKeR2WaLLeT777777777777777777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'project_backed', '{"amount": 100}', NOW() - INTERVAL '23 days'),
('c1111111-1111-1111-1111-000000000003', 'CrEaT0r1WaLLeT111111111111111111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'milestone_completed', '{"milestone": "MVP with 5 wallet integrations"}', NOW() - INTERVAL '10 days'),
('c2222222-2222-2222-2222-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'project_backed', '{"amount": 30}', NOW() - INTERVAL '19 days'),
('c3333333-3333-3333-3333-000000000001', 'CrEaT0r3WaLLeT333333333333333333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'project_update', '{"title": "Alpha Launched! Playable Now"}', NOW() - INTERVAL '8 days'),
('c4444444-4444-4444-4444-000000000001', 'BaCKeR5WaLLeT000000000000000000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'project_backed', '{"amount": 100}', NOW() - INTERVAL '5 days'),
('c5555555-5555-5555-5555-000000000001', 'CrEaT0r4WaLLeT444444444444444444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'project_funded', '{"goal": 20000, "raised": 23457}', NOW() - INTERVAL '10 days');

-- ============================================================================
-- 5. RLS POLICIES (Security) - WITH CRITICAL FIXES
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK ( true );

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public.projects;
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Creators can insert projects" ON public.projects;
CREATE POLICY "Creators can insert projects" ON public.projects FOR INSERT WITH CHECK ( true );

-- ⚡ CRITICAL FIX: Add UPDATE policies for projects
DROP POLICY IF EXISTS "Service role can update project stats" ON public.projects;
CREATE POLICY "Service role can update project stats" 
  ON public.projects 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Creators can update their projects" ON public.projects;
CREATE POLICY "Creators can update their projects" 
  ON public.projects 
  FOR UPDATE 
  USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet')
  WITH CHECK (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet');

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Users can post comments" ON public.comments;
CREATE POLICY "Users can post comments" ON public.comments FOR INSERT WITH CHECK ( true );

ALTER TABLE public.backers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Backers are viewable by everyone" ON public.backers;
CREATE POLICY "Backers are viewable by everyone" ON public.backers FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Users can back projects" ON public.backers;
CREATE POLICY "Users can back projects" ON public.backers FOR INSERT WITH CHECK ( true );

-- ⚡ CRITICAL FIX: Add explicit service role INSERT policy
DROP POLICY IF EXISTS "Service role can insert backers" ON public.backers;
CREATE POLICY "Service role can insert backers" 
  ON public.backers 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Milestones are viewable by everyone" ON public.milestones;
CREATE POLICY "Milestones are viewable by everyone" ON public.milestones FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Creators can insert milestones" ON public.milestones;
CREATE POLICY "Creators can insert milestones" ON public.milestones FOR INSERT WITH CHECK ( true );

ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Updates are viewable by everyone" ON public.project_updates;
CREATE POLICY "Updates are viewable by everyone" ON public.project_updates FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Creators can create updates" ON public.project_updates;
CREATE POLICY "Creators can create updates" ON public.project_updates FOR INSERT WITH CHECK ( true );

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Users can follow" ON public.follows;
CREATE POLICY "Users can follow" ON public.follows FOR INSERT WITH CHECK ( true );

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING ( wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet' );
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK ( true );

ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Activity feed is viewable by everyone" ON public.activity_feed;
CREATE POLICY "Activity feed is viewable by everyone" ON public.activity_feed FOR SELECT USING ( true );

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Transactions are viewable by everyone" ON public.transactions;
CREATE POLICY "Transactions are viewable by everyone" ON public.transactions FOR SELECT USING ( true );
DROP POLICY IF EXISTS "System can insert transactions" ON public.transactions;
CREATE POLICY "System can insert transactions" ON public.transactions FOR INSERT WITH CHECK ( true );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify function has SECURITY DEFINER
SELECT 
  p.proname AS function_name,
  CASE p.prosecdef 
    WHEN true THEN '✅ SECURITY DEFINER' 
    ELSE '❌ SECURITY INVOKER' 
  END AS security_mode
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'increment_backers';

-- List all policies on projects table
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'projects';

-- List all policies on backers table
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'backers';
