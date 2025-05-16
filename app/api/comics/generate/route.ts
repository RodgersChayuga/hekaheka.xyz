import { NextRequest, NextResponse } from 'next/server';
import { pinFileToIPFS, pinJSONToIPFS } from '@/lib/ipfs';

export const runtime = 'nodejs';

// Predefined comic pages
const COMIC_PAGES = [
    '/images/comic-page-1.png',
    '/images/comic-page-2.png',
    '/images/comic_sun.png',
    '/images/comic_sun_left.png',
    '/images/comic_sun_right.png',
    '/images/comic_cloud.png',
    '/images/comic_star.png',
    '/images/comic_thunder.png',
    '/images/comic_rays.png'
];

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const story = formData.get('story') as string;
        const characters = JSON.parse(formData.get('characters') as string);

        if (!story || !Array.isArray(characters)) {
            return NextResponse.json(
                { error: 'Invalid input data' },
                { status: 400 }
            );
        }

        // 1. Process character images with IPFS
        const imageHashes: Record<string, string> = {};
        for (const character of characters) {
            const file = formData.get(`character-image-${character}`) as File | null;
            if (file) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const cid = await pinFileToIPFS(buffer, `${character}-image`);
                imageHashes[character] = cid;
            }
        }

        // 2. Generate simulated comic pages
        const numPages = Math.min(characters.length, COMIC_PAGES.length);
        const pages = Array.from({ length: numPages }, (_, i) => ({
            character: characters[i],
            text: `Page ${i + 1}: ${story.split('.')[i] || 'A moment in the story...'}`,
            imageUrl: COMIC_PAGES[i]
        }));

        // 3. Store comic metadata on IPFS
        const comicData = {
            name: `ComicChain #${Date.now()}`,
            description: story.slice(0, 200),
            pages: pages.map((page, i) => ({
                ...page,
                userImageHash: imageHashes[page.character],
                text: `Page ${i + 1}: ${page.text}`
            })),
            createdAt: new Date().toISOString()
        };

        const ipfsHash = await pinJSONToIPFS(comicData);

        return NextResponse.json({
            ipfsHash,
            pages: comicData.pages
        }, { status: 200 });

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate comic' },
            { status: 500 }
        );
    }
}