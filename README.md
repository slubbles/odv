# 💸 OneDollarVentures

> **Where Dreams Meet Dollars (Just One Dollar Though)**

Tired of missing out on the next big thing? Can't afford to invest thousands in startups? Well, hold onto your single dollar bill, because we're democratizing venture capital one buck at a time! 🚀

## 🎯 The Big Idea

OneDollarVentures is like Kickstarter met Solana at a dollar store, fell in love, and decided to revolutionize how indie hackers fund their dreams. Every day, we spotlight one hand-picked project. You? You back it for exactly **$1**. That's it. A single George Washington. Less than a coffee. The price of regret avoidance.

### Why Though?

- **You**: Get a unique NFT, exclusive backer perks, and the satisfaction of saying "I backed them when..."
- **Creators**: Get a daily spotlight, real backers (not just likes), and actual funding
- **Everyone**: Watches the magic happen on Solana's lightning-fast blockchain

## ✨ Features That'll Make You Go "Neat!"

### For Backers
- 🔥 **Daily Spotlight**: One project. One day. Zero FOMO.
- 🎨 **Backer NFTs**: Proof you were early (flex responsibly)
- 📊 **Portfolio Tracking**: Watch your $1 bets turn into... well, something
- 🎁 **Exclusive Access**: Beta testing, Discord channels, potential airdrops

### For Creators
- 📢 **Quality Over Quantity**: We vet, you shine
- 💰 **Milestone-Based Funding**: Prove progress, unlock cash
- 🤝 **Engaged Community**: Real supporters, not just wallet addresses
- 🎯 **Fair Queue System**: $1 to join the queue, best projects rise to the top

## 🛠️ Tech Stack (The Cool Stuff Under The Hood)

- **Frontend**: Next.js 15 (because we like living on the edge)
- **Styling**: TailwindCSS + shadcn/ui (pretty components go brrr)
- **Blockchain**: SOON Network (SVM rollup - Solana-compatible, faster, cheaper)
- **Database**: Supabase (PostgreSQL but make it serverless)
- **Payments**: USDC on SOON/Solana (stablecoins for stable minds)
- **NFTs**: Metaplex (your proof of early support)

## 🌐 Network

This project runs on **SOON Network Testnet** - an Ethereum-based SVM rollup that's 100% Solana-compatible.

- **RPC Endpoint**: https://rpc.testnet.soo.network/rpc
- **Explorer**: https://explorer.testnet.soo.network
- **Faucet**: https://faucet.testnet.soo.network
- **Why SOON?**: Lower fees (~90%), faster finality, same Solana experience

See [SOON_NETWORK_MIGRATION.md](./SOON_NETWORK_MIGRATION.md) for setup details.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or whatever the kids are using these days)
- A Solana wallet (Phantom, Solflare, you know the drill)
- $1 (seriously, that's it)

### Installation

```bash
# Clone this bad boy
git clone https://github.com/yourusername/onedollarventures.git
cd onedollarventures

# Install the goods
npm install

# Set up your env (copy .env.example to .env.local)
# Add your Supabase credentials
# Add your Solana RPC endpoint

# Fire it up
npm run dev
```

Visit `http://localhost:3000` and prepare to be whelmed.

### Building for Production

```bash
npm run build
npm start
```

## 🌍 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy
5. Profit??? (in $1 increments)

**Note**: There's no separate backend to deploy! 🎉  
Everything runs through Supabase (database) and Solana (blockchain). Just deploy the Next.js app and you're golden.

### Environment Variables You'll Need

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SOLANA_RPC_URL=your_rpc_endpoint
NEXT_PUBLIC_PROGRAM_ID=your_solana_program_id
```

## 📁 Project Structure

```
onedollarventures/
├── src/
│   ├── app/              # Next.js 15 app directory
│   ├── components/       # React components (now with 100% more shadcn/ui)
│   ├── lib/              # Utilities, types, and helpers
│   │   ├── solana/       # Blockchain magic
│   │   ├── supabase/     # Database stuff
│   │   └── types/        # TypeScript definitions
│   └── styles/           # Global styles
├── anchor/               # Solana smart contracts
└── public/               # Static assets
```

## 🎮 How It Works

1. **Creators** submit their projects ($1 to join the queue)
2. **We curate** and pick the best for daily spotlight
3. **Backers** discover and back projects for $1 (gets you an NFT)
4. **Milestones** unlock funding as creators deliver
5. **Everyone wins** (or at least has fun trying)

## 🤝 Contributing

Found a bug? Have an idea? Want to make this even more ridiculous?

1. Fork it
2. Create your feature branch (`git checkout -b feature/mind-blowing-feature`)
3. Commit your changes (`git commit -m 'Add some mind-blowing feature'`)
4. Push to the branch (`git push origin feature/mind-blowing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - Go wild, just don't sue us.

## 🙏 Acknowledgments

- Every indie hacker who ever had a dream
- The Solana ecosystem for making crypto actually usable
- Coffee, for existing

## 💬 Support

- **Discord**: [Join our community](#) (coming soon™)
- **Twitter**: [@OneDollarVentures](#) (tweet at us)
- **Email**: hello@onedollarventures.com (we actually read these)

---

**Remember**: It's just a dollar. What's the worst that could happen? 🎲

*Built with ❤️ and caffeine by developers who believe in the power of $1*
