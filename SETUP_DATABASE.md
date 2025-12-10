# SETUP INSTRUCTIONS

## Database Setup (Supabase)

The application currently returns a 500 error when submitting projects because Supabase environment variables are not configured.

### Quick Fix:

1. **Create `.env.local` file** in the project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your Supabase credentials**:
   - Go to: https://zsfujmvltpumleszcrwh.supabase.co/project/_/settings/api
   - Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

3. **Restart the dev server**:
   ```bash
   npm run dev
   ```

### What the Error UI Now Shows:

✅ **Improved User Experience:**
- Clear error messages showing exactly where submission failed
- Blockchain transaction status with explorer link
- Database save status with retry options
- Contact support instructions with transaction signature for manual recovery

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
