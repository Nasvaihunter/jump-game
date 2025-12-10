# Deployment Instructions

## Prerequisites

- **Network**: Sepolia Testnet
- **Required Balance**: ~0.0005 ETH
- Node.js and npm installed
- Hardhat configured

## Steps to Deploy

1. **Get Sepolia ETH**:
   - Visit: https://sepoliafaucet.com/
   - Enter your wallet address
   - Request testnet ETH

2. **Set Environment Variables**:
   Create a `.env` file in the project root:
   ```
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
   ETHERSCAN_API_KEY=your_etherscan_api_key (optional)
   ```

3. **Deploy Contract**:
   ```bash
   npm run deploy:sepolia
   ```

3. **After Deployment**:
   - Copy the contract address from `CONTRACT_ADDRESS.txt`
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_SCORE_MANAGER_ADDRESS=0x...
     ```

4. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

## Environment Variables for Vercel

Add these in Vercel dashboard:
- `NEXT_PUBLIC_SCORE_MANAGER_ADDRESS` - Contract address (after deployment)


