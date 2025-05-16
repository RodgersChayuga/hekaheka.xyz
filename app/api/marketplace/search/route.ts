import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import ComicMarketplace from '@/contracts/ComicMarketplace.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.query;

    try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
            ComicMarketplace.abi,
            provider
        );

        // Mocked search (replace with contract call or database query)
        const comics = [
            {
                tokenId: '1',
                metadata: { name: 'Sample Comic', image: '/images/image-placeholder.jpg' },
                price: '0.1',
                owner: '0x123...',
            },
        ].filter((comic) => comic.metadata.name.toLowerCase().includes((query as string)?.toLowerCase() || ''));

        return res.status(200).json({ comics });
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Failed to search comics' });
    }
}