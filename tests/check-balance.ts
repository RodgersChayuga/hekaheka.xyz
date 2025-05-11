// Import environment configuration first
import '../lib/blockchain/env-config';

import { ethers } from 'ethers';
import { getProvider } from '@/lib/blockchain/ethers';

async function main() {
    const provider = getProvider();
    const deployer = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xB62caA54E5d6b2BA069dd6A0A862f5e410DcFddC';
    const seller = process.env.NEXT_PUBLIC_WALLET_ADDRESS_SELLER || '0x3603326C24bB88Bd0F39E00a919088932112A86f';
    const buyer = process.env.NEXT_PUBLIC_WALLET_ADDRESS_BUYER || '0xf155Ba24bBB5cE5a0cCF1D9b247b1F5D3Aa4AF2F';
    const deployerBalance = await provider.getBalance(deployer);
    const sellerBalance = await provider.getBalance(seller);
    const buyerBalance = await provider.getBalance(buyer);
    console.log(`Deployer balance: ${ethers.formatEther(deployerBalance)} ETH`);
    console.log(`Seller balance: ${ethers.formatEther(sellerBalance)} ETH`);
    console.log(`Buyer balance: ${ethers.formatEther(buyerBalance)} ETH`);
}

main().catch(console.error);