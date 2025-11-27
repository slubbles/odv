# 📚 API ENDPOINTS REFERENCE

Complete list of all implemented API endpoints in the OneDollarVentures platform.

---

## 🔐 **AUTHENTICATION** (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/wallet-connect` | Connect Web3 wallet & create session |
| POST | `/api/auth/disconnect` | Disconnect wallet & clear session |
| GET | `/api/auth/session` | Get current authenticated user session |

---

## 👤 **USER MANAGEMENT** (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/[id]` | Get public user profile |
| PATCH | `/api/users/[id]` | Update user profile |
| GET | `/api/users/[id]/stats` | Get user statistics |
| GET | `/api/users/[id]/projects` | Get projects created by user |
| GET | `/api/users/[id]/backed` | Get projects backed by user |
| POST | `/api/users/[id]/follow` | Follow a creator |
| DELETE | `/api/users/[id]/follow` | Unfollow a creator |
| GET | `/api/users/[id]/followers` | Get user's followers list |
| GET | `/api/users/[id]/following` | Get users this user follows |

---

## 🎓 **ONBOARDING** (`/api/onboarding`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/onboarding/creator` | Complete creator onboarding |
| POST | `/api/onboarding/backer` | Complete backer onboarding |
| GET | `/api/onboarding/status` | Check onboarding status |

---

## 🚀 **PROJECTS** (`/api/projects`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects with filters (category, status, search, sort) |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/[id]` | Get single project details with milestones |
| PATCH | `/api/projects/[id]` | Update existing project |
| DELETE | `/api/projects/[id]` | Delete/withdraw project |
| POST | `/api/projects/[id]/publish` | Publish draft project to queue |
| POST | `/api/projects/[id]/withdraw` | Withdraw project from platform |
| GET | `/api/projects/[id]/backers` | Get list of project backers |
| GET | `/api/projects/[id]/activity` | Get project activity feed |

---

## 📝 **PROJECT UPDATES** (`/api/projects/[id]/updates`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/[id]/updates` | Get all project updates |
| POST | `/api/projects/[id]/updates` | Create new project update |
| PATCH | `/api/projects/[id]/updates/[updateId]` | Edit update |
| DELETE | `/api/projects/[id]/updates/[updateId]` | Delete update |

---

## 🎯 **MILESTONES** (`/api/projects/[id]/milestones`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/[id]/milestones` | Get all milestones for project |
| POST | `/api/projects/[id]/milestones` | Create new milestone |
| PATCH | `/api/projects/[id]/milestones/[milestoneId]` | Update milestone |
| DELETE | `/api/projects/[id]/milestones/[milestoneId]` | Delete milestone |
| POST | `/api/projects/[id]/milestones/[milestoneId]/submit` | Submit milestone for review |

---

## 💰 **BACKING** (`/api/backing`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/backing/[projectId]` | Back a project with $1 |
| GET | `/api/backing/[projectId]` | Get backing status for wallet |

---

## 📊 **TRANSACTIONS** (`/api/transactions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get user's transaction history |
| GET | `/api/transactions/[txHash]` | Get transaction details by hash |
| POST | `/api/transactions/verify` | Verify blockchain transaction |

---

## 💳 **WALLET** (`/api/wallet`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallet/balance` | Get user's wallet balance |
| POST | `/api/wallet/withdraw` | Withdraw funds from platform |

---

## 📈 **DASHBOARD** (`/api/dashboard`)

### Backer Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/backer/overview` | Get backer dashboard data |

### Creator Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/creator/overview` | Get creator dashboard data |

---

## 🛡️ **ADMIN - PROJECTS** (`/api/admin/projects`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/projects/queue` | Get projects in review queue |
| POST | `/api/admin/projects/[id]/approve` | Approve project for launch |
| POST | `/api/admin/projects/[id]/reject` | Reject project with reason |

---

## 🛡️ **ADMIN - MILESTONES** (`/api/admin/milestones`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/milestones/pending` | Get milestones pending review |
| POST | `/api/admin/milestones/[id]/approve` | Approve milestone & release funds |
| POST | `/api/admin/milestones/[id]/reject` | Reject milestone with feedback |

---

## 🛡️ **ADMIN - USERS** (`/api/admin/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users with filters |
| PATCH | `/api/admin/users/[id]/ban` | Ban user with reason |

---

## 🔍 **DISCOVERY** (`/api/discover`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/discover/projects` | Get projects for discover page (with filters) |
| GET | `/api/discover/featured` | Get featured/curated projects |

---

## 🔎 **SEARCH** (`/api/search`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search` | Universal search (projects, creators) |

---

## 👨‍💼 **CREATORS** (`/api/creators`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/creators` | Get all creators with filters |
| GET | `/api/creators/[id]` | Get single creator profile |

---

## 🔔 **NOTIFICATIONS** (`/api/notifications`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications (paginated) |
| PATCH | `/api/notifications/[id]/read` | Mark notification as read |

---

## 💬 **MESSAGES** (`/api/messages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get all conversations for user |
| POST | `/api/messages` | Send message to a user |

---

## 💼 **PORTFOLIO** (`/api/portfolio`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get user's portfolio overview |

---

## 📊 **STATISTICS** (`/api/stats`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/platform` | Get public platform statistics |
| GET | `/api/stats/live` | Get real-time activity feed |

---

## ⚙️ **SETTINGS** (`/api/settings`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all user settings |
| PATCH | `/api/settings` | Update user settings |

---

## 🎨 **QUERY PARAMETERS**

### Common Query Parameters

#### `/api/projects` (GET)
```
?category=Technology
&status=active
&search=blockchain
&sort=trending|newest|ending|funded
&page=1
&limit=12
```

#### `/api/users/[id]/projects` (GET)
```
?status=active|draft|completed
```

#### `/api/discover/projects` (GET)
```
?category=all|Technology|Art|...
&sort=trending|newest|ending|funded
&limit=12
&offset=0
```

#### `/api/search` (GET)
```
?q=searchQuery
&type=all|projects|creators
&limit=20
```

#### `/api/transactions` (GET)
```
?wallet=walletAddress
&type=backing|withdrawal|refund
&limit=50
&offset=0
```

#### `/api/notifications` (GET)
```
?wallet=walletAddress
&unread=true
&limit=50
&offset=0
```

#### `/api/admin/users` (GET)
```
?role=backer|creator|admin
&status=active|banned
&limit=50
&offset=0
```

---

## 🔒 **AUTHENTICATION HEADERS**

For authenticated endpoints, include:
```
Authorization: Bearer {sessionToken}
```

---

## 📝 **REQUEST BODY EXAMPLES**

### POST `/api/auth/wallet-connect`
```json
{
  "walletAddress": "7Xw...",
  "signature": "base64_signature",
  "message": "Sign this message to authenticate"
}
```

### POST `/api/projects`
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

### POST `/api/backing/[projectId]`
```json
{
  "walletAddress": "wallet_address",
  "transactionSignature": "solana_tx_signature",
  "amount": 1
}
```

### POST `/api/users/[id]/follow`
```json
{
  "followerWallet": "follower_wallet_address"
}
```

### POST `/api/messages`
```json
{
  "senderWallet": "sender_address",
  "recipientWallet": "recipient_address",
  "subject": "About your project",
  "content": "Message content",
  "projectId": "uuid" // optional
}
```

---

## 🚦 **HTTP STATUS CODES**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no session) |
| 403 | Forbidden (not allowed) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🎯 **RESPONSE FORMATS**

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### Paginated Response
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

---

**Total Endpoints:** 80+  
**Total Route Files:** 52  
**Status:** ✅ Ready for production
