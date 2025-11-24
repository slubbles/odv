# Vercel Deployment Guide

## Issues Fixed

### 1. React 19 Peer Dependency Conflict
**Problem:** Next.js 15.0.3 didn't support React 19.2.0 stable  
**Solution:** Updated Next.js from `^15.0.3` to `^15.1.0` in `package.json`

### 2. Supabase Build-Time Errors
**Problem:** Supabase client threw errors during build when env vars were missing  
**Solution:** 
- Updated `src/lib/supabase/client.ts` to use placeholder values during build
- Updated `src/app/sitemap.ts` to gracefully handle missing Supabase credentials

## Next Steps for Vercel Deployment

### 1. Add Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Deploy

You can now deploy to Vercel:

```bash
git add .
git commit -m "Fix Vercel deployment issues"
git push origin master
```

Vercel will automatically detect the push and trigger a new deployment.

## Build Verified

The build now completes successfully locally:
- ✓ Compiled successfully
- ✓ Type checking passed
- ✓ All pages generated (14/14)
- ✓ Static and dynamic routes working

## Notes

- The build will work without Supabase env vars (using placeholders)
- At runtime, you **must** have proper Supabase credentials configured in Vercel
- The warning about `pino-pretty` is harmless (it's an optional dependency)
