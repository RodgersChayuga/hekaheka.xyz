// Import environment configuration first
import '../lib/blockchain/env-config';

import { ethers } from 'ethers';
import { mintNFT } from '@/lib/blockchain/mint';
import { listNFT, buyNFT, cancelListing, getListingDetails, checkIfTokenIsListed } from '@/lib/blockchain/marketplace';
import { getComicNFTContract } from '@/lib/blockchain/contracts';

async function main() {
    try {
        // Use environment variables for addresses
        const seller = process.env.NEXT_PUBLIC_WALLET_ADDRESS_SELLER || '';
        const buyer = process.env.NEXT_PUBLIC_WALLET_ADDRESS_BUYER || '';
        const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '';

        if (!seller || !buyer || !marketplaceAddress) {
            throw new Error('Required wallet addresses or marketplace address not found in environment variables');
        }

        console.log('Using addresses:');
        console.log(`Seller: ${seller}`);
        console.log(`Buyer: ${buyer}`);
        console.log(`Marketplace: ${marketplaceAddress}`);

        // Step 1: Mint an NFT
        console.log('\nMinting NFT...');
        const mintResult = await mintNFT('ipfs://QmTestURI', 500, seller);
        console.log('Mint successful:', mintResult);
        const tokenId = parseInt(mintResult.tokenId);

        // Step 2: Approve marketplace to transfer NFT
        console.log('\nApproving marketplace...');
        const comicNFT = getComicNFTContract(true);
        const approveTx = await comicNFT.setApprovalForAll(marketplaceAddress, true);
        await approveTx.wait();
        console.log('Marketplace approved');

        // Step 3: List the NFT
        console.log('\nListing NFT...');
        const listResult = await listNFT(tokenId, '1.0', seller);
        console.log('List successful:', listResult);
        const listingId = parseInt(listResult.listingId);

        // Step 4: Get listing details
        console.log('\nFetching listing details...');
        const listingDetails = await getListingDetails(listingId);
        console.log('Listing details:', listingDetails);

        // Step 5: Check if token is listed
        console.log('\nChecking if token is listed...');
        const listCheck = await checkIfTokenIsListed(tokenId);
        console.log('Token listing status:', listCheck);

        // Step 6: Buy the NFT
        console.log('\nBuying NFT...');
        const buyResult = await buyNFT(listingId, buyer, '1.0');
        console.log('Buy successful:', buyResult);

        // Step 7: List again to test cancellation
        console.log('\nListing NFT again for cancellation test...');
        await comicNFT.setApprovalForAll(marketplaceAddress, true); // Re-approve
        const listResult2 = await listNFT(tokenId, '1.5', seller);
        console.log('List successful:', listResult2);
        const listingId2 = parseInt(listResult2.listingId);

        // Step 8: Cancel the listing
        console.log('\nCanceling listing...');
        const cancelResult = await cancelListing(listingId2, seller);
        console.log('Cancel successful:', cancelResult);

        // Step 9: Verify token is no longer listed
        console.log('\nChecking if token is listed after cancellation...');
        const finalCheck = await checkIfTokenIsListed(tokenId);
        console.log('Final listing status:', finalCheck);

    } catch (error) {
        console.error('Marketplace test failed:', error);
    }
}

main().catch(console.error);