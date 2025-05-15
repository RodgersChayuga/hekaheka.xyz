import { ethers } from 'ethers';

/**
 * Creates and returns an ethers provider using the RPC URL from environment variables
 */
export function getProvider(): ethers.JsonRpcProvider {
    const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;

    if (!rpcUrl) {
        throw new Error('NEXT_PUBLIC_BASE_RPC_URL is not set in environment variables');
    }

    return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Creates and returns a signer using the private key from environment variables
 */
export function getSigner(): ethers.Wallet {
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error('PRIVATE_KEY is not set in environment variables');
    }

    const provider = getProvider();
    return new ethers.Wallet(privateKey, provider);
}

/**
 * Creates and returns a signer for a specific address
 * @param address The wallet address to get signer for
 */
export function getSignerForAddress(address: string): ethers.Wallet {
    // In a real scenario, you'd need to handle different private keys for different addresses
    // For testing, we can just use the main private key
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error('PRIVATE_KEY is not set in environment variables');
    }

    const provider = getProvider();
    return new ethers.Wallet(privateKey, provider);
}