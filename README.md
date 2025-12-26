# Jumping Game 🦕🔐🚀

A classic jumping dinosaur game with **encrypted blockchain leaderboard**! 🎮 All scores are encrypted using Fully Homomorphic Encryption (FHE) before being submitted to the smart contract, ensuring player data privacy like never before! 🛡️✨

## 🎯 Concept - What's All This Fuss About? 🤔

The application demonstrates the power of **Fully Homomorphic Encryption (FHE)** in Web3 games! 🎲 Instead of storing plain scores on the blockchain (booooring! 😴), the game:

- 🔒 **Encrypts** scores using FHE before submitting to the contract (super secret!)
- 📦 **Stores** only encrypted data (FHE handles) on the blockchain (nobody can peek! 👀)
- 🎁 **Allows** players to decrypt their own scores (you own your data! 💪)
- 🕵️ **Hides** other players' scores until they decrypt them themselves (privacy first! 🎭)

This ensures data privacy while maintaining the benefits of decentralized leaderboards! 🏆🔐

## 🌐 Live Demo - Come Play! 🎮

**🚀 Application deployed on Vercel:**

👉 **[https://dino-game-fhe.vercel.app](https://dino-game-fhe.vercel.app)** 👈

**Go ahead, give it a try! Your scores are safe with us! 🛡️**

## ✨ Key Features - What Makes It Awesome! 🌟

### 🦕 Gameplay
- 🎮 **Classic mechanics**: Control the dinosaur (SPACE or ↑ to jump) - just like Chrome's offline game! 🚀
- 📊 **Score submission**: Automatic saving of results after game over (no manual work needed! 🤖)
- 🔐 **Privacy**: All scores are encrypted before submission to the blockchain (super secure! 🛡️)

### 🔒 FHE Encryption
- 🎯 **Automatic encryption**: Scores are encrypted using Zama FHEVM SDK (magic happens here! ✨)
- 🔓 **Decryption**: Players can decrypt their own scores (your data, your control! 💪)
- 💾 **Local storage**: Original scores are saved in localStorage for quick access (speed matters! ⚡)

### 📊 Leaderboard
- 🔐 **Encrypted scores**: Display of encrypted values from other players (can't see what you shouldn't! 👀)
- 👤 **Personalized view**: Player's own scores are automatically decrypted and displayed (magic! ✨)
- 📈 **Ranking**: Automatic sorting by score (client-side, super fast! 🚀)

### ⛓️ Blockchain Integration
- 🌐 **Sepolia Testnet**: Deployment on Ethereum Sepolia (real blockchain, real privacy! 🔗)
- 💼 **Wallet Connect**: Support for various wallets via ConnectKit (use your favorite wallet! 🎯)
- ⛽ **Gasless transactions**: Use of FHE Relayer for processing encrypted data (no gas worries! 🎉)

## 📋 Smart Contract - The Backbone! ⚙️

### 📝 ScoreManager Contract

**Contract Address:** 🏠
```
0xD0C1bfBDfd7e1E01Cb5540B2643fD36370f7097f
```

**Network:** 🌐 Sepolia Testnet

**Check it out on Etherscan:** 👉 [View Contract](https://sepolia.etherscan.io/address/0xD0C1bfBDfd7e1E01Cb5540B2643fD36370f7097f)

### 🎯 Main Contract Functions

- `submitScore(bytes32 encryptedScore)` - Submit your encrypted score! 📤
- `getPlayerEncryptedScore(address)` - Get player's encrypted score (still encrypted! 🔐)
- `getAllEncryptedScores()` - Get all encrypted scores and addresses (all encrypted! 🔐🔐🔐)
- `getEncryptedScoreMetadata(address)` - Get metadata without revealing the score (smart! 🧠)

### 📊 Data Structure

```solidity
struct Score {
    address player;           // Who scored? 👤
    bytes32 encryptedScore;   // FHE handle (the secret! 🔐)
    uint256 timestamp;        // When did they score? ⏰
    bool exists;              // Does it exist? ✅
}
```

The contract stores only **FHE handles** (bytes32), which are references to encrypted data in FHEVM. The actual scores are **never revealed** on the blockchain! 🎭✨

## 🛠 Tech Stack - What Powers This Beast! 💪

### 🎨 Frontend
- **Next.js 14** - React framework with App Router (modern and fast! ⚡)
- **TypeScript** - Code typing (catch bugs before they bite! 🐛)
- **Tailwind CSS** - Styling (beautiful by default! 🎨)
- **React Hooks** - State management (clean and organized! 🧹)

### ⛓️ Blockchain & Crypto
- **Ethereum Sepolia** - Test network (play with real blockchain! 🔗)
- **Wagmi** - React hooks for Ethereum (developer-friendly! 👨‍💻)
- **ConnectKit** - UI for wallet connection (sexy wallet UI! 💼)
- **Viem** - Utilities for Ethereum (powerful tools! 🔧)

### 🔐 FHE
- **@zama-fhe/relayer-sdk** - SDK for working with FHEVM (encryption magic! ✨)
- **FHE Relayer** - Service for processing encrypted data (privacy guardian! 🛡️)

### 🛠 Development
- **Hardhat** - Development environment for smart contracts (contracts made easy! 📝)
- **Solidity 0.8.20** - Smart contract language (the blockchain language! 💎)

## 🚀 Quick Start - Let's Get This Party Started! 🎉

### 📦 Installation

```bash
npm install --legacy-peer-deps
```

*Installing dependencies like a boss! 💪*

### ⚙️ Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_SCORE_MANAGER_ADDRESS=0xD0C1bfBDfd7e1E01Cb5540B2643fD36370f7097f
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_for_deployment
```

*Configure your environment and you're good to go! 🎯*

### 🏃 Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

*Now you're playing locally! 🎮*

## 📦 Contract Deployment - Deploy Like a Pro! 🚀

To deploy the contract on Sepolia:

```bash
npm run deploy:sepolia
```

Or use the simplified script:

```bash
node scripts/deploy-simple.js
```

*Deploy your contract and watch the magic happen! ✨*

## 🔒 Security and Privacy - Your Data is Safe! 🛡️

- 🔐 **FHE encryption**: Scores are encrypted before submission to the blockchain (nobody can see! 👁️)
- 💾 **Local storage**: Original scores are stored only in the user's browser (your browser, your data! 🖥️)
- 🔑 **Privacy**: Only the owner can decrypt their own scores (exclusive access! 🎫)
- 👁️ **Transparency**: All transactions are visible on the blockchain, but data is encrypted (best of both worlds! 🌍)

## 📁 Project Structure - Where's Everything? 📂

```
wallet-7/
├── app/                    # Next.js pages 📄
│   ├── page.tsx           # Home page 🏠
│   ├── play/              # Game page 🎮
│   └── leaderboard/       # Leaderboard page 📊
├── components/            # React components ⚛️
│   └── DinoGame.tsx      # Game component 🦕
├── contracts/            # Smart contracts 📝
│   └── ScoreManager.sol  # Score contract 📊
├── hooks/                # React hooks 🎣
│   └── useScoreManager.ts # Hook for contract interaction 🔗
├── lib/                  # Utilities 🛠️
│   └── fheEncryption.ts  # FHE functions 🔐
└── scripts/              # Deployment scripts 🚀
```

## 🎮 How to Play - Let's Jump! 🦘

1. **💼 Connect your wallet** - Use ConnectKit to connect MetaMask or another wallet (connect and go! 🚀)
2. **🎮 Start playing** - Click "Play Game" on the home page (let's do this! 💪)
3. **🦘 Play** - Use SPACE or ↑ to jump, avoid obstacles (jump like a pro! 🏃)
4. **📤 Submit your score** - After game over, submit your encrypted score to the blockchain (secure submission! 🔐)
5. **📊 Check the leaderboard** - View the leaderboard with encrypted scores from other players (see the competition! 👀)
6. **🔓 Decrypt your score** - Click "Decrypt" next to your score to view the value (reveal your greatness! ✨)

*Pro tip: Practice makes perfect! 🎯*

## 🔗 Useful Links - Explore More! 🔍

- **🌐 Live Demo**: [https://dino-game-fhe.vercel.app](https://dino-game-fhe.vercel.app)
- **📊 Contract on Sepolia Explorer**: [Etherscan](https://sepolia.etherscan.io/address/0xD0C1bfBDfd7e1E01Cb5540B2643fD36370f7097f)
- **📚 Zama FHEVM**: [Documentation](https://docs.zama.ai/fhevm)
- **💧 Sepolia Faucet**: [Get test ETH](https://sepoliafaucet.com/)

*All the links you need in one place! 📎*

## 📄 License

MIT 🎉

---

**⚠️ Note**: This is a demonstration application using the Sepolia test network. Test ETH is required to pay for gas fees. Don't worry, it's free! 🆓💰

**🎮 Enjoy the game and keep your scores encrypted! 🔐✨**
