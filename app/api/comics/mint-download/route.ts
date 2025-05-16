import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import ComicNFT from '@/contracts/ComicNFT.json';

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
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
            ComicNFT.abi,
            provider
        );

        const tokenURI = await contract.tokenURI(tokenId);
        const ipfsHash = tokenURI.replace('ipfs://', '');

        // Fetch comic data from IPFS (mocked)
        const comicData = { pages: [{ image: '/images/image-placeholder.jpg' }] }; // Replace with IPFS fetch

        return res.status(200).json({ success: true, comicData });
    } catch (error) {
        console.error('Mint-download error:', error);
        return res.status(500).json({ error: 'Failed to mint/download comic' });
    }
}