import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Validate essential environment variables are set
const requiredEnvVars = [
    'PRIVATE_KEY',
    'NEXT_PUBLIC_BASE_RPC_URL',
    'NEXT_PUBLIC_WALLET_ADDRESS_SELLER',
    'NEXT_PUBLIC_WALLET_ADDRESS_BUYER',
    'NEXT_PUBLIC_CONTRACT_ADDRESS',
    'NEXT_PUBLIC_MARKETPLACE_ADDRESS',
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.warn(`Warning: ${envVar} environment variable is not set`);
    }
}