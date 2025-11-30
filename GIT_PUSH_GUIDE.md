# Git Push Guide - Smart Contract Branch

## Current Situation

**Current Branch**: `integrating-v0-frontend`  
**Target**: Create a new branch with all smart contract work

### Files Modified (6 files, +293 lines)
- ✅ `README.md` - Updated documentation
- ✅ `anchor/Anchor.toml` - Fixed cluster config
- ✅ `anchor/programs/odv_escrow/Cargo.toml` - Added dependencies
- ✅ `anchor/programs/odv_escrow/src/lib.rs` - Complete smart contract (392 lines)
- ✅ `src/components/providers/WalletContextProvider.tsx` - Updated for SOON Network
- ✅ `src/lib/solana/transaction.ts` - Added transaction utilities

### New Files (11 files)
- ✅ `SMART_CONTRACT_SETUP_COMPLETE.md` - Comprehensive documentation
- ✅ `SOON_CHECKLIST.md` - Integration checklist
- ✅ `SOON_NETWORK_INTEGRATION_SUMMARY.md` - Migration summary
- ✅ `SOON_NETWORK_MIGRATION.md` - Migration guide
- ✅ `SOON_NETWORK_QUICK_REF.md` - Quick reference
- ✅ `anchor/rust-toolchain.toml` - Rust version config
- ✅ `src/lib/solana/network-utils.ts` - Network utilities
- ✅ `scripts/` - Helper scripts directory
- ⚠️ `anchor/programs/odv_escrow/Cargo.lock` - SHOULD COMMIT (for reproducible builds)
- ❌ `anchor/programs/odv_escrow/target/` - BUILD ARTIFACTS (2.5GB - DO NOT COMMIT)
- ❌ `anchor/target/` - BUILD ARTIFACTS (324KB - DO NOT COMMIT)

---

## Step-by-Step Instructions

### Step 1: Update .gitignore (Prevent Committing Build Artifacts)

Run this command to add Rust/Anchor ignores:

```bash
cd /workspaces/odv

cat >> .gitignore << 'EOF'

# Rust
target/
**/*.rs.bk
*.pdb

# Anchor
.anchor/
test-ledger/
.DS_Store

# Solana
*.so
!anchor/target/deploy/*.so
!anchor/target/idl/*.json
!anchor/target/types/*.ts

EOF
```

### Step 2: Create New Branch

```bash
# Create and switch to new branch
git checkout -b smart-contract-integration

# Or if you want a different name:
# git checkout -b feature/anchor-escrow-contract
# git checkout -b soon-network-deployment
```

### Step 3: Stage Your Changes

```bash
# Add modified files
git add README.md
git add anchor/Anchor.toml
git add anchor/programs/odv_escrow/Cargo.toml
git add anchor/programs/odv_escrow/src/lib.rs
git add src/components/providers/WalletContextProvider.tsx
git add src/lib/solana/transaction.ts

# Add new documentation files
git add SMART_CONTRACT_SETUP_COMPLETE.md
git add SOON_*.md

# Add new source files
git add anchor/rust-toolchain.toml
git add anchor/programs/odv_escrow/Cargo.lock
git add src/lib/solana/network-utils.ts
git add scripts/

# Add build artifacts you WANT to commit (optional)
git add anchor/target/deploy/odv_escrow.so
git add anchor/target/deploy/odv_escrow-keypair.json
git add anchor/target/idl/odv_escrow.json
git add anchor/target/types/odv_escrow.ts
```

**Alternative - Add Everything Except Ignored Files:**
```bash
# This respects .gitignore
git add .
```

### Step 4: Review What Will Be Committed

```bash
# See staged files
git status

# See actual changes
git diff --cached

# See file count and line changes
git diff --cached --stat
```

### Step 5: Commit Your Changes

```bash
git commit -m "feat: implement Anchor smart contract for milestone-based crowdfunding

- Add ODV Escrow program with 7 instructions
- Implement fixed \$1 USDC backing with admin control
- Add PlatformConfig and Campaign PDAs
- Add milestone workflow (submit, approve, reject, release)
- Configure for SOON Network deployment
- Fix Rust borrow checker errors
- Add comprehensive documentation
- Update frontend for SOON Network RPC

Program features:
- initialize_platform(): One-time setup
- update_backing_amount(): Admin can modify backing amount
- initialize(): Create campaign on project approval
- fund(): Back project (reads fixed amount from config)
- submit_milestone_proof(): Creator submits proof
- approve_milestone(): Admin approves milestone
- reject_milestone(): Admin rejects milestone
- release_milestone(): Transfer USDC to creator

Build artifacts:
- Binary: 268KB
- IDL: 13KB
- TypeScript types: 13KB"
```

### Step 6: Verify Before Pushing

```bash
# Check commit
git log -1 --stat

# Check remote
git remote -v

# Check what will be pushed
git log origin/integrating-v0-frontend..HEAD
```

### Step 7: Push to Remote (WHEN READY)

```bash
# Push new branch to GitHub
git push -u origin smart-contract-integration

# Or with different branch name:
# git push -u origin feature/anchor-escrow-contract
```

---

## Alternative: Push to Existing Branch

If you want to push to `integrating-v0-frontend` instead:

```bash
# Stay on current branch
git add .
git commit -m "feat: implement Anchor smart contract..."
git push origin integrating-v0-frontend
```

---

## What Gets Committed (Recommended)

### ✅ Should Commit (Essential)
- All `.rs` source files
- `Cargo.toml` and `Cargo.lock` files
- `Anchor.toml` configuration
- Documentation files (`.md`)
- TypeScript/JavaScript source files
- `rust-toolchain.toml`

### ⚠️ Optional (Deployment Artifacts)
- `anchor/target/deploy/odv_escrow.so` (268KB) - Built binary
- `anchor/target/deploy/odv_escrow-keypair.json` - Program keypair
- `anchor/target/idl/odv_escrow.json` (13KB) - IDL
- `anchor/target/types/odv_escrow.ts` (13KB) - TypeScript types

**Pros of committing artifacts:**
- Others can use without building
- Faster CI/CD (no rebuild needed)
- Reproducible deployments

**Cons:**
- Larger repo size
- Binary diffs are messy
- Can become outdated if source changes

### ❌ Never Commit (Build Cache)
- `anchor/programs/odv_escrow/target/` (2.5GB) - Rust build cache
- `anchor/target/debug/` - Debug builds
- `anchor/target/release/` - Release builds
- `.anchor/` - Anchor cache
- `test-ledger/` - Local test validator data

---

## Recommended .gitignore Additions

Add this to `/workspaces/odv/.gitignore`:

```gitignore
# Rust
target/
**/*.rs.bk
*.pdb
Cargo.lock
!anchor/programs/*/Cargo.lock

# Anchor
.anchor/
test-ledger/

# Solana
*.so
*.dump
!anchor/target/deploy/*.so
!anchor/target/idl/*.json
!anchor/target/types/*.ts

# Keep only deployment artifacts, ignore everything else in target/
anchor/target/*
!anchor/target/deploy/
!anchor/target/idl/
!anchor/target/types/
anchor/target/deploy/*
!anchor/target/deploy/*.so
!anchor/target/deploy/*-keypair.json
```

---

## Verification Checklist

Before pushing, verify:

- [ ] `.gitignore` updated to exclude build artifacts
- [ ] `anchor/programs/odv_escrow/target/` NOT staged (2.5GB)
- [ ] `anchor/target/` mostly ignored (only deploy artifacts)
- [ ] All source files (`.rs`, `.ts`, `.tsx`) staged
- [ ] Documentation files staged
- [ ] `Cargo.lock` staged (for reproducible builds)
- [ ] Commit message is descriptive
- [ ] No sensitive data (private keys, API keys) staged

---

## Quick Command Summary

```bash
# 1. Update .gitignore
cat >> .gitignore << 'EOF'

# Rust
target/
**/*.rs.bk
*.pdb

# Anchor
.anchor/
test-ledger/

# Solana
*.so
!anchor/target/deploy/*.so
!anchor/target/idl/*.json
!anchor/target/types/*.ts

EOF

# 2. Create new branch
git checkout -b smart-contract-integration

# 3. Stage changes (respects .gitignore)
git add .

# 4. Review
git status
git diff --cached --stat

# 5. Commit
git commit -m "feat: implement Anchor smart contract for milestone-based crowdfunding"

# 6. Push (WHEN READY)
git push -u origin smart-contract-integration
```

---

## Branch Naming Suggestions

- `smart-contract-integration` - Generic, describes the work
- `feature/anchor-escrow-v1` - Feature branch pattern
- `soon-network-deployment` - Network-focused
- `milestone-escrow-contract` - Functionality-focused
- `v1-smart-contract` - Version-based

Choose the one that matches your team's naming convention.

---

## After Pushing

1. **Create Pull Request** on GitHub
2. **Add Description** with summary from `SMART_CONTRACT_SETUP_COMPLETE.md`
3. **Request Review** from team members
4. **Run CI/CD** (if configured)
5. **Test Deployment** on testnet before merging

---

## Important Notes

⚠️ **DO NOT COMMIT**:
- Private keys (`~/.config/solana/id.json`)
- `.env` files with secrets
- `node_modules/`
- Large build caches (`target/` subdirectories)

✅ **DO COMMIT**:
- Source code
- Configuration files
- Documentation
- `Cargo.lock` (for reproducibility)
- Deployment artifacts (optional)

---

**Ready to push when you are!** 🚀
