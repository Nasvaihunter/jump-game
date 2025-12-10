# Jumping Game 🦕

A classic jumping dinosaur game with encrypted blockchain leaderboard.

## 🎮 How to Play

1. Connect your wallet
2. Click "Play Game"
3. Press SPACE or ↑ to jump
4. Avoid obstacles
5. Submit your score to blockchain after game over
6. Check the leaderboard for top scores

## 🚀 Quick Start

### Installation

```bash
npm install --legacy-peer-deps
```

### Configuration

Create `.env.local` file:

```
NEXT_PUBLIC_SCORE_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- Next.js 14
- React
- Tailwind CSS
- Ethereum Sepolia
- Hardhat
- Wagmi / ConnectKit

## 📝 Deploy Contract

```bash
npm run deploy:sepolia
```

## 📄 License

MIT
