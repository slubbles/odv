# 🧪 ODV Manual Testing Guide

This guide outlines the manual testing procedures for the OneDollarVentures (ODV) platform on the SOON Testnet. Follow these steps to verify the UI/UX and functional logic for the three major user flows: Visitor, Backer, and Creator.

---

## 📋 Prerequisites

1.  **Browser**: Chrome or Brave recommended.
2.  **Wallet**: Phantom or Solflare extension installed.
3.  **Network**: Wallet configured for **SOON Testnet** (or Devnet if fallback is needed).
    *   RPC: `https://rpc.testnet.soo.network/rpc`
        *   Chain ID: `soon-testnet`
        4.  **Database**: Ensure Supabase is connected (Env vars set).

        ---

        ## 👤 TEST 1: Visitor Flow (Unconnected)

        **Goal**: Verify the platform experience for a user without a connected wallet.

        ### 1. Landing Page (`/`)
        *   **Action**: Navigate to the home page.
        *   **Check**:
            *   [ ] Hero section loads with "One Dollar Ventures" title.
                *   [ ] "Start a Project" and "Discover Projects" buttons are visible.
                    *   [ ] Featured projects carousel/grid is visible.
                        *   [ ] Footer is present.

                        ### 2. Discover Page (`/discover`)
                        *   **Action**: Click "Discover Projects" or "Explore > Discover Projects" in the nav.
                        *   **Check**:
                            *   [ ] List of projects loads.
                                *   [ ] Search bar is functional (type a known project name).
                                    *   [ ] Filter categories (e.g., Technology, Art) work.
                                        *   [ ] Project cards show: Image, Title, Creator, Raised Amount, Progress Bar.

                                        ### 3. Project Details (`/project/[id]`)
                                        *   **Action**: Click on any project card.
                                        *   **Check**:
                                            *   [ ] **Header**: "Back" button is visible (top left) and links to `/discover`.
                                                *   [ ] **Layout**:
                                                        *   **Left Column**: Project Image/Video, Tabs (Story, Milestones, Updates, Comments).
                                                                *   **Right Column**: Title, Creator Info, Funding Stats (Raised, Goal, Backers, Days Left).
                                                                    *   [ ] **Tabs**:
                                                                            *   Click "Story": Shows description and creator bio.
                                                                                    *   Click "Milestones": Shows list of milestones with status badges.
                                                                                            *   Click "Updates": Shows "No updates yet" (if empty).
                                                                                                    *   Click "Comments": Shows comment list.
                                                                                                        *   [ ] **Action Button**: "Connect Wallet to Fund" (since wallet is disconnected).

                                                                                                        ---

                                                                                                        ## 💸 TEST 2: Backer Flow (Connected)

                                                                                                        **Goal**: Verify wallet connection, token faucet, and funding mechanics.

                                                                                                        ### 1. Wallet Connection
                                                                                                        *   **Action**: Click "Connect Wallet" in the top right.
                                                                                                        *   **Check**:
                                                                                                            *   [ ] Wallet adapter modal appears.
                                                                                                                *   [ ] Select Phantom/Solflare.
                                                                                                                    *   [ ] Button changes to **Avatar Circle** (no text).
                                                                                                                        *   [ ] **Dropdown**: Click the avatar. Verify:
                                                                                                                                *   Balance (SOL) is shown.
                                                                                                                                        *   "Copy Address" works.
                                                                                                                                                *   "View on Explorer" opens SOON Explorer.
                                                                                                                                                        *   "Disconnect" works.

                                                                                                                                                        ### 2. Faucet (`/faucet`)
                                                                                                                                                        *   **Action**: Navigate to `/faucet` (via URL or if linked).
                                                                                                                                                        *   **Check**:
                                                                                                                                                            *   [ ] Wallet address is auto-filled.
                                                                                                                                                                *   [ ] Click "Request Test USDC".
                                                                                                                                                                    *   [ ] **Success Modal**: A pop-up appears confirming "Tokens Sent Successfully".
                                                                                                                                                                        *   [ ] Close modal.

                                                                                                                                                                        ### 3. Funding a Project
                                                                                                                                                                        *   **Action**: Go to a project page (`/project/[id]`).
                                                                                                                                                                        *   **Check**:
                                                                                                                                                                            *   [ ] Button now says "Back this Project" (or similar active state).
                                                                                                                                                                                *   [ ] Click the button.
                                                                                                                                                                                    *   [ ] Approve transaction in wallet.
                                                                                                                                                                                        *   [ ] **Success Modal**: A pop-up appears: "Project Backed Successfully!".
                                                                                                                                                                                            *   [ ] **UI Update**:
                                                                                                                                                                                                    *   "Raised" amount increases by $1.
                                                                                                                                                                                                            *   "Backers" count increases by 1.
                                                                                                                                                                                                                    *   Button changes to "Already Funded" (if 1-time backing limit applies) or stays active.

                                                                                                                                                                                                                    ### 4. Portfolio (`/portfolio`)
                                                                                                                                                                                                                    *   **Action**: Click Avatar > "Funded Projects" (or navigate to `/portfolio`).
                                                                                                                                                                                                                    *   **Check**:
                                                                                                                                                                                                                        *   [ ] The project you just backed appears in the list.
                                                                                                                                                                                                                            *   [ ] Stats (Total Invested, Projects Backed) are updated.

                                                                                                                                                                                                                            ---

                                                                                                                                                                                                                            ## 🎨 TEST 3: Creator Flow

                                                                                                                                                                                                                            **Goal**: Verify project creation wizard and submission logic.

                                                                                                                                                                                                                            ### 1. Start a Project (`/submit`)
                                                                                                                                                                                                                            *   **Action**: Click "Launch a Project" > "Start a Project" in nav.
                                                                                                                                                                                                                            *   **Check**:
                                                                                                                                                                                                                                *   [ ] **Step 1: Concept**:
                                                                                                                                                                                                                                        *   Fill Title, Category, Tagline.
                                                                                                                                                                                                                                                *   Click "Continue".
                                                                                                                                                                                                                                                    *   [ ] **Step 2: Details**:
                                                                                                                                                                                                                                                            *   Fill Description (>50 chars), Problem, Solution.
                                                                                                                                                                                                                                                                    *   Click "Continue".
                                                                                                                                                                                                                                                                        *   [ ] **Step 3: Milestones**:
                                                                                                                                                                                                                                                                                *   Set Goal (must be > $100).
                                                                                                                                                                                                                                                                                        *   Set Duration.
                                                                                                                                                                                                                                                                                                *   **Milestones**:
                                                                                                                                                                                                                                                                                                            *   Add at least 1 milestone.
                                                                                                                                                                                                                                                                                                                        *   Ensure percentages sum to 100%.
                                                                                                                                                                                                                                                                                                                                    *   Set valid future deadlines.
                                                                                                                                                                                                                                                                                                                                            *   Click "Continue".
                                                                                                                                                                                                                                                                                                                                                *   [ ] **Step 4: Review**:
                                                                                                                                                                                                                                                                                                                                                        *   Verify all info is displayed correctly.
                                                                                                                                                                                                                                                                                                                                                                *   **Milestones List**: Check that Title, %, and Deadline are visible.
                                                                                                                                                                                                                                                                                                                                                                        *   Click "Submit Project".

                                                                                                                                                                                                                                                                                                                                                                        ### 2. Submission Success
                                                                                                                                                                                                                                                                                                                                                                        *   **Action**: Approve the transaction in wallet.
                                                                                                                                                                                                                                                                                                                                                                        *   **Check**:
                                                                                                                                                                                                                                                                                                                                                                            *   [ ] Loading spinner appears during processing.
                                                                                                                                                                                                                                                                                                                                                                                *   [ ] **Success Screen**:
                                                                                                                                                                                                                                                                                                                                                                                        *   "Project Submitted!" message.
                                                                                                                                                                                                                                                                                                                                                                                                *   Status badge: "In Review Queue".
                                                                                                                                                                                                                                                                                                                                                                                                        *   Buttons: "View Project" and "Go to Dashboard".

                                                                                                                                                                                                                                                                                                                                                                                                        ### 3. Creator Dashboard (`/dashboard/creator`)
                                                                                                                                                                                                                                                                                                                                                                                                        *   **Action**: Navigate to Creator Dashboard.
                                                                                                                                                                                                                                                                                                                                                                                                        *   **Check**:
                                                                                                                                                                                                                                                                                                                                                                                                            *   [ ] The new project appears in the list.
                                                                                                                                                                                                                                                                                                                                                                                                                *   [ ] Status is "Queue" or "In Review".

                                                                                                                                                                                                                                                                                                                                                                                                                ---

                                                                                                                                                                                                                                                                                                                                                                                                                ## 🐛 Reporting Issues

                                                                                                                                                                                                                                                                                                                                                                                                                If you encounter any discrepancies:
                                                                                                                                                                                                                                                                                                                                                                                                                1.  Note the **Page URL**.
                                                                                                                                                                                                                                                                                                                                                                                                                2.  Describe the **Expected** vs **Actual** behavior.
                                                                                                                                                                                                                                                                                                                                                                                                                3.  Check the **Browser Console** (F12) for red error messages.
                                                                                                                                                                                                                                                                                                                                                                                                                4.  Take a screenshot if possible.
                                                                                                                                                                                                                                                                                                                                                                                                                