import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import ComicNFT from '@/contracts/ComicNFT.json';
import ComicMarketplace from '@/contracts/ComicMarketplace.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { tokenId } = req.query;

    if (!tokenId) {
        return res.status(400).json({ error: 'Token ID is required' });
    }

    try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
        const nftContract = new ethers.Contract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
            ComicNFT.abi,
            provider
        );
        const marketplaceContract = new ethers.Contract(
            process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
            ComicMarketplace.abi,
            provider
        );

        const tokenURI = await nftContract.tokenURI(tokenId);
        const owner = await nftContract.ownerOf(tokenId);
        const listing = await marketplaceContract.listings(tokenId);

        // Mocked metadata (replace with IPFS fetch)
        const comic = {
            tokenId,
            metadata: {
                name: `Comic ${tokenId}`,
                image: '/images/image-placeholder.jpg',
                description: 'A unique comic NFT',
            },
            price: ethers.formatEther(listing.price || '0'),
            owner,
            pages: [{ image: '/images/image-placeholder.jpg', text: 'Sample page' }],
        };

        return res.status(200).json({ comic });
    } catch (error) {
        console.error('Get comic error:', error);
        return res.status(500).json({ error: 'Failed to fetch comic' });
    }
}