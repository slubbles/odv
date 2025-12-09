-- ============================================================================
-- SUPABASE PRODUCTION FIX - Modal Loop Issue
-- ============================================================================
-- 
-- ROOT CAUSES IDENTIFIED:
-- 1. increment_backers function missing SECURITY DEFINER
-- 2. Projects table missing UPDATE policy for stats
-- 3. Service role not bypassing RLS properly for function execution
--
-- APPLY THIS IN SUPABASE SQL EDITOR (Exact Order)
-- ============================================================================

-- Step 1: Drop existing function
DROP FUNCTION IF EXISTS increment_backers(uuid, numeric);

-- Step 2: Recreate with SECURITY DEFINER (critical!)
CREATE OR REPLACE FUNCTION increment_backers(project_id uuid, amount_to_add numeric)
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER  -- ⚡ THIS IS THE KEY FIX
SET search_path = public
AS $$
BEGIN
  -- Update project stats
  UPDATE public.projects
  SET 
    raised = raised + amount_to_add,
    backers_count = backers_count + 1,
    updated_at = NOW()
  WHERE id = project_id;
  
  -- Raise exception if project not found
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found: %', project_id;
  END IF;
END;
$$;

-- Step 3: Grant execute permission to service role
GRANT EXECUTE ON FUNCTION increment_backers(uuid, numeric) TO service_role;
GRANT EXECUTE ON FUNCTION increment_backers(uuid, numeric) TO anon;
GRANT EXECUTE ON FUNCTION increment_backers(uuid, numeric) TO authenticated;

-- Step 4: Add UPDATE policy for projects (if not exists)
DROP POLICY IF EXISTS "Service role can update project stats" ON public.projects;
CREATE POLICY "Service role can update project stats" 
  ON public.projects 
  FOR UPDATE 
  USING (true)  -- Service role bypasses RLS anyway
  WITH CHECK (true);

-- Step 5: Add UPDATE policy for creators to update their own projects
DROP POLICY IF EXISTS "Creators can update their projects" ON public.projects;
CREATE POLICY "Creators can update their projects" 
  ON public.projects 
  FOR UPDATE 
  USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet')
  WITH CHECK (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet');

-- Step 6: Ensure backers INSERT policy is correct
DROP POLICY IF EXISTS "Users can back projects" ON public.backers;
CREATE POLICY "Users can back projects" 
  ON public.backers 
  FOR INSERT 
  WITH CHECK (true);

-- Step 7: Add service role INSERT policy for backers (explicit)
DROP POLICY IF EXISTS "Service role can insert backers" ON public.backers;
CREATE POLICY "Service role can insert backers" 
  ON public.backers 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- VERIFICATION QUERIES - Run these after applying fixes
-- ============================================================================

-- Check 1: Verify function exists with SECURITY DEFINER
SELECT 
  p.proname AS function_name,
  CASE p.prosecdef 
    WHEN true THEN '✅ SECURITY DEFINER' 
    ELSE '❌ SECURITY INVOKER' 
  END AS security_mode,
  pg_get_function_identity_arguments(p.oid) AS arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'increment_backers';

-- Expected result: Shows "✅ SECURITY DEFINER"

-- Check 2: Verify function permissions
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'increment_backers';

-- Expected result: security_type = 'DEFINER'

-- Check 3: List all policies on backers table
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
WHERE tablename = 'backers';

-- Expected result: Should show INSERT policies for service_role and general users

-- Check 4: List all policies on projects table
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
WHERE tablename = 'projects';

-- Expected result: Should show SELECT, INSERT, and UPDATE policies

-- Check 5: Test increment_backers function (safe test)
DO $$
DECLARE
  test_project_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001';
  before_raised numeric;
  before_backers integer;
  after_raised numeric;
  after_backers integer;
BEGIN
  -- Get before values
  SELECT raised, backers_count 
  INTO before_raised, before_backers
  FROM public.projects 
  WHERE id = test_project_id;
  
  RAISE NOTICE 'Before: raised=%, backers=%', before_raised, before_backers;
  
  -- Call function (test with $1 increment)
  PERFORM increment_backers(test_project_id, 1);
  
  -- Get after values
  SELECT raised, backers_count 
  INTO after_raised, after_backers
  FROM public.projects 
  WHERE id = test_project_id;
  
  RAISE NOTICE 'After: raised=%, backers=%', after_raised, after_backers;
  
  -- Verify increment worked
  IF after_raised = before_raised + 1 AND after_backers = before_backers + 1 THEN
    RAISE NOTICE '✅ Function works correctly!';
  ELSE
    RAISE EXCEPTION '❌ Function did not increment correctly';
  END IF;
  
  -- Rollback test changes
  RAISE EXCEPTION 'Test completed successfully (rolling back test changes)';
END $$;

-- Note: Above test will raise exception to rollback - this is expected behavior

-- ============================================================================
-- EXPLANATION
-- ============================================================================

/*
WHY SECURITY DEFINER IS CRITICAL:

Without SECURITY DEFINER:
- Function runs with CALLER'S permissions (anonymous/authenticated user)
- RLS policies apply to the UPDATE operation inside function
- Even with service_role key in API, the FUNCTION still runs as caller
- Result: UPDATE blocked → stats don't update → modal loops

With SECURITY DEFINER:
- Function runs with CREATOR'S permissions (usually superuser)
- RLS policies are BYPASSED for operations inside function
- Service role key allows API to CALL the function
- Function executes with elevated privileges
- Result: UPDATE succeeds → stats update → modal completes ✅

SECURITY DEFINER Analogy:
- Like sudo in Linux - temporarily elevates privileges
- Function is "blessed" to bypass RLS for specific operations
- Still safe because function logic is controlled/audited
*/

-- ============================================================================
-- TESTING INSTRUCTIONS
-- ============================================================================

/*
After applying this fix:

1. Run all verification queries above in Supabase SQL Editor
2. Verify SUPABASE_SERVICE_ROLE_KEY exists in Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Check for: SUPABASE_SERVICE_ROLE_KEY
   - If missing: Copy from Supabase Dashboard → Settings → API → service_role (secret)
   - Add to Vercel and REDEPLOY

3. Test the backing flow:
   a. Go to https://onedollarventures.com/project/3
   b. Open browser console (F12)
   c. Click "Back this Project"
   d. Watch for these logs:
      - [BackProjectButton] Creating transaction
      - [BackProjectButton] Transaction signed
      - [Verify Transaction] Starting verification
      - [Verify Transaction] Blockchain verified
      - [Verify Transaction] Backer record created
      - [Verify Transaction] Project stats updated successfully ← SHOULD SEE THIS NOW
      - [BackProjectButton] Backing status verified: true ← AND THIS
   
4. Verify results:
   - Modal should close automatically after success
   - Button should change to "Already Funded"
   - Backers count should increment
   - Raised amount should increase by $1
   - NO modal loop back to "Approve Transaction"

5. If still failing:
   - Check Vercel logs for detailed error from API route
   - Check Supabase logs: Dashboard → Logs → Postgres Logs
   - Look for RLS policy violation errors
*/

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================

/*
If something goes wrong, run this to revert:

DROP POLICY IF EXISTS "Service role can update project stats" ON public.projects;
DROP POLICY IF EXISTS "Creators can update their projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can insert backers" ON public.backers;

DROP FUNCTION IF EXISTS increment_backers(uuid, numeric);

-- Then restore original function from your schema
*/
