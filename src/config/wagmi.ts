import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Token Portfolio',
  projectId: '2fb26df2463e6013a7c3272c98d52c11', // Get this from https://cloud.walletconnect.com
  chains: [mainnet, polygon, arbitrum, optimism, base, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
