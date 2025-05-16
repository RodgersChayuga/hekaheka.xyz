import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import ComicMarketplace from '@/contracts/ComicMarketplace.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { tokenId } = req.body;

    if (!tokenId) {
        return res.status(400).json({ error: 'Token ID is required' });
    }

    try {
        // Note: Actual purchase happens client-side in ComicListing.tsx
        // This API can validate or trigger server-side logic if needed
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Buy error:', error);
        return res.status(500).json({ error: 'Failed to purchase comic' });
    }
}