import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log(`Loading environment from ${envLocalPath}`);
  const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
} else {
  console.warn('.env.local file not found, falling back to environment variables');
  // Optionally fall back to regular .env
  dotenv.config();
}

// Get environment variables with fallbacks
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

// Log configuration status (without revealing private key)
console.log(`Using RPC URL: ${BASE_RPC_URL}`);
console.log(`Private key configured: ${PRIVATE_KEY ? 'Yes' : 'No'}`);

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    baseSepolia: {
      url: BASE_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 84532  // Base Sepolia chain ID
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