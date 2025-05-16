import type { NextApiRequest, NextApiResponse } from 'next';
import PinataSDK from '@pinata/sdk';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
    api: { bodyParser: false },
};

const pinata = new PinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_SECRET_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable({ multiples: true });
        const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const story = fields.story?.[0];
        const characters = JSON.parse(fields.characters?.[0] || '[]');

        if (!story || characters.length === 0) {
            return res.status(400).json({ error: 'Story and characters are required' });
        }

        // Simulate updated comic data (fetch existing IPFS data and merge)
        const comicData = {
            name: `HekaHeka Comic - Updated ${Date.now()}`,
            description: `Updated comic: ${story.slice(0, 100)}...`,
            pages: [], // Replace with actual page data
        };

        const pinataResponse = await pinata.pinJSONToIPFS(comicData);
        const ipfsHash = pinataResponse.IpfsHash;

        return res.status(200).json({ ipfsHash });
    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({ error: 'Failed to update comic' });
    }
}