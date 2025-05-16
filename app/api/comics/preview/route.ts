import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { tokenId } = req.query;

    try {
        // Mocked comic data (replace with IPFS fetch or database query)
        const pages = [
            { image: '/images/image-placeholder.jpg', text: 'Page 1' },
            { image: '/images/image-placeholder.jpg', text: 'Page 2' },
            { image: '/images/image-placeholder.jpg', text: 'Page 3' },
        ];

        return res.status(200).json({ pages });
    } catch (error) {
        console.error('Preview error:', error);
        return res.status(500).json({ error: 'Failed to fetch comic preview' });
    }
}