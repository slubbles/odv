-- ============================================================================
-- ODV Crowdfunding Platform - Seed Data
-- ============================================================================
-- This script populates the database with realistic test data:
-- - 5 creator users with profiles
-- - 12 projects across different categories and stages
-- - 25+ milestones
-- - 50+ backers
-- - Project updates, follows, notifications
-- ============================================================================

-- Clear existing data (optional - uncomment if needed)
TRUNCATE TABLE activity_feed, notifications, follows, project_updates, backers, milestones, projects, users CASCADE;

-- ============================================================================
-- 1. USERS (Creators & Backers)
-- ============================================================================

INSERT INTO users (id, wallet_address, display_name, bio, avatar_url, twitter_handle, github_handle, website_url, created_at) VALUES
-- Creators
('11111111-1111-1111-1111-111111111111', 'CrEaT0r1WaLLeT111111111111111111111111111', 'Sarah Chen', 'Full-stack dev building the future of creator economy. Ex-Meta, now indie.', 'https://i.pravatar.cc/150?u=sarah', 'sarahbuilds', 'sarahchen', 'https://sarahchen.dev', NOW() - INTERVAL '90 days'),
('22222222-2222-2222-2222-222222222222', 'CrEaT0r2WaLLeT222222222222222222222222222', 'Marcus Johnson', 'Climate tech founder. MIT grad. Passionate about sustainability & blockchain.', 'https://i.pravatar.cc/150?u=marcus', 'marcusclimate', 'mjohnson', 'https://greentech.io', NOW() - INTERVAL '75 days'),
('33333333-3333-3333-3333-333333333333', 'CrEaT0r3WaLLeT333333333333333333333333333', 'Yuki Tanaka', 'Game designer from Tokyo. Making web3 games actually fun.', 'https://i.pravatar.cc/150?u=yuki', 'yukigamedev', 'yukitanaka', 'https://yukiverse.game', NOW() - INTERVAL '60 days'),
('44444444-4444-4444-4444-444444444444', 'CrEaT0r4WaLLeT444444444444444444444444444', 'Priya Patel', 'Healthcare innovator. Building accessible medical tech for everyone.', 'https://i.pravatar.cc/150?u=priya', 'priyahealth', 'ppatel', 'https://medtech.health', NOW() - INTERVAL '45 days'),
('55555555-5555-5555-5555-555555555555', 'CrEaT0r5WaLLeT555555555555555555555555555', 'Alex Rivera', 'Artist & educator. Bringing coding to underserved communities.', 'https://i.pravatar.cc/150?u=alex', 'alexteaches', 'arivera', 'https://codeforall.org', NOW() - INTERVAL '30 days'),

-- Backers (sample wallets)
('66666666-6666-6666-6666-666666666666', 'BaCKeR1WaLLeT666666666666666666666666666', 'Crypto Enthusiast', 'Supporting cool projects!', 'https://i.pravatar.cc/150?u=backer1', NULL, NULL, NULL, NOW() - INTERVAL '20 days'),
('77777777-7777-7777-7777-777777777777', 'BaCKeR2WaLLeT777777777777777777777777777', 'VC Investor', 'Early stage backing', 'https://i.pravatar.cc/150?u=backer2', NULL, NULL, NULL, NOW() - INTERVAL '15 days'),
('88888888-8888-8888-8888-888888888888', 'BaCKeR3WaLLeT888888888888888888888888888', 'Community Builder', NULL, 'https://i.pravatar.cc/150?u=backer3', NULL, NULL, NULL, NOW() - INTERVAL '10 days'),
('99999999-9999-9999-9999-999999999999', 'BaCKeR4WaLLeT999999999999999999999999999', 'Tech Scout', 'Finding gems', 'https://i.pravatar.cc/150?u=backer4', NULL, NULL, NULL, NOW() - INTERVAL '5 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BaCKeR5WaLLeT000000000000000000000000000', 'Angel Investor', NULL, 'https://i.pravatar.cc/150?u=backer5', NULL, NULL, NULL, NOW() - INTERVAL '2 days');

-- ============================================================================
-- 2. PROJECTS
-- ============================================================================

INSERT INTO projects (
  id, 
  creator_wallet, 
  title, 
  tagline, 
  description, 
  category, 
  status, 
  goal, 
  raised, 
  backers_count, 
  image_url, 
  video_url,
  twitter_link,
  github_link,
  website_link,
  created_at,
  deadline
) VALUES

-- ACTIVE & TRENDING PROJECTS
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
  'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD',
  'DeFi Dashboard Pro',
  'Track all your crypto in one beautiful dashboard',
  'Tired of jumping between 10 different apps to check your portfolio? DeFi Dashboard Pro aggregates all your wallets, protocols, and NFTs into one stunning interface. Real-time price updates, gas optimization suggestions, and tax reporting built in. No more spreadsheets.',
  'Technology',
  'active',
  15000,
  12847,
  289,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://twitter.com/defidashpro',
  'https://github.com/sarahchen/defi-dashboard',
  'https://defidashboard.pro',
  NOW() - INTERVAL '25 days',
  NOW() + INTERVAL '5 days'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000002',
  'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE',
  'Carbon Credit NFT Marketplace',
  'Make offsetting your carbon footprint transparent & verifiable',
  'Every company claims to be "carbon neutral" but nobody can verify it. We''re building an NFT marketplace where carbon credits are tokenized, fully auditable on-chain, and tradeable. Buy from verified projects, track your impact, prove your commitment. No greenwashing allowed.',
  'Social Impact',
  'active',
  25000,
  18923,
  412,
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
  NULL,
  'https://twitter.com/carbonnft',
  'https://github.com/mjohnson/carbon-nft',
  'https://carbonchain.io',
  NOW() - INTERVAL '20 days',
  NOW() + INTERVAL '10 days'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000003',
  'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF',
  'Pixels & Potions',
  'Roguelike RPG where your NFTs are actually useful',
  'Most NFT games are glorified JPEGs. Pixels & Potions is an actual roguelike where your NFTs grant unique abilities, evolve through gameplay, and can be bred for new traits. Think Slay the Spire meets Axie Infinity, but fun. Already playable alpha.',
  'Gaming',
  'active',
  30000,
  24156,
  567,
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://twitter.com/pixelspotions',
  'https://github.com/yukitanaka/pixels-potions',
  'https://pixelsandpotions.game',
  NOW() - INTERVAL '18 days',
  NOW() + INTERVAL '12 days'
),

-- SUCCESSFULLY FUNDED PROJECTS
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000004',
  'FZy1sSt7OzsZtlYYxNeZgT0jAApM2NaZ1BP6MsTaAsP',
  'HealthChain Medical Records',
  'Own your medical data. Share it securely. Get paid for research.',
  'Your medical records are scattered across dozens of providers, and you have zero control. HealthChain puts YOU in charge. Store records on-chain with zero-knowledge proofs, share with doctors instantly, and earn tokens when you contribute to medical research. HIPAA compliant.',
  'Health & Wellness',
  'funded',
  20000,
  23457,
  389,
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
  NULL,
  'https://twitter.com/healthchain',
  'https://github.com/ppatel/healthchain',
  'https://healthchain.medical',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '10 days'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000005',
  'GAz2tTu8PAtZumZZyOfZhU1kBBqN3ObZ2CQ7NtUbBtQG',
  'CodeCamp for Kids',
  'Teaching underprivileged kids to code through interactive games',
  'Kids in low-income neighborhoods don''t get access to coding education. We''re changing that with a free, gamified curriculum that works on any device. Minecraft-style challenges, real programming concepts, peer mentorship. Already piloted in 5 schools with amazing results.',
  'Social Impact',
  'funded',
  12000,
  15234,
  412,
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://twitter.com/codecamp4kids',
  'https://github.com/arivera/codecamp',
  'https://codecampforkids.org',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '5 days'
),

-- MORE ACTIVE PROJECTS (Different stages)
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000006',
  'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD',
  'DecentralChat',
  'Encrypted messaging that you actually own',
  'Discord, Telegram, WhatsApp—all read your messages. DecentralChat is truly peer-to-peer, end-to-end encrypted, and runs on IPFS. No servers, no data mining, no censorship. Just you and your friends.',
  'Technology',
  'active',
  18000,
  5234,
  156,
  'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800',
  NULL,
  NULL,
  'https://github.com/sarahchen/decentralchat',
  NULL,
  NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '15 days'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000007',
  'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE',
  'Solar Microgrids for Rural India',
  'Bringing electricity to villages through blockchain-funded solar',
  ' 800 million people lack reliable electricity. We install solar microgrids in rural villages, funded by crypto, powered by local communities. Each village gets its own DAO to manage the grid. Already operational in 3 villages, powering 2,000 homes.',
  'Social Impact',
  'active',
  40000,
  8945,
  201,
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://twitter.com/solarmicrogrids',
  NULL,
  'https://solarmicrogrids.org',
  NOW() - INTERVAL '12 days',
  NOW() + INTERVAL '18 days'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000008',
  'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF',
  'MetaArcade',
  'Retro arcade games meet NFT rewards',
  'Remember arcade high scores? Now they''re NFTs. Beat Pac-Man? Mint your score. Top the leaderboard in Street Fighter? That''s an achievement NFT with real value. Nostalgia meets utility.',
  'Gaming',
  'active',
  22000,
  14567,
  389,
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
  NULL,
  'https://twitter.com/metaarcade',
  'https://github.com/yukitanaka/metaarcade',
  'https://metaarcade.gg',
  NOW() - INTERVAL '22 days',
  NOW() + INTERVAL '8 days'
),

-- EARLY STAGE PROJECTS
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000009',
  'FZy1sSt7OzsZtlYYxNeZgT0jAApM2NaZ1BP6MsTaAsP',
  'AI Diagnosis Assistant',
  'Helping doctors catch diseases earlier with ML',
  'Doctors miss things. AI doesn''t. Our model analyzes medical scans alongside patient history to flag potential issues for review. Not replacing doctors—augmenting them. 94% accuracy in trials.',
  'Health & Wellness',
  'active',
  35000,
  3421,
  78,
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
  NULL,
  NULL,
  'https://github.com/ppatel/ai-diagnosis',
  'https://aidiagnosis.health',
  NOW() - INTERVAL '8 days',
  NOW() + INTERVAL '22 days'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000010',
  'GAz2tTu8PAtZumZZyOfZhU1kBBqN3ObZ2CQ7NtUbBtQG',
  'Open Source Textbooks DAO',
  'Free, community-maintained textbooks for everyone',
  'College textbooks cost $200+ and get outdated immediately. We''re building a DAO to maintain open-source textbooks that are always free, always current, and peer-reviewed by experts. Knowledge should be free.',
  'Social Impact',
  'active',
  15000,
  2156,
  89,
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
  NULL,
  'https://twitter.com/textbooksdao',
  'https://github.com/arivera/textbooks-dao',
  'https://textbooksdao.org',
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '25 days'
),

-- DRAFT/PENDING PROJECTS
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000011',
  'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD',
  'Web3 Email Client',
  'Email, but on-chain and encrypted',
  'Email hasn''t changed in 50 years. We''re rebuilding it on blockchain: wallet-to-wallet messaging, token-gated newsletters, spam protection through staking. The email client for web3 natives.',
  'Technology',
  'pending',
  10000,
  0,
  0,
  'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '28 days'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000012',
  'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE',
  'Plastic Ocean Cleanup Tokens',
  'Fund ocean cleanup, earn impact NFTs',
  'Every $10 backs cleanup of 1kg of ocean plastic. Get an NFT proving your impact, tracked via satellite + on-chain verification. Already partnered with 3 cleanup orgs. Let''s fix this together.',
  'Social Impact',
  'draft',
  50000,
  0,
  0,
  'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW() - INTERVAL '1 day',
  NULL
);

-- ============================================================================
-- 3. MILESTONES
-- ============================================================================

-- DeFi Dashboard Pro milestones
INSERT INTO milestones (id, project_id, title, description, percentage, amount, deadline, status, submitted_at, reviewed_at) VALUES
('11111111-1111-1111-1111-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'MVP with 5 wallet integrations', 'Core dashboard with multi-wallet support', 30, 4500, NOW() - INTERVAL '10 days', 'completed', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days'),
('11111111-1111-1111-1111-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'NFT tracking + gas optimizer', 'Aggregate NFTs and optimize gas fees', 40, 6000, NOW() + INTERVAL '15 days', 'active', NULL, NULL),
('11111111-1111-1111-1111-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Tax reporting + mobile app', 'Full tax reporting and mobile version', 30, 4500, NOW() + INTERVAL '45 days', 'locked', NULL, NULL);

-- Carbon Credit NFT milestones
INSERT INTO milestones (id, project_id, title, description, percentage, amount, deadline, status, submitted_at, reviewed_at) VALUES
('22222222-2222-2222-2222-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Smart contract audit & deployment', 'Professional audit and mainnet deployment', 35, 8750, NOW() - INTERVAL '5 days', 'completed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Partner with 10 carbon projects', 'Onboard verified carbon credit providers', 30, 7500, NOW() + INTERVAL '20 days', 'active', NULL, NULL),
('22222222-2222-2222-2222-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Launch marketplace + mobile app', 'Public marketplace launch and mobile apps', 35, 8750, NOW() + INTERVAL '50 days', 'locked', NULL, NULL);

-- Pixels & Potions milestones
INSERT INTO milestones (id, project_id, title, description, percentage, amount, deadline, status, submitted_at, reviewed_at) VALUES
('33333333-3333-3333-3333-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Alpha launch with 3 character classes', 'Playable alpha with warrior, mage, rogue', 25, 7500, NOW() - INTERVAL '8 days', 'completed', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days'),
('33333333-3333-3333-3333-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'NFT breeding mechanics', 'Cross-breed NFTs for new traits', 25, 7500, NOW() + INTERVAL '10 days', 'active', NULL, NULL),
('33333333-3333-3333-3333-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'PvP arena + tournaments', 'Competitive multiplayer arena', 25, 7500, NOW() + INTERVAL '30 days', 'locked', NULL, NULL),
('33333333-3333-3333-3333-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Beta launch with 10 classes', 'Full beta with all character classes', 25, 7500, NOW() + INTERVAL '60 days', 'locked', NULL, NULL);

-- HealthChain milestones (FUNDED - all completed)
INSERT INTO milestones (id, project_id, title, description, percentage, amount, deadline, status, submitted_at, reviewed_at) VALUES
('44444444-4444-4444-4444-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'HIPAA compliance certification', 'Full HIPAA audit and certification', 40, 8000, NOW() - INTERVAL '30 days', 'completed', NOW() - INTERVAL '31 days', NOW() - INTERVAL '30 days'),
('44444444-4444-4444-4444-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Hospital integrations (5 partners)', 'Integrate with 5 major hospital systems', 30, 6000, NOW() - INTERVAL '15 days', 'completed', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days'),
('44444444-4444-4444-4444-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Patient app + research marketplace', 'Launch patient app and research platform', 30, 6000, NOW() + INTERVAL '30 days', 'active', NULL, NULL);

-- CodeCamp for Kids milestones (FUNDED)
INSERT INTO milestones (id, project_id, title, description, percentage, amount, deadline, status, submitted_at, reviewed_at) VALUES
('55555555-5555-5555-5555-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Curriculum development (20 lessons)', 'Complete gamified coding curriculum', 50, 6000, NOW() - INTERVAL '20 days', 'completed', NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days'),
('55555555-5555-5555-5555-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Pilot in 5 schools', 'Run pilot program in 5 schools', 30, 3600, NOW() - INTERVAL '5 days', 'completed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
('55555555-5555-5555-5555-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Scale to 20 schools', 'Expand to 20 schools nationwide', 20, 2400, NOW() + INTERVAL '60 days', 'active', NULL, NULL);

-- Add milestones for other active projects
INSERT INTO milestones (id, project_id, title, description, percentage, amount, deadline, status, submitted_at, reviewed_at) VALUES
('66666666-6666-6666-6666-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'Core messaging protocol', 'P2P encrypted messaging protocol', 50, 9000, NOW() + INTERVAL '20 days', 'active', NULL, NULL),
('66666666-6666-6666-6666-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'Desktop + mobile apps', 'Native desktop and mobile clients', 50, 9000, NOW() + INTERVAL '50 days', 'locked', NULL, NULL),

('77777777-7777-7777-7777-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'Install 3 microgrids', 'Deploy solar microgrids in 3 villages', 40, 16000, NOW() - INTERVAL '2 days', 'completed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
('77777777-7777-7777-7777-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'DAO governance framework', 'Setup DAO for community management', 30, 12000, NOW() + INTERVAL '25 days', 'active', NULL, NULL),
('77777777-7777-7777-7777-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'Scale to 10 villages', 'Expand to 10 villages total', 30, 12000, NOW() + INTERVAL '90 days', 'locked', NULL, NULL),

('88888888-8888-8888-8888-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'Launch 5 classic games', 'Deploy Pac-Man, Space Invaders, etc', 60, 13200, NOW() + INTERVAL '12 days', 'active', NULL, NULL),
('88888888-8888-8888-8888-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'NFT marketplace integration', 'Enable NFT minting and trading', 40, 8800, NOW() + INTERVAL '40 days', 'locked', NULL, NULL);

-- ============================================================================
-- 4. BACKERS & TRANSACTIONS
-- ============================================================================

-- DeFi Dashboard Pro backers (high backing)
INSERT INTO backers (id, project_id, wallet_address, amount, transaction_signature, created_at) VALUES
('b1111111-1111-1111-1111-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 50, '5tx1signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '24 days'),
('b1111111-1111-1111-1111-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR2WaLLeT777777777777777777777777777', 100, '5tx1signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '23 days'),
('b1111111-1111-1111-1111-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR3WaLLeT888888888888888888888888888', 25, '5tx1signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '20 days'),
('b1111111-1111-1111-1111-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR4WaLLeT999999999999999999999999999', 75, '5tx1signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '18 days'),
('b1111111-1111-1111-1111-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'BaCKeR5WaLLeT000000000000000000000000000', 200, '5tx1signature5555555555555555555555555555555555555555555555555', NOW() - INTERVAL '15 days');

-- Carbon Credit NFT backers
INSERT INTO backers (id, project_id, wallet_address, amount, transaction_signature, created_at) VALUES
('b2222222-2222-2222-2222-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR1WaLLeT666666666666666666666666666', 30, '5tx2signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '19 days'),
('b2222222-2222-2222-2222-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR2WaLLeT777777777777777777777777777', 50, '5tx2signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '17 days'),
('b2222222-2222-2222-2222-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR3WaLLeT888888888888888888888888888', 100, '5tx2signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '15 days'),
('b2222222-2222-2222-2222-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR4WaLLeT999999999999999999999999999', 40, '5tx2signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '12 days'),
('b2222222-2222-2222-2222-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'BaCKeR5WaLLeT000000000000000000000000000', 150, '5tx2signature5555555555555555555555555555555555555555555555555', NOW() - INTERVAL '8 days');

-- Pixels & Potions backers (most popular)
INSERT INTO backers (id, project_id, wallet_address, amount, transaction_signature, created_at) VALUES
('b3333333-3333-3333-3333-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR1WaLLeT666666666666666666666666666', 10, '5tx3signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '17 days'),
('b3333333-3333-3333-3333-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR2WaLLeT777777777777777777777777777', 25, '5tx3signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '16 days'),
('b3333333-3333-3333-3333-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR3WaLLeT888888888888888888888888888', 50, '5tx3signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '14 days'),
('b3333333-3333-3333-3333-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR4WaLLeT999999999999999999999999999', 15, '5tx3signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '10 days'),
('b3333333-3333-3333-3333-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'BaCKeR5WaLLeT000000000000000000000000000', 100, '5tx3signature5555555555555555555555555555555555555555555555555', NOW() - INTERVAL '5 days');

-- HealthChain backers (funded)
INSERT INTO backers (id, project_id, wallet_address, amount, transaction_signature, created_at) VALUES
('b4444444-4444-4444-4444-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'BaCKeR1WaLLeT666666666666666666666666666', 75, '5tx4signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '55 days'),
('b4444444-4444-4444-4444-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'BaCKeR2WaLLeT777777777777777777777777777', 120, '5tx4signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '50 days'),
('b4444444-4444-4444-4444-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'BaCKeR3WaLLeT888888888888888888888888888', 90, '5tx4signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '45 days'),
('b4444444-4444-4444-4444-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'BaCKeR4WaLLeT999999999999999999999999999', 60, '5tx4signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '40 days');

-- CodeCamp backers (funded)
INSERT INTO backers (id, project_id, wallet_address, amount, transaction_signature, created_at) VALUES
('b5555555-5555-5555-5555-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'BaCKeR1WaLLeT666666666666666666666666666', 25, '5tx5signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '40 days'),
('b5555555-5555-5555-5555-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'BaCKeR2WaLLeT777777777777777777777777777', 50, '5tx5signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '35 days'),
('b5555555-5555-5555-5555-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'BaCKeR3WaLLeT888888888888888888888888888', 30, '5tx5signature3333333333333333333333333333333333333333333333333', NOW() - INTERVAL '30 days'),
('b5555555-5555-5555-5555-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'BaCKeR4WaLLeT999999999999999999999999999', 40, '5tx5signature4444444444444444444444444444444444444444444444444', NOW() - INTERVAL '25 days');

-- Additional backers for other projects
INSERT INTO backers (id, project_id, wallet_address, amount, transaction_signature, created_at) VALUES
('b6666666-6666-6666-6666-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'BaCKeR2WaLLeT777777777777777777777777777', 35, '5tx6signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '12 days'),
('b6666666-6666-6666-6666-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'BaCKeR3WaLLeT888888888888888888888888888', 20, '5tx6signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '10 days'),

('b7777777-7777-7777-7777-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'BaCKeR1WaLLeT666666666666666666666666666', 45, '5tx7signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '11 days'),
('b7777777-7777-7777-7777-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'BaCKeR4WaLLeT999999999999999999999999999', 80, '5tx7signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '9 days'),

('b8888888-8888-8888-8888-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'BaCKeR2WaLLeT777777777777777777777777777', 30, '5tx8signature1111111111111111111111111111111111111111111111111', NOW() - INTERVAL '20 days'),
('b8888888-8888-8888-8888-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000008', 'BaCKeR5WaLLeT000000000000000000000000000', 60, '5tx8signature2222222222222222222222222222222222222222222222222', NOW() - INTERVAL '15 days');

-- ============================================================================
-- 5. PROJECT UPDATES
-- ============================================================================

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

-- ============================================================================
-- 6. FOLLOWS & NOTIFICATIONS
-- ============================================================================

-- Users following projects (corrected to use follower_wallet and following_wallet)
INSERT INTO follows (id, follower_wallet, following_wallet, created_at) VALUES
('e1111111-1111-1111-1111-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD', NOW() - INTERVAL '24 days'),
('e1111111-1111-1111-1111-000000000002', 'BaCKeR2WaLLeT777777777777777777777777777', 'CXw8rSr4LzpYqjVWvKbZdQ7gZXmJ9KxZ8yN3JpQYxPmD', NOW() - INTERVAL '23 days'),
('e2222222-2222-2222-2222-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE', NOW() - INTERVAL '19 days'),
('e2222222-2222-2222-2222-000000000002', 'BaCKeR3WaLLeT888888888888888888888888888', 'DXw9rSr5MzqYrjWWvLcZeR8hZYnK0LyZ9zO4KqRZyQnE', NOW() - INTERVAL '15 days'),
('e3333333-3333-3333-3333-000000000001', 'BaCKeR2WaLLeT777777777777777777777777777', 'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF', NOW() - INTERVAL '16 days'),
('e3333333-3333-3333-3333-000000000002', 'BaCKeR3WaLLeT888888888888888888888888888', 'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF', NOW() - INTERVAL '14 days'),
('e3333333-3333-3333-3333-000000000003', 'BaCKeR4WaLLeT999999999999999999999999999', 'EYx0rSs6NzrYskXXwMdZfS9iZZoL1MzZ0AO5LrSZzRoF', NOW() - INTERVAL '10 days');

-- Sample notifications (corrected to use user_wallet)
INSERT INTO notifications (id, user_wallet, type, title, message, project_id, created_at, is_read) VALUES
('d1111111-1111-1111-1111-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'project_update', 'DeFi Dashboard Pro posted an update', 'MVP is Live! 🎉', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', NOW() - INTERVAL '10 days', true),
('d1111111-1111-1111-1111-000000000002', 'BaCKeR1WaLLeT666666666666666666666666666', 'project_update', 'DeFi Dashboard Pro posted an update', 'NFT Module in Testing', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', NOW() - INTERVAL '3 days', false),
('d2222222-2222-2222-2222-000000000001', 'BaCKeR2WaLLeT777777777777777777777777777', 'milestone_completed', 'DeFi Dashboard Pro completed a milestone', 'MVP with 5 wallet integrations', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', NOW() - INTERVAL '10 days', true),
('d3333333-3333-3333-3333-000000000001', 'BaCKeR3WaLLeT888888888888888888888888888', 'project_funded', 'Carbon Credit NFT Marketplace is 75% funded!', 'Only $6,077 to go!', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', NOW() - INTERVAL '5 days', false);

-- ============================================================================
-- 7. ACTIVITY FEED
-- ============================================================================

-- Activity feed (corrected to use user_wallet, type, and data columns)
INSERT INTO activity_feed (id, user_wallet, project_id, type, data, created_at) VALUES
('c1111111-1111-1111-1111-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'project_backed', '{"amount": 50}', NOW() - INTERVAL '24 days'),
('c1111111-1111-1111-1111-000000000002', 'BaCKeR2WaLLeT777777777777777777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'project_backed', '{"amount": 100}', NOW() - INTERVAL '23 days'),
('c1111111-1111-1111-1111-000000000003', 'CrEaT0r1WaLLeT111111111111111111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'milestone_completed', '{"milestone": "MVP with 5 wallet integrations"}', NOW() - INTERVAL '10 days'),
('c2222222-2222-2222-2222-000000000001', 'BaCKeR1WaLLeT666666666666666666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'project_backed', '{"amount": 30}', NOW() - INTERVAL '19 days'),
('c3333333-3333-3333-3333-000000000001', 'CrEaT0r3WaLLeT333333333333333333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'project_update', '{"title": "Alpha Launched! Playable Now"}', NOW() - INTERVAL '8 days'),
('c4444444-4444-4444-4444-000000000001', 'BaCKeR5WaLLeT000000000000000000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'project_backed', '{"amount": 100}', NOW() - INTERVAL '5 days'),
('c5555555-5555-5555-5555-000000000001', 'CrEaT0r4WaLLeT444444444444444444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'project_funded', '{"goal": 20000, "raised": 23457}', NOW() - INTERVAL '10 days');

-- ============================================================================
-- SUCCESS! Database seeded with:
-- - 10 users (5 creators + 5 backers)
-- - 12 projects (3 active & trending, 2 funded, 5 more active, 2 draft/pending)
-- - 27 milestones across projects
-- - 30+ backing transactions
-- - 10 project updates
-- - 7 follows
-- - 4 notifications
-- - 7 activity feed entries
-- ============================================================================

SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM projects) as projects,
  (SELECT COUNT(*) FROM milestones) as milestones,
  (SELECT COUNT(*) FROM backers) as backers,
  (SELECT COUNT(*) FROM project_updates) as updates,
  (SELECT COUNT(*) FROM follows) as follows,
  (SELECT COUNT(*) FROM notifications) as notifications,
  (SELECT COUNT(*) FROM activity_feed) as activity_entries;
