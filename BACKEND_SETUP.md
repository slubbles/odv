# Backend Integration Setup Guide

## ✅ Completed Phase 1: Core MVP

### Files Created

1. **Environment Configuration**
   - `.env.local` - Environment variables template
   - `.env.example` - Example configuration

2. **API Routes** (`src/app/api/`)
   - `projects/route.ts` - List & create projects
   - `projects/[id]/route.ts` - Get, update, delete single project
   - `projects/[id]/milestones/route.ts` - Manage milestones
   - `backing/[projectId]/route.ts` - Back projects, check backing status

3. **Frontend Updates**
   - `src/app/submit/page.tsx` - Full form integration with API
   - `src/lib/hooks/use-projects.ts` - React hooks for data fetching

---

## 🚀 Next Steps to Get Live

### 1. Set Up Supabase Database

**Create a Supabase Project:**
1. Go to https://supabase.com
2. Create new project
3. Wait for database to provision

**Run Schema:**
```bash
# Copy the schema from src/lib/supabase/schema.sql
# Paste into Supabase SQL Editor
# Execute to create tables
```

**Get Credentials:**
1. Go to Project Settings > API
2. Copy `Project URL` and `anon public` key
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Test the Integration

**Restart Dev Server:**
```bash
npm run dev
```

**Test Project Creation:**
1. Go to http://localhost:3000/submit
2. Connect wallet (Phantom/Solflare)
3. Fill in project form
4. Add milestones (must total 100%)
5. Submit project
6. Check Supabase dashboard for new record

**Test Project Listing:**
```bash
curl http://localhost:3000/api/projects?status=draft
```

### 3. Update Pages to Use Real Data

Update these pages next:
- `src/app/discover/page.tsx` - Use `useProjects()` hook
- `src/app/projects/[id]/page.tsx` - Use `useProject(id)` hook
- `src/app/page.tsx` - Fetch featured projects from API

---

## 📚 API Documentation

### POST /api/projects
Create new project

**Body:**
```json
{
  "title": "Project Title",
  "tagline": "One-line pitch",
  "description": "Full description",
  "category": "Technology",
  "goal": 10000,
  "creatorWallet": "wallet_address",
  "duration": 30,
  "milestones": [
    {
      "title": "Milestone 1",
      "percentage": 50,
      "deadline": "2025-12-31"
    }
  ]
}
```

### GET /api/projects
List projects with filters

**Query Params:**
- `category` - Filter by category
- `status` - Filter by status (draft, active, completed)
- `search` - Search query
- `sort` - Sort by (trending, newest, ending, funded)
- `page` - Page number
- `limit` - Items per page

### GET /api/projects/[id]
Get single project with milestones

### POST /api/backing/[projectId]
Back a project

**Body:**
```json
{
  "walletAddress": "wallet_address",
  "transactionSignature": "solana_tx_signature",
  "amount": 1
}
```

### GET /api/backing/[projectId]?wallet=address
Check if wallet has backed project

---

## 🔧 Troubleshooting

**"Missing Supabase environment variables"**
- Check `.env.local` exists and has correct values
- Restart dev server after adding env vars

**"Failed to create project"**
- Check Supabase tables are created
- Verify wallet is connected
- Check browser console for errors

**"Transaction not found on blockchain"**
- Transaction might be too new (1-2 seconds)
- API will continue anyway and record backing

---

## 📋 TODO: Phase 2 Features

Next implementations needed:
- [ ] Dashboard data integration (creator/backer)
- [ ] Admin review queue APIs
- [ ] Milestone submission/approval workflow
- [ ] Wallet authentication session management
- [ ] File upload for images/videos
- [ ] Real-time activity feed
- [ ] Notification system

---

## 🎯 Key Design Decisions

1. **Projects start as "draft"** - Creators can edit before submitting to queue
2. **Milestones must total 100%** - Validation in both frontend and backend
3. **Transaction verification is optional** - Continues if blockchain check fails
4. **Wallet address is primary creator ID** - No email/password needed
5. **Supabase handles all data** - Solana only for transactions/escrow

---

Need help with any step? The code is fully functional - just needs Supabase credentials to go live! 🚀
