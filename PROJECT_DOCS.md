# 📋 OneDollarVentures (ODV) - Complete Project Documentation

> **Consolidated from 35+ documentation files**  
> **Last Updated:** December 5, 2025  
> **For credentials and secrets, see:** `SECRETS.md`

---

## 🎯 What is OneDollarVentures?

**OneDollarVentures (ODV)** is a Web3 crowdfunding platform where backers support projects with exactly **$1 USDC**. Built on **SOON Network** (Solana L2 rollup), it features milestone-based fund release ensuring creators deliver before receiving funds.

### Core Philosophy
- **Fixed $1 backing** - Enforced on-chain, no variable amounts
- **Milestone-based release** - Funds unlock as creators deliver
- **Community curation** - Admin review ensures quality projects
- **Transparent escrow** - All funds held in smart contracts
- **Low barrier** - Anyone can be a venture capitalist for $1

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15.1.9, React 19.2.1, TypeScript |
| **Styling** | TailwindCSS 4, shadcn/ui, Radix UI |
| **Blockchain** | SOON Testnet (SVM rollup), Anchor Framework |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Wallet-based (Phantom, Solflare, 10+ wallets) |
| **State** | React Query, Zustand |
| **Deployment** | Vercel |
| **Testing** | Vitest |

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| Lines of Code | ~28,000 |
| Pages | 40+ |
| API Endpoints | 32 |
| React Components | 93 |
| Custom Hooks | 6 |
| Smart Contract Instructions | 11 |

---

## ✅ Completed Features

### Core Functionality
- ✅ **Project Submission** - Multi-step form with milestones
- ✅ **Project Discovery** - Search, filter, sort by category/status
- ✅ **$1 Backing** - Blockchain-enforced via smart contract
- ✅ **Milestone Management** - Submit proof, admin approval
- ✅ **Test USDC Faucet** - 100 tokens per request, 4hr cooldown

### User Dashboards
- ✅ **Creator Dashboard** - Projects, stats, milestone tracking
- ✅ **Backer Dashboard** - Backed projects, activity history
- ✅ **Admin Dashboard** - Queue review, bulk actions
- ✅ **Smart Routing** - Auto-detects user type

### Security & Auth
- ✅ Wallet authentication (10+ wallets supported)
- ✅ Admin wallet-gated access
- ✅ CVE-2025-55182 patched
- ✅ Environment variables secured

### User Experience
- ✅ Mobile responsive (all pages)
- ✅ Dark mode
- ✅ Loading states & skeleton loaders
- ✅ Toast notifications
- ✅ Error handling with recovery suggestions

---

## 🔗 Smart Contract Overview

### Deployment Info
- **Network:** SOON Testnet
- **Program ID:** `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA`
- **Admin:** `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`

### Instructions (11 total)
1. `initialize_platform` - One-time setup (admin)
2. `update_backing_amount` - Change fixed amount (admin)
3. `pause_platform` - Emergency stop (admin)
4. `unpause_platform` - Resume operations (admin)
5. `initialize` - Create campaign (creator)
6. `fund` - Back project with $1 (backer)
7. `submit_milestone_proof` - Submit proof (creator)
8. `approve_milestone` - Approve proof (admin)
9. `reject_milestone` - Reject proof (admin)
10. `release_milestone` - Release funds (creator)
11. `refund_campaign` - Refund failed campaign (backer)

### Security Features
- Fixed $1 backing (on-chain enforced)
- Creator signature required for withdrawals
- Goal validation before fund release
- Emergency pause capability
- Automatic refund for failed campaigns

---

## 📁 Project Structure

```
odv/
├── src/
│   ├── app/                     # Next.js pages (40+)
│   │   ├── api/                 # API routes (32)
│   │   ├── admin/               # Admin pages
│   │   ├── dashboard/           # Creator & Backer dashboards
│   │   ├── discover/            # Project discovery
│   │   ├── project/[id]/        # Project details
│   │   ├── submit/              # Project submission
│   │   └── faucet/              # Test USDC faucet
│   ├── components/              # React components (93)
│   │   ├── ui/                  # shadcn/ui components
│   │   └── providers/           # Context providers
│   └── lib/
│       ├── solana/              # Blockchain integration (12 files)
│       │   ├── sdk.ts           # ODVProgramSDK wrapper
│       │   ├── transaction.ts   # Transaction builders
│       │   ├── config.ts        # Network config
│       │   ├── hooks.ts         # React Query hooks
│       │   └── idl/             # Contract IDL
│       ├── supabase/            # Database client
│       ├── hooks/               # Custom hooks (6)
│       └── types/               # TypeScript definitions
├── anchor/
│   └── programs/odv_escrow/     # Rust smart contract
├── public/                      # Static assets
└── __tests__/                   # Vitest tests
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `projects` | Project data, status, funding goals |
| `milestones` | Milestone tracking with proof URLs |
| `backings` / `backers` | User backing records |
| `users` | User profiles and settings |
| `comments` | Project comments |
| `notifications` | User notifications |
| `transactions` | Blockchain tx records |
| `activity_feed` | Platform activity stream |
| `follows` | Social following system |
| `messages` | Direct messaging |

---

## 📡 Key API Endpoints

### Projects
```
GET    /api/projects              # List with filters
POST   /api/projects              # Create project
GET    /api/projects/[id]         # Get details
PUT    /api/projects/[id]         # Update
DELETE /api/projects/[id]         # Delete
```

### Backing
```
POST   /api/backing/[projectId]   # Record backing
GET    /api/backing/[projectId]   # Check status
```

### Admin
```
GET    /api/admin/projects/queue  # Pending projects
POST   /api/admin/projects/[id]/approve
POST   /api/admin/projects/[id]/reject
GET    /api/admin/milestones      # Milestones for review
POST   /api/admin/milestones/[id]/approve
POST   /api/admin/milestones/[id]/reject
```

### Faucet
```
GET    /api/faucet                # Get faucet info
POST   /api/faucet                # Request test USDC
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Solana wallet (Phantom, Solflare)

### Installation
```bash
# Clone repository
git clone https://github.com/slubbles/odv.git
cd odv

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

### Build & Deploy
```bash
# Build for production
pnpm build

# Run production server locally
pnpm start

# Deploy to Vercel
git push origin deployed-soon-testnet-frontend-integrated
```

### Smart Contract Deployment
```bash
cd anchor

# Configure for SOON Testnet
solana config set --url https://rpc.testnet.soo.network/rpc

# Build
anchor build

# Deploy
anchor deploy

# Initialize platform (one-time)
npx ts-node scripts/initialize-platform.ts
```

---

## 🌐 Network Configuration

### SOON Testnet (Primary)
| Resource | URL |
|----------|-----|
| RPC | `https://rpc.testnet.soo.network/rpc` |
| Explorer | `https://explorer.testnet.soo.network` |
| Faucet (SOL) | `https://faucet.soo.network/` |

### Why SOON Network?
- **90% lower fees** than Solana mainnet
- **Faster finality** than devnet
- **100% Solana compatible** - same tools, wallets, contracts
- **Ethereum L2 benefits** with Solana UX

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/__tests__/back-project.test.ts
```

### Test Files
- `network-config.test.ts` - Network configuration tests
- `api-routes.test.ts` - API endpoint tests
- `back-project.test.ts` - Backing flow tests
- `error-handling.test.ts` - Error handling tests
- `notifications.test.ts` - Notification tests
- `admin-operations.test.ts` - Admin functionality tests

---

## 📱 User Flows

### For Backers
1. Browse projects (no wallet required)
2. Connect wallet (Phantom/Solflare)
3. Get Test USDC from faucet
4. Back project with $1
5. Track backed projects in dashboard

### For Creators
1. Connect wallet
2. Submit project with milestones
3. Wait for admin approval
4. Receive backing once approved
5. Submit milestone proofs
6. Release funds after approval

### For Admins
1. Connect admin wallet
2. Review project queue
3. Approve/reject projects
4. Review milestone submissions
5. Approve/reject milestones
6. Emergency pause if needed

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript settings |
| `vitest.config.ts` | Test configuration |
| `eslint.config.mjs` | Linting rules |
| `postcss.config.mjs` | PostCSS/Tailwind |
| `components.json` | shadcn/ui config |
| `anchor/Anchor.toml` | Anchor/Solana config |

---

## 🚧 Known Limitations & TODOs

### Low Priority Items
| File | Task |
|------|------|
| `withdraw/route.ts` | Implement refund trigger |
| `submit-milestone-proof.tsx` | Connect to API |
| `withdraw-funds-modal.tsx` | Add Solana tx |
| `post-update-form.tsx` | Connect to API |

### Future Enhancements
| Feature | Priority |
|---------|----------|
| Messaging system | Medium |
| NFT badge minting | Medium |
| Email notifications | Low |
| Analytics dashboard | Low |
| Multi-language (i18n) | Low |

---

## 📈 Scaling Notes

**Current architecture handles:**
- Up to 10k+ users
- Auto-scaling via Vercel
- Managed database via Supabase

**Need dedicated backend when adding:**
- WebSockets (live updates, chat)
- Background jobs (scheduled tasks)
- Heavy computation (image processing)
- Blockchain listeners (real-time tx)

---

## 🔄 Development Timeline

| Date | Milestone |
|------|-----------|
| Nov 2025 | Project setup, UI components |
| Dec 1 | Smart contract deployed to SOON Testnet |
| Dec 2 | Frontend blockchain integration |
| Dec 3 | Admin panel, API fixes |
| Dec 4 | Security patch, Vercel deployment |
| Dec 5 | Mobile optimization, faucet, docs |

---

## 📚 Original Documentation Files

This document consolidates the following files:
- `README.md` - Basic project info
- `PROJECT_SUMMARY.md` - Project summary
- `PROJECT_STATUS_REPORT.md` - Comprehensive status
- `QUICK_START.md` - Getting started guide
- `API_REFERENCE.md` - API documentation
- `BACKEND_SETUP.md` - Backend configuration
- `BACKEND_INTEGRATION_REPORT.md` - Backend integration
- `DEPLOYMENT.md` - Deployment guide
- `DEPLOYMENT_SUCCESS.md` - Deployment notes
- `DEPLOY_NOW.md` - Quick deploy guide
- `DEVNET_DEPLOYMENT_COMPLETE.md` - Devnet deployment
- `SOON_NETWORK_QUICK_REF.md` - SOON quick reference
- `SOON_TESTNET_DEPLOYMENT.md` - SOON deployment guide
- `SOON_TESTNET_DEPLOYMENT_SESSION.md` - Deployment session
- `SOON_NETWORK_MIGRATION.md` - Migration guide
- `SOON_NETWORK_INTEGRATION_SUMMARY.md` - Integration summary
- `SOON_DEPLOYMENT_STATUS.md` - Deployment status
- `SOON_DEPLOYMENT_ISSUE.md` - Issues resolved
- `SOON_QUICK_REF.md` - Quick reference
- `SOON_CHECKLIST.md` - Deployment checklist
- `SMART_CONTRACT_SETUP_COMPLETE.md` - Contract setup
- `SMART_CONTRACT_SECURITY_FIXES.md` - Security fixes
- `SMART_CONTRACT_USER_FLOW.md` - User flow
- `TESTING_GUIDE.md` - Testing guide
- `TESTING_STEP_BY_STEP.md` - Step-by-step testing
- `TESTNET_DEPLOYMENT_GUIDE.md` - Testnet guide
- `INTERACTIVITY_AUDIT.md` - UI audit
- `MOBILE_OPTIMIZATION_PLAN.md` - Mobile fixes
- `UI_REFINEMENT_PLAN.md` - UI improvements
- `CLEANUP_SUMMARY.md` - Cleanup notes
- `CLEANUP_COMPLETE.md` - Cleanup completion
- `GIT_PUSH_GUIDE.md` - Git workflow
- `BACKING_FLOW_FIX.md` - Backing bug fix
- `CODEBASE_COMPREHENSIVE_CONTEXT.md` - Full context

**Excluded:** `DESIGN_SYSTEM.md` (separate design reference)

---

## ✨ Quick Links

| Resource | URL |
|----------|-----|
| SOON Explorer | https://explorer.testnet.soo.network |
| SOON Faucet | https://faucet.soo.network |
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com/dashboard |
| Phantom Wallet | https://phantom.app |
| Solflare Wallet | https://solflare.com |

---

*Generated: December 5, 2025*
