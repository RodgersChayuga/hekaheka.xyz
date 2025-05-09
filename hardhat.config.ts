import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    baseSepolia: {
      url: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      chainId: 1337,
    },
  },
  paths: {
    sources: './contracts',
    tests: './contracts/tests',
    cache: './contracts/cache',
    artifacts: './contracts/artifacts',
  },
};

export default config;