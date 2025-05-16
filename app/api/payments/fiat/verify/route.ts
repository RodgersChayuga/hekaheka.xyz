import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { ethers } from 'ethers';
import ComicNFT from '@/contracts/ComicNFT.json';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-04-30.basil' });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== 'GET') {
//         return res.status(405).json({ error: 'Method not allowed' });
//     }

//     const { session_id } = req.query;

//     if (!session_id) {
//         return res.status(400).json({ error: 'Session ID is required' });
//     }

//     try {
//         const session = await stripe.checkout.sessions.retrieve(session_id as string);
//         if (session.payment_status !== 'paid') {
//             return res.status(400).json({ error: 'Payment not completed' });
//         }

//         const { plan, ipfsHash } = session.metadata || {};
//         if (!plan || !ipfsHash) {
//             return res.status(400).json({ error: 'Invalid session metadata' });
//         }

//         // Mint NFT (mocked, replace with actual contract call)
//         const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
//         const contract = new ethers.Contract(
//             process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
//             ComicNFT.abi,
//             provider
//         );
//         const tokenId = Math.floor(Math.random() * 1000).toString(); // Replace with actual minting

//         return res.status(200).json({ success: true, tokenId });
//     } catch (error) {
//         console.error('Verify error:', error);
//         return res.status(500).json({ error: 'Failed to verify payment' });
//     }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { session_id } = req.query;

    if (!session_id) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id as string);
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Payment not completed' });
        }

        // Mocked tokenId retrieval (replace with database query or contract call)
        const tokenId = Math.floor(Math.random() * 1000).toString(); // Replace with actual retrieval

        return res.status(200).json({ success: true, tokenId });
    } catch (error) {
        console.error('Verify error:', error);
        return res.status(500).json({ error: 'Failed to verify payment' });
    }
}