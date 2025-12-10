-- ============================================================================
-- Migration: Add campaign_id, campaign_pda, and initialize_tx to projects
-- ============================================================================
-- 
-- Run this in Supabase SQL Editor if you already have the schema created
-- This adds the missing blockchain-related columns
--
-- ============================================================================

-- Add campaign_id column (stores the on-chain campaign ID)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS campaign_id integer;

-- Add campaign_pda column (stores the on-chain campaign PDA address)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS campaign_pda text;

-- Add initialize_tx column (stores the initialization transaction signature)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS initialize_tx text;

-- Create index for faster lookups by campaign_id
CREATE INDEX IF NOT EXISTS idx_projects_campaign_id ON public.projects(campaign_id);

-- Create index for faster lookups by campaign_pda
CREATE INDEX IF NOT EXISTS idx_projects_campaign_pda ON public.projects(campaign_pda);

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
  AND column_name IN ('campaign_id', 'campaign_pda', 'initialize_tx')
ORDER BY column_name;
