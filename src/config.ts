// Network configurations
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
};

// Contract addresses
export const contractAddresses = {
  baseSepolia: {
    operatorRegistry: '0x0000000000000000000000000000000000000000', // Replace with actual address
    restakingLST: '0x0000000000000000000000000000000000000000',    // Replace with actual address
    USDC: '0xf12F7584143D17169905D7954D3DEab8942a310d', // Example address - replace with actual
    PUSDC: '0x52d336d5fB92A28a95fE22A089eb4c99209263D6', // Example address - replace with actual
  },
};

// Function to get contract address based on network
export const getContractAddress = (
  contractName: keyof typeof contractAddresses.baseSepolia,
  chainId: number
): string => {
  // Default to baseSepolia
  if (chainId === supportedChains.baseSepolia.id) {
    return contractAddresses.baseSepolia[contractName];
  }
  
  // Add more chain conditions as needed
  
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
  
  // Default to baseSepolia
  return supportedChains.baseSepolia.rpcUrls.default.http[0];
};

// Explorer URLs
export const getExplorerUrl = (chainId: number): string => {
  if (chainId === supportedChains.baseSepolia.id) {
    return supportedChains.baseSepolia.blockExplorers.default.url;
  }
  
  // Default to baseSepolia
  return supportedChains.baseSepolia.blockExplorers.default.url;
};

// Helper to format transaction URL
export const getTransactionUrl = (chainId: number, txHash: string): string => {
  return `${getExplorerUrl(chainId)}/tx/${txHash}`;
};

// Helper to format address URL
export const getAddressUrl = (chainId: number, address: string): string => {
  return `${getExplorerUrl(chainId)}/address/${address}`;
};

// Add more configuration options as needed
