// Network configurations
import { hardhat, baseSepolia } from "viem/chains";

// Custom hardhat configuration that matches Base Sepolia
const hardhatWithBaseSepolia = {
  ...hardhat,
  id: 31337,
  name: 'Hardhat',
  network: 'hardhat',
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

export const supportedChains = {
  baseSepolia: {
    id: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://sepolia.base.org'],
      },
      public: {
        http: ['https://sepolia.base.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'BaseScan',
        url: 'https://sepolia.basescan.org',
      },
    },
    testnet: true,
  },
  hardhat: hardhatWithBaseSepolia,
};

// Contract addresses
export const contractAddresses = {
  baseSepolia: {   // Replace with actual address
    USDC: '0xf12F7584143D17169905D7954D3DEab8942a310d', // Example address - replace with actual
    PUSDC: '0x52d336d5fB92A28a95fE22A089eb4c99209263D6', // Example address - replace with actual
    LST:'0x61edDE0E4B97D878C14F5f5706309d4572550Afa',
    Eigen:'',
    Operator:'',
  },
  hardhat: {
    USDC: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    PUSDC: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    LST:'0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    Eigen:'0x0165878A594ca255338adfa4d48449f69242Eb8F',
    Operator:'0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    LoanManager:'0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  }
};

// Function to get contract address based on network
export const getContractAddress = (
  contractName: keyof typeof contractAddresses.baseSepolia,
  chainId: number
): string => {
  // Base Sepolia
  if (chainId === supportedChains.baseSepolia.id) {
    return contractAddresses.baseSepolia[contractName];
  }
  
  // Hardhat
  if (chainId === supportedChains.hardhat.id) {
    return contractAddresses.hardhat[contractName];
  }
  
  // Return null if chain not supported
  return '0x0000000000000000000000000000000000000000';
};

// ABIs
export const ABIs = {
  operatorRegistry: [
    // Add ABI here
  ],
  restakingLST: [
    // Add ABI here
  ],
};

// RPC URLs
export const getRpcUrl = (chainId: number): string => {
  if (chainId === supportedChains.baseSepolia.id) {
    return supportedChains.baseSepolia.rpcUrls.default.http[0];
  }
  
  if (chainId === supportedChains.hardhat.id) {
    return supportedChains.hardhat.rpcUrls.default.http[0];
  }
  
  // Default to baseSepolia
  return supportedChains.baseSepolia.rpcUrls.default.http[0];
};

// Explorer URLs
export const getExplorerUrl = (chainId: number): string => {
  if (chainId === supportedChains.baseSepolia.id) {
    return supportedChains.baseSepolia.blockExplorers.default.url;
  }
  
  // Hardhat doesn't have an explorer, so we'll return an empty string
  if (chainId === supportedChains.hardhat.id) {
    return '';
  }
  
  // Default to baseSepolia
  return supportedChains.baseSepolia.blockExplorers.default.url;
};

// Helper to format transaction URL
export const getTransactionUrl = (chainId: number, txHash: string): string => {
  const explorerUrl = getExplorerUrl(chainId);
  if (!explorerUrl) return '';
  return `${explorerUrl}/tx/${txHash}`;
};

// Helper to format address URL
export const getAddressUrl = (chainId: number, address: string): string => {
  const explorerUrl = getExplorerUrl(chainId);
  if (!explorerUrl) return '';
  return `${explorerUrl}/address/${address}`;
};

// Add more configuration options as needed
