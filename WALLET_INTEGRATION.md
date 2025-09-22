# Wallet Integration with wagmi + RainbowKit

## Overview
This project now includes wallet connection functionality using wagmi and RainbowKit, allowing users to connect their Web3 wallets to the Token Portfolio application.

## Features
- **Multi-wallet support**: Connect with MetaMask, WalletConnect, Coinbase Wallet, and more
- **Multiple networks**: Support for Ethereum, Polygon, Arbitrum, Optimism, Base, and Sepolia
- **Redux integration**: Wallet state is automatically synced with the Redux store
- **Real-time updates**: Wallet connection status updates in real-time

## Setup Instructions

### 1. Install Dependencies
```bash
npm install wagmi @rainbow-me/rainbowkit viem
```

### 2. Get WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID
4. Replace `YOUR_PROJECT_ID` in `src/config/wagmi.ts`

### 3. Configuration
The wallet configuration is set up in `src/config/wagmi.ts` with support for:
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Base
- Sepolia (testnet)

## Usage

### Connect Wallet
Users can click the "Connect Wallet" button in the header to:
- Choose from multiple wallet options
- Connect to their preferred wallet
- Switch between supported networks

### Wallet State
The wallet connection state is automatically managed and available throughout the app:
- **Connection status**: Whether a wallet is connected
- **Wallet address**: The connected wallet's address
- **Chain ID**: The current network's chain ID

### Redux Integration
Wallet state is stored in Redux and can be accessed using:
```typescript
const wallet = useSelector((state: any) => state.watchlist.wallet);
```

## Components

### Header Component
- Replaced the static "Connect Wallet" button with RainbowKit's `ConnectButton`
- Automatically syncs wallet state with Redux

### WalletStatus Component
- Displays current wallet connection information
- Shows truncated wallet address and chain ID
- Only visible when a wallet is connected

## Hooks

### useWalletConnection
- Custom hook that syncs wagmi wallet state with Redux
- Automatically updates Redux store when wallet connection changes
- Used in the Header component

## Supported Wallets
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet
- Trust Wallet
- And many more through WalletConnect

## Network Support
- **Ethereum Mainnet**: For production use
- **Polygon**: Layer 2 scaling solution
- **Arbitrum**: Optimistic rollup
- **Optimism**: Optimistic rollup
- **Base**: Coinbase's Layer 2
- **Sepolia**: Ethereum testnet for development

## Security Notes
- Never store private keys in the application
- All wallet operations are handled by the user's wallet
- The app only reads public wallet information
- Users maintain full control of their funds

## Troubleshooting

### Common Issues
1. **"Cannot find module" errors**: Make sure all dependencies are installed
2. **Wallet not connecting**: Check if the wallet extension is installed and unlocked
3. **Wrong network**: Use the network switcher in the wallet or RainbowKit modal

### Development
- Use Sepolia testnet for testing
- Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com)
- Check browser console for any error messages

## Future Enhancements
- Add wallet balance display
- Implement transaction history
- Add token transfer functionality
- Support for more networks
- Custom wallet themes
