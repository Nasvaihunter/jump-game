# Dino Game FHE

A classic dino jumping game (like Google Chrome's offline game) with an encrypted leaderboard using Fully Homomorphic Encryption (FHE) on Ethereum Sepolia testnet.

## Features

- 🦕 Classic dino jumping game
- 🔒 Encrypted score submission to blockchain
- 📊 Privacy-preserving leaderboard (scores shown, wallet addresses hidden)
- 🎮 Play, compete, and track your best scores

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Blockchain**: Ethereum Sepolia, Wagmi, ConnectKit
- **Smart Contracts**: Solidity, Hardhat
- **Encryption**: FHE-ready (structure supports FHEVM encryption)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DinoGame
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create `.env.local` file:
```bash
cp ENV_EXAMPLE.txt .env.local
```

4. Fill in your environment variables:
- `SEPOLIA_RPC_URL` - Sepolia RPC endpoint
- `PRIVATE_KEY` - Your wallet private key (for deployment only)
- `NEXT_PUBLIC_SCORE_MANAGER_ADDRESS` - Contract address (after deployment)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID (optional)
- `ETHERSCAN_API_KEY` - Etherscan API key (for contract verification)

5. Deploy contracts:
```bash
npm run deploy:sepolia
```

6. Start development server:
```bash
npm run dev
```

## How to Play

1. Connect your wallet
2. Navigate to "Play Game"
3. Press SPACE or ↑ to start and jump
4. Avoid obstacles and score points
5. After game over, submit your score to the blockchain
6. Check the leaderboard to see top scores (wallet addresses are hidden)

## Contract Address

The deployed contract address should be set in `.env.local` as `NEXT_PUBLIC_SCORE_MANAGER_ADDRESS` after deployment.

## Project Structure

```
├── app/              # Next.js app directory
│   ├── play/         # Game page
│   ├── leaderboard/  # Leaderboard page
│   └── page.tsx      # Home page
├── components/       # React components
│   └── DinoGame.tsx  # Game component
├── contracts/        # Solidity smart contracts
│   └── ScoreManager.sol
├── hooks/            # Custom React hooks
│   └── useScoreManager.ts
├── scripts/          # Deployment scripts
└── utils/            # Utility functions
```

## Smart Contract

The `ScoreManager` contract handles:
- Score submission (encrypted in production with FHEVM)
- Top scores retrieval
- Player score tracking
- Privacy-preserving leaderboard

## License

MIT


