-- ============================================================================
-- SUPABASE RLS & PERMISSIONS CHECK - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================================================

-- 1. CHECK IF BACKERS TABLE EXISTS
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'backers'
) as backers_table_exists;

-- 2. CHECK RLS STATUS ON BACKERS TABLE
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'backers';

-- 3. CHECK INSERT POLICIES ON BACKERS TABLE
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'backers'
AND cmd = 'INSERT';

-- 4. CHECK IF INCREMENT_BACKERS FUNCTION EXISTS
SELECT EXISTS (
    SELECT 1 
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'increment_backers'
) as function_exists;

-- 5. VIEW INCREMENT_BACKERS FUNCTION DEFINITION
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'increment_backers';

-- 6. CHECK PROJECTS TABLE UPDATE PERMISSIONS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'projects'
AND cmd = 'UPDATE';

-- 7. TEST INSERT INTO BACKERS (WILL FAIL IF RLS BLOCKS IT)
-- Replace with actual values to test
-- INSERT INTO public.backers (project_id, wallet_address, amount, transaction_signature)
-- VALUES (
--     'your-project-uuid',
--     'test-wallet-address',
--     1,
--     'test-signature-12345'
-- );

-- ============================================================================
-- FIXES TO APPLY IF NEEDED
-- ============================================================================

-- FIX 1: Enable RLS on backers table if disabled
-- ALTER TABLE public.backers ENABLE ROW LEVEL SECURITY;

-- FIX 2: Add INSERT policy for backers (if missing or too restrictive)
-- DROP POLICY IF EXISTS "Users can back projects" ON public.backers;
-- CREATE POLICY "Users can back projects"
--   ON public.backers FOR INSERT
--   WITH CHECK (true);

-- FIX 3: Add SELECT policy for backers (for verification)
-- DROP POLICY IF EXISTS "Backers are viewable by everyone" ON public.backers;
-- CREATE POLICY "Backers are viewable by everyone"
--   ON public.backers FOR SELECT
--   USING (true);

-- FIX 4: Ensure projects UPDATE policy allows RPC function
-- DROP POLICY IF EXISTS "Service role can update projects" ON public.projects;
-- CREATE POLICY "Service role can update projects"
--   ON public.projects FOR UPDATE
--   USING (true);

-- FIX 5: Create increment_backers function if missing
/*
CREATE OR REPLACE FUNCTION increment_backers(project_id uuid, amount_to_add numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.projects
  SET 
    raised = raised + amount_to_add,
    backers_count = backers_count + 1,
    updated_at = now()
  WHERE id = project_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found: %', project_id;
  END IF;
END;
$$;
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check recent backers
SELECT id, project_id, wallet_address, amount, created_at 
FROM public.backers 
ORDER BY created_at DESC 
LIMIT 10;

-- Check project stats
SELECT id, title, raised, backers_count, goal 
FROM public.projects 
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;

-- Check for orphaned transactions (tx succeeded but not recorded)
-- Look for signatures in your console logs that don't exist in backers table
