// Import environment configuration first
import '../lib/blockchain/env-config';

import { mintNFT } from '@/lib/blockchain/mint';

async function main() {
    try {
        const recipient = process.env.NEXT_PUBLIC_WALLET_ADDRESS_SELLER || ''; // Replace with your wallet address
        const result = await mintNFT(
            'ipfs://QmTestURI',
            500,
            recipient
        );
        console.log('Mint successful:', result);
    } catch (error) {
        console.error('Mint failed:', error);
    }
}

main().catch(console.error);