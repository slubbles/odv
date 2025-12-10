# Smart Contract Refactor Plan - Multiple Campaigns Per Wallet

## 📊 Implementation Progress

**Phase 1: Smart Contract (Rust) - ✅ COMPLETE**
- ✅ Modified Campaign struct with campaign_id
- ✅ Modified PlatformConfig struct with next_campaign_id  
- ✅ Updated all contexts to use campaign_id in PDA seeds
- ✅ Added close_campaign instruction
- ✅ Updated all instruction signatures
- ✅ Fixed PDA signer seeds in release_milestone and refund_campaign

**Phase 2: TypeScript/Frontend - ✅ COMPLETE**
- ✅ Updated PDA derivation helpers (getCampaignPDA, getNextCampaignId, getCreatorCampaigns)
- ✅ Updated transaction creation functions (initialize, fund, close)
- ✅ Updated submit page flow to fetch campaign_id
- ✅ Updated backing flow (use-back-project hook, BackProjectButton)

**Phase 3: Database & API - ✅ COMPLETE**
- ✅ Created migration for campaign_id columns (migrations/001_add_campaign_id.sql)
- ✅ Updated API routes (POST /api/projects accepts campaign_id)
- ✅ Updated TypeScript types (Campaign interface)

**Phase 4: Deployment - ⏳ PENDING**
- ⏳ Deploy smart contract to SOON testnet
- ⏳ Initialize platform config
- ⏳ Update environment variables
- ⏳ Deploy frontend to Vercel

---

## 🎯 Executive Summary

**Current Problem:** One wallet can only create ONE campaign FOREVER due to PDA derivation using only `[b"campaign", creator.key()]`.

**Impact:**
- ❌ Admin wallet cannot create projects (already has a campaign)
- ❌ Creators cannot launch multiple projects over time
- ❌ Cannot test submissions with the same wallet
- ❌ Platform is unusable for real-world scenarios

**Solution:** Add campaign ID system to allow unlimited campaigns per wallet.

---

## 📋 Components to Modify/Add

### **Smart Contract (Rust) - CRITICAL CHANGES**

#### 1. Program State Modifications

**File:** `anchor/programs/odv_escrow/src/lib.rs`

```rust
// MODIFY: Campaign struct - add campaign_id
#[account]
pub struct Campaign {
    pub creator: Pubkey,
    pub campaign_id: u64,          // ← NEW: Unique ID per creator
    pub goal: u64,
    pub raised: u64,
    pub deadline: i64,
    pub backer_count: u64,
    pub current_milestone_index: u8,
    pub milestones: Vec<Milestone>,
    pub bump: u8,
}

// MODIFY: PlatformConfig - add campaign counter
#[account]
pub struct PlatformConfig {
    pub admin: Pubkey,
    pub fixed_backing_amount: u64,
    pub total_campaigns: u64,
    pub total_backers: u64,
    pub next_campaign_id: u64,    // ← NEW: Global counter for campaign IDs
    pub paused: bool,
    pub bump: u8,
}
```

#### 2. PDA Derivation Updates

```rust
// MODIFY: Initialize context - change seeds
#[derive(Accounts)]
#[instruction(campaign_id: u64)]  // ← NEW: Pass campaign_id as instruction param
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = creator, 
        space = 8 + 32 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + (4 + 50 * 100),
        seeds = [
            b"campaign", 
            creator.key().as_ref(),
            &campaign_id.to_le_bytes()  // ← NEW: Add campaign_id to seed
        ],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,  // ← NEW: Need to increment counter
    pub system_program: Program<'info, System>,
}
```

#### 3. Initialize Instruction Modification

```rust
// MODIFY: initialize function signature
pub fn initialize(
    ctx: Context<Initialize>,
    campaign_id: u64,      // ← NEW: Accept campaign_id
    goal: u64, 
    deadline: i64,
    milestones: Vec<MilestoneInput>
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    campaign.creator = ctx.accounts.creator.key();
    campaign.campaign_id = campaign_id;  // ← NEW: Store campaign_id
    campaign.goal = goal;
    campaign.deadline = deadline;
    campaign.raised = 0;
    campaign.backer_count = 0;
    campaign.current_milestone_index = 0;
    campaign.bump = ctx.bumps.campaign;

    // Initialize milestones
    let mut campaign_milestones = Vec::new();
    for m in milestones {
        campaign_milestones.push(Milestone {
            title: m.title,
            amount: m.amount,
            status: MilestoneStatus::Locked,
            proof_url: None,
            submitted_at: None,
            votes_approve: 0,
            votes_dispute: 0,
        });
    }
    if !campaign_milestones.is_empty() {
        campaign_milestones[0].status = MilestoneStatus::Active;
    }
    campaign.milestones = campaign_milestones;

    // ← NEW: Increment platform-wide campaign counter
    let platform_config = &mut ctx.accounts.platform_config;
    platform_config.total_campaigns += 1;
    platform_config.next_campaign_id += 1;

    Ok(())
}
```

#### 4. Update All Other Contexts

```rust
// MODIFY: Fund, ReleaseMilestone, SubmitMilestoneProof, etc.
// All contexts that use campaign PDA need campaign_id parameter

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct Fund<'info> {
    #[account(
        mut,
        seeds = [
            b"campaign", 
            campaign.creator.as_ref(),
            &campaign_id.to_le_bytes()
        ],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    // ... rest
}
```

#### 5. NEW INSTRUCTION: Close Campaign

```rust
// ADD: New instruction to close campaigns
pub fn close_campaign(ctx: Context<CloseCampaign>) -> Result<()> {
    let campaign = &ctx.accounts.campaign;
    let clock = Clock::get()?;
    
    // Only allow closing if:
    // 1. No backers yet (pre-launch cancellation)
    // 2. Failed to reach goal and deadline passed (refund scenario)
    // 3. All milestones completed (successful completion)
    
    require!(
        campaign.backer_count == 0 || 
        (campaign.raised < campaign.goal && clock.unix_timestamp > campaign.deadline) ||
        (campaign.current_milestone_index as usize >= campaign.milestones.len()),
        ErrorCode::CannotCloseCampaign
    );
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct CloseCampaign<'info> {
    #[account(
        mut,
        close = creator,  // Return rent to creator
        seeds = [
            b"campaign", 
            creator.key().as_ref(),
            &campaign_id.to_le_bytes()
        ],
        bump = campaign.bump,
        has_one = creator,
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
}

// ADD: New error code
#[error_code]
pub enum ErrorCode {
    // ... existing errors
    #[msg("Cannot close campaign: Has active backers or goal reached")]
    CannotCloseCampaign,
}
```

#### 6. OPTIONAL: Add Campaign Status Enum

```rust
// ADD: Campaign status tracking
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum CampaignStatus {
    Draft,       // Created but not launched
    Active,      // Live and accepting backers
    Funded,      // Goal reached, executing milestones
    Completed,   // All milestones done
    Failed,      // Deadline passed without reaching goal
    Cancelled,   // Creator cancelled before backers
}

// Add to Campaign struct
pub struct Campaign {
    // ...
    pub status: CampaignStatus,  // ← NEW
    // ...
}
```

---

### **TypeScript/Frontend - CRITICAL CHANGES**

#### 1. PDA Derivation Helper

**File:** `src/lib/solana/program.ts`

```typescript
// MODIFY: Add campaign_id parameter
export function getCampaignPDA(
    creatorPublicKey: PublicKey, 
    campaignId: number  // ← NEW
): [PublicKey, number] {
    const [pda, bump] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(CAMPAIGN_SEED),
            creatorPublicKey.toBuffer(),
            Buffer.from(new Uint8Array(new BigUint64Array([BigInt(campaignId)]).buffer))  // ← NEW
        ],
        ODV_ESCROW_PROGRAM_ID
    );
    return [pda, bump];
}

// ADD: New helper to get next campaign ID
export async function getNextCampaignId(
    connection: Connection
): Promise<number> {
    const [platformConfigPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform_config')],
        ODV_ESCROW_PROGRAM_ID
    );
    
    const accountInfo = await connection.getAccountInfo(platformConfigPDA);
    if (!accountInfo) {
        throw new Error('Platform config not initialized');
    }
    
    // Decode next_campaign_id from account data
    // Offset: 8 (discriminator) + 32 (admin) + 8 (fixed_backing) + 8 (total_campaigns) + 8 (total_backers)
    const dataView = new DataView(accountInfo.data.buffer);
    const nextCampaignId = Number(dataView.getBigUint64(64, true));
    
    return nextCampaignId;
}

// ADD: Helper to list all campaigns for a creator
export async function getCreatorCampaigns(
    connection: Connection,
    creatorPublicKey: PublicKey,
    maxCampaigns: number = 100  // Safety limit
): Promise<Array<{ pda: PublicKey; campaignId: number; bump: number }>> {
    const campaigns = [];
    
    for (let i = 0; i < maxCampaigns; i++) {
        const [pda, bump] = getCampaignPDA(creatorPublicKey, i);
        const accountInfo = await connection.getAccountInfo(pda);
        
        if (accountInfo) {
            campaigns.push({ pda, campaignId: i, bump });
        }
    }
    
    return campaigns;
}
```

#### 2. Transaction Creation

**File:** `src/lib/solana/transaction.ts`

```typescript
// MODIFY: Add campaignId parameter
export async function createInitializeCampaignTransaction(
    connection: Connection,
    creatorPublicKey: PublicKey,
    campaignId: number,  // ← NEW
    goal: number,
    deadline: number,
    milestones: { title: string; amount: number }[]
): Promise<Transaction> {
    const transaction = new Transaction();

    // 1. Derive Campaign PDA with campaign_id
    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);  // ← MODIFIED

    // 2. Derive Campaign Vault (ATA)
    const campaignVault = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        campaignPDA,
        true
    );

    // 3. Check if Campaign Vault exists
    try {
        await getAccount(connection, campaignVault);
        console.log("Campaign vault already exists, skipping creation");
    } catch (error: unknown) {
        const isTokenAccountError = 
            error instanceof TokenAccountNotFoundError || 
            error instanceof TokenInvalidAccountOwnerError;

        if (isTokenAccountError) {
            console.log("Campaign vault doesn't exist, creating it");
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    creatorPublicKey,
                    campaignVault,
                    campaignPDA,
                    USDC_MINT_ADDRESS
                )
            );
        }
    }

    // 4. Get platform config PDA
    const [platformConfigPDA] = getPlatformConfigPDA();

    // 5. Prepare Initialize instruction data
    const args = {
        campaign_id: new BN(campaignId),  // ← NEW: Add campaign_id to instruction
        goal: new BN(goal * 1_000_000),
        deadline: new BN(deadline),
        milestones: milestones.map(m => ({
            title: m.title,
            amount: new BN(m.amount * 1_000_000)
        }))
    };

    // Update Borsh layout
    const initializeLayout = borsh.struct([
        borsh.u64('campaign_id'),  // ← NEW
        borsh.u64('goal'),
        borsh.i64('deadline'),
        borsh.vec(milestoneInputLayout, 'milestones'),
    ]);

    const buffer = Buffer.alloc(2048);
    const len = initializeLayout.encode(args, buffer);
    const data = Buffer.concat([INITIALIZE_DISCRIMINATOR, buffer.slice(0, len)]);

    // 6. Add Initialize instruction
    transaction.add(new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: creatorPublicKey, isSigner: true, isWritable: true },
            { pubkey: platformConfigPDA, isSigner: false, isWritable: true },  // ← NEW: Need to increment counter
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: ODV_ESCROW_PROGRAM_ID,
        data: data
    }));

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = creatorPublicKey;

    return transaction;
}

// MODIFY: Update fund transaction
export async function createFundCampaignTransaction(
    connection: Connection,
    backerPublicKey: PublicKey,
    creatorPublicKey: PublicKey,
    campaignId: number,  // ← NEW
    amount: number = 1
): Promise<Transaction> {
    const transaction = new Transaction();

    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);  // ← MODIFIED
    // ... rest of function
}

// ADD: New close campaign transaction
export async function createCloseCampaignTransaction(
    connection: Connection,
    creatorPublicKey: PublicKey,
    campaignId: number
): Promise<Transaction> {
    const transaction = new Transaction();

    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);

    const closeCampaignInstruction = new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: creatorPublicKey, isSigner: true, isWritable: true },
        ],
        programId: ODV_ESCROW_PROGRAM_ID,
        data: Buffer.from([/* close_campaign discriminator */]),
    });

    transaction.add(closeCampaignInstruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = creatorPublicKey;

    return transaction;
}
```

#### 3. Submit Page

**File:** `src/app/submit/page.tsx`

```typescript
// MODIFY: handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!connected || !publicKey || !sendTransaction) {
        toast.error("Please connect your wallet first")
        return
    }

    setIsSubmitting(true)

    try {
      // ... validation code

      // ← NEW: Get next campaign ID
      console.log('[Submit] Fetching next campaign ID...')
      const campaignId = await getNextCampaignId(connection)
      console.log('[Submit] Next campaign ID:', campaignId)

      // ← MODIFIED: Check if THIS campaign exists (not just any campaign)
      const [campaignPDA] = getCampaignPDA(publicKey, campaignId)
      console.log('[Submit] Checking if campaign exists:', campaignPDA.toString())
      
      const accountInfo = await connection.getAccountInfo(campaignPDA)
      if (accountInfo !== null) {
        console.error('[Submit] Campaign ID already taken (race condition)')
        throw new Error('Campaign ID conflict. Please try again.')
      }
      
      console.log('[Submit] Campaign ID available, proceeding with initialization')
      toast.info("Initializing campaign on blockchain...")
      
      // ← MODIFIED: Pass campaignId
      const transaction = await createInitializeCampaignTransaction(
          connection,
          publicKey,
          campaignId,  // ← NEW
          goalAmount,
          deadlineTimestamp,
          formData.milestones.map(m => ({
            title: m.title,
            amount: (goalAmount * m.percentage) / 100
          }))
      )
      
      // ... rest of transaction signing

      // ← MODIFIED: Save campaign_id to database
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ... existing fields
          campaign_id: campaignId,  // ← NEW
          campaign_pda: campaignPDA.toString(),  // ← NEW
        })
      })

      // ... rest of function
    } catch (error) {
      // ... error handling
    }
}
```

#### 4. Back Project Button

**File:** `src/components/back-project-button.tsx`

```typescript
// MODIFY: Add campaignId prop
interface BackProjectButtonProps {
  projectId: string
  projectTitle: string
  projectStatus: string
  creatorWallet: string
  campaignId: number  // ← NEW
  // ... other props
}

// MODIFY: handleBackProject function
const handleBackProject = async () => {
    // ... existing code

    // ← MODIFIED: Pass campaignId
    const transaction = await createFundCampaignTransaction(
        connection,
        publicKey,
        new PublicKey(creatorWallet),
        campaignId,  // ← NEW
        1
    )

    // ... rest of function
}
```

---

### **Database Schema - REQUIRED CHANGES**

#### Migration File

**File:** `migrations/add_campaign_id.sql` (NEW)

```sql
-- Add campaign_id and campaign_pda to projects table
ALTER TABLE public.projects 
ADD COLUMN campaign_id bigint,
ADD COLUMN campaign_pda text;

-- Create index for campaign lookups
CREATE INDEX idx_projects_campaign_id ON public.projects(campaign_id);
CREATE INDEX idx_projects_campaign_pda ON public.projects(campaign_pda);

-- Add constraint to ensure campaign_id is set for active projects
-- (Optional: can enforce at application level instead)
ALTER TABLE public.projects 
ADD CONSTRAINT check_active_has_campaign 
CHECK (status NOT IN ('active', 'funded', 'completed') OR campaign_id IS NOT NULL);
```

#### Update TypeScript Types

**File:** `src/types/project.ts`

```typescript
export interface Project {
  id: string
  title: string
  // ... existing fields
  campaign_id?: number        // ← NEW: Can be null for drafts
  campaign_pda?: string       // ← NEW: The actual PDA address
  // ... rest
}
```

---

### **API Routes - MINOR CHANGES**

#### Create Project API

**File:** `src/app/api/projects/route.ts`

```typescript
// MODIFY: POST handler to accept campaign_id
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      // ... existing fields
      campaign_id,      // ← NEW
      campaign_pda,     // ← NEW
    } = body

    // ... validation

    const { data, error } = await supabase
      .from('projects')
      .insert({
        // ... existing fields
        campaign_id,    // ← NEW
        campaign_pda,   // ← NEW
      })
      .select()

    // ... rest
  }
}
```

#### Get Project API

**File:** `src/app/api/projects/[id]/route.ts`

```typescript
// Response now includes campaign_id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // ... fetch project
  
  return NextResponse.json({
    ...project,
    campaign_id: project.campaign_id,    // ← Return campaign_id
    campaign_pda: project.campaign_pda,  // ← Return PDA
  })
}
```

---

### **Admin Dashboard - WORKFLOW CHANGES**

#### Option A: Two-Step Approval (RECOMMENDED)

**Current Flow:**
```
Submit → Admin Approves (creates campaign) → Status: Active
```

**New Flow:**
```
Submit (creator creates campaign) → Status: Queue → Admin Approves → Status: Active
```

**Changes:**
- Creator initializes campaign during submission (already done)
- Admin just changes status from 'queue' to 'active'
- No on-chain transaction needed from admin

**File:** `src/app/admin/page.tsx`

```typescript
// MODIFY: approveProject - remove blockchain transaction
const handleApprove = async (projectId: string) => {
    try {
        // Just update database status
        const res = await fetch(`/api/admin/projects/${projectId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) throw new Error('Failed to approve project')

        toast.success('Project approved!')
        fetchProjects()
    } catch (error) {
        toast.error('Failed to approve project')
    }
}
```

#### Option B: Admin Pre-Approval (Alternative)

**Flow:**
```
Submit (metadata only) → Admin Pre-Approves → Creator Initializes Campaign → Status: Active
```

**Use Case:** If you want admin review BEFORE blockchain costs.

---

## 🚀 Deployment Checklist

### 1. **Smart Contract Changes**

- [x] Modify `Campaign` struct (add `campaign_id`)
- [x] Modify `PlatformConfig` struct (add `next_campaign_id`)
- [x] Update `Initialize` context (add `campaign_id` to seeds)
- [x] Update `initialize` instruction (accept and store `campaign_id`)
- [x] Add `close_campaign` instruction
- [x] Update all other contexts (`Fund`, `ReleaseMilestone`, etc.)
- [x] Update space calculations for new fields
- [x] Smart contract code changes complete (Rust toolchain not installed in dev container - will test on deployment)

### 2. **Rebuild & Deploy Program**

```bash
cd anchor
anchor build
anchor deploy --provider.cluster testnet
```

**Result:** ✅ **NEW PROGRAM ID**

### 3. **Update Environment Variables**

**Vercel Dashboard → Settings → Environment Variables**

```env
# CRITICAL: Update program ID
NEXT_PUBLIC_ODV_PROGRAM_ID=<NEW_PROGRAM_ID>

# May need to re-initialize platform config
NEXT_PUBLIC_PLATFORM_ADMIN_WALLET=<YOUR_ADMIN_WALLET>
```

### 4. **Initialize New Platform Config**

```bash
# Run initialization script
node anchor/scripts/initialize-platform-soon.js
```

This creates a NEW `platform_config` account with:
- `next_campaign_id: 0`
- `total_campaigns: 0`
- `fixed_backing_amount: 1000000` (1 USDC)

### 5. **Database Migration**

```bash
# Apply migration
psql $DATABASE_URL < migrations/add_campaign_id.sql

# Or use Supabase dashboard SQL editor
```

### 6. **Update Frontend Code**

- [ ] Update `src/lib/solana/program.ts` (PDA helpers)
- [ ] Update `src/lib/solana/transaction.ts` (all transaction functions)
- [ ] Update `src/app/submit/page.tsx` (fetch campaign ID)
- [ ] Update `src/components/back-project-button.tsx` (pass campaign ID)
- [ ] Update `src/app/admin/page.tsx` (remove blockchain tx from approval)
- [ ] Update API routes to handle `campaign_id`
- [ ] Update TypeScript types

### 7. **Testing Phase**

**Critical Tests:**
1. [ ] Submit project with wallet A → Check campaign_id = 0
2. [ ] Submit project with wallet A again → Check campaign_id = 1
3. [ ] Submit project with wallet B → Check campaign_id = 2
4. [ ] Back a project → Verify funding works
5. [ ] Admin approve project → Verify status change
6. [ ] Creator release milestone → Verify funds transfer
7. [ ] Test close_campaign instruction

### 8. **Deploy Frontend**

```bash
git add .
git commit -m "feat: add multi-campaign support with campaign IDs"
git push origin master
```

**Vercel auto-deploys** ✅

### 9. **Post-Deployment Verification**

- [ ] Verify new program ID in Solana Explorer
- [ ] Check platform config is initialized
- [ ] Test full user flow end-to-end
- [ ] Verify database has `campaign_id` column
- [ ] Test with multiple wallets

---

## 📊 What Changes in Development?

### **Breaking Changes**

1. **New Program ID**
   - Old program: `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA`
   - New program: `<DIFFERENT_ID>` (changes with every deploy)
   - **Impact:** All existing campaigns on old program are orphaned
   - **Solution:** This is fine for testnet, start fresh

2. **All PDAs Change**
   - Old: `seeds = [b"campaign", creator]`
   - New: `seeds = [b"campaign", creator, campaign_id]`
   - **Impact:** Cannot access old campaign accounts
   - **Solution:** Use new PDA derivation everywhere

3. **Database Schema**
   - Adds `campaign_id` and `campaign_pda` columns
   - **Impact:** Existing projects missing these fields
   - **Solution:** Set to NULL for old data, only required for new projects

### **Environment Variables**

**Update Required:**

```env
# Old
NEXT_PUBLIC_ODV_PROGRAM_ID=4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA

# New (after deployment)
NEXT_PUBLIC_ODV_PROGRAM_ID=<NEW_PROGRAM_ID_FROM_ANCHOR_DEPLOY>
```

**Steps:**
1. Run `anchor deploy` → Note the program ID from output
2. Update `.env.local` for local dev
3. Update Vercel environment variables:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_ODV_PROGRAM_ID`
   - Trigger redeployment

### **Platform Config Re-initialization**

**Why?**
- Old platform config doesn't have `next_campaign_id` field
- New program needs new platform config account

**How?**
```bash
cd anchor/scripts
node initialize-platform-soon.js
```

**Result:**
- Creates new PDA: `[b"platform_config"]` under new program
- Sets `next_campaign_id = 0`
- Ready for first campaign

### **Testing Strategy**

**Phase 1: Local Testing**
```bash
anchor test
```
- Tests campaign ID incrementing
- Tests multiple campaigns per wallet
- Tests close_campaign instruction

**Phase 2: Devnet Testing** (if you want extra safety)
```bash
anchor deploy --provider.cluster devnet
# Test with devnet RPC
```

**Phase 3: SOON Testnet Deployment**
```bash
anchor deploy --provider.cluster testnet
# Configure Anchor.toml for SOON RPC
```

### **Rollback Plan**

If something breaks:

1. **Revert Frontend:**
   ```bash
   git revert HEAD
   git push origin master
   ```

2. **Revert Env Vars:**
   - Change `NEXT_PUBLIC_ODV_PROGRAM_ID` back to old ID
   - Redeploy on Vercel

3. **Database Migration Rollback:**
   ```sql
   ALTER TABLE projects DROP COLUMN campaign_id;
   ALTER TABLE projects DROP COLUMN campaign_pda;
   ```

But note: **Cannot revert smart contract deployment**. Once deployed, the new program exists forever. You can only stop using it.

---

## 🎯 Alternative: Minimal Fix (Quick Workaround)

If you don't want to refactor everything right now:

### **Option: Add Close Campaign Instruction Only**

**Pros:**
- Allows cleaning up existing campaigns
- Can test with same wallet again
- Small code change

**Cons:**
- Still limited to one ACTIVE campaign per wallet
- Not a real solution

**Implementation:**
Just add the `close_campaign` instruction, keep existing PDA structure.

---

## 📈 Estimated Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Smart Contract Modifications | 2 hours | Update Rust code, add campaign_id |
| Frontend TypeScript Updates | 1.5 hours | Update all PDA derivations |
| Database Migration | 15 min | Add columns, create indexes |
| Testing | 1 hour | End-to-end flow testing |
| Deployment | 30 min | Deploy program, update env vars |
| **Total** | **5 hours** | Full implementation |

---

## 🚨 Critical Notes

1. **Campaign ID starts at 0** - First campaign for any creator is `campaign_id = 0`

2. **Platform config tracks global counter** - Ensures unique IDs across all creators

3. **No migration path for old campaigns** - Fresh start with new program ID

4. **Admin approval becomes simpler** - Just database status change, no blockchain tx

5. **Creators can launch unlimited projects** - As long as they pay for account rent

6. **Close campaign refunds rent** - ~0.002 SOL per campaign account

---

## ✅ Success Criteria

After implementation, verify:

- [ ] Admin wallet can submit multiple projects
- [ ] Regular users can submit multiple projects
- [ ] Each project gets unique `campaign_id`
- [ ] PDAs are correctly derived with `campaign_id`
- [ ] Database stores `campaign_id` and `campaign_pda`
- [ ] Backing projects works with new PDA structure
- [ ] Milestone release works with new PDA structure
- [ ] Close campaign instruction works
- [ ] Platform counter increments correctly

---

## 📞 Questions?

Key decisions needed:
1. **Admin approval flow:** Two-step (creator init) or pre-approval?
2. **Testing strategy:** Local only or also devnet?
3. **Data migration:** Keep old projects as-is or clean database?

**Recommendation:** Go with two-step approval (creators initialize during submit), test on local + SOON testnet, clean database for fresh start.
