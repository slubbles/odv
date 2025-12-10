-- Migration: Add campaign_id and campaign_pda to projects table
-- Date: 2025-12-10
-- Description: Enable multiple campaigns per wallet by tracking campaign_id

-- Add campaign_id and campaign_pda columns
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS campaign_id bigint,
ADD COLUMN IF NOT EXISTS campaign_pda text;

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_projects_campaign_id ON public.projects(campaign_id);
CREATE INDEX IF NOT EXISTS idx_projects_campaign_pda ON public.projects(campaign_pda);
CREATE INDEX IF NOT EXISTS idx_projects_creator_campaign ON public.projects(creator_wallet, campaign_id);

-- Add comment for documentation
COMMENT ON COLUMN public.projects.campaign_id IS 'Unique campaign ID from on-chain platform config';
COMMENT ON COLUMN public.projects.campaign_pda IS 'On-chain PDA address of the campaign account';

-- Optional: Add constraint to ensure campaign_id is set for active projects
-- (Disabled by default - can be enabled after backfilling existing data)
-- ALTER TABLE public.projects 
-- ADD CONSTRAINT check_active_has_campaign 
-- CHECK (status NOT IN ('active', 'funded', 'completed') OR campaign_id IS NOT NULL);
