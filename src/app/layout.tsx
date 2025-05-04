'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { rpcConfig } from '@/config';

// Rainbow Kit imports
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const inter = Inter({ subsets: ['latin'] });

// Configure RainbowKit with our custom Pharos chain
const config = getDefaultConfig({
  appName: 'Pharos Money',
  projectId: 'YOUR_PROJECT_ID',
  chains: [hardhat],
  ssr: true,
  pollingInterval: rpcConfig.pollingInterval,
});

// Create a client
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div className="min-h-screen bg-black">
                <Navbar />
                {children}
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}