# SETUP INSTRUCTIONS

## Database Setup (Supabase)

The application currently returns a 500 error when submitting projects because the database schema is missing required columns.

### Quick Fix:

1. **Run the migration in Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/zsfujmvltpumleszcrwh/sql/new
   - Copy the contents of `/migrations/002_add_campaign_fields.sql`
   - Paste into SQL Editor
   - Click "Run" button
   - Verify the columns were added successfully

2. **Create `.env.local` file** in the project root (if not already done):
   ```bash
   cp .env.local.example .env.local
   ```

3. **Get your Supabase credentials** (if not already done):
   - Go to: https://zsfujmvltpumleszcrwh.supabase.co/project/_/settings/api
   - Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

4. **Restart the dev server**:
   ```bash
   npm run dev
   ```

### What the Error UI Shows:

✅ **Improved User Experience:**
- Clear error messages showing exactly where submission failed
- Blockchain transaction status with SOON testnet explorer link
- Database save status with retry options
- Contact support instructions with transaction signature for manual recovery

### The Database Error:

**Error**: `Could not find the 'campaign_id' column of 'projects' in the schema cache`

**Cause**: The `campaign_id`, `campaign_pda`, and `initialize_tx` columns are missing from your projects table

**Solution**: Run the migration script above (step 1)

### Deployment (Vercel):

Make sure these environment variables are set in Vercel:
1. Go to: https://vercel.com/slubbles/odv/settings/environment-variables
2. Add all three Supabase variables
3. Redeploy

### Testing Locally:

```bash
# Check if environment variables are loaded
npm run dev

# Try submitting a project
# If it fails, you'll see detailed error UI showing:
# - ✅ Blockchain Transaction: Completed (with tx signature)
# - ❌ Database Storage: Failed (with reason)
```

### Current Status:

- ✅ Blockchain transactions work correctly
- ✅ Error handling and UI feedback implemented
- ❌ Database connection needs Supabase credentials
- ⏳ Once credentials are added, full flow will work end-to-end
