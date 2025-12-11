# Supabase Setup Required

Your discover page shows **"0 projects"** because Supabase environment variables are not configured.

## Quick Fix

1. **Create `.env.local` file** in project root:
```bash
cd /workspaces/odv
cp .env.local.example .env.local
```

2. **Get your Supabase credentials** from:
   - URL: https://zsfujmvltpumleszcrwh.supabase.co/project/_/settings/api
   - Copy `Project URL` and `anon public` key

3. **Update `.env.local`**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://zsfujmvltpumleszcrwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_actual_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

4. **Restart dev server**:
```bash
# Stop current dev server (Ctrl+C)
pnpm dev
```

5. **Verify projects load**: Hard refresh /discover page (Ctrl+Shift+R)

## Checking Status

Run this in Supabase SQL Editor:
```sql
SELECT id, title, status, created_at 
FROM projects 
WHERE creator_wallet = '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw'
ORDER BY created_at DESC;
```

## Without Supabase

If Supabase isn't set up yet, the app uses **mock data**. Your real projects won't appear until database is connected.
