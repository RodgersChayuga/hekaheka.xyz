import { NextResponse } from 'next/server';
import { generateComicStory } from '@/lib/ai/generateComic';
import { ComicMetadata } from '@/types/comic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { story, images } = body as {
            story: string;
            images: Array<{ characterName: string; ipfsURI: string }>;
        };

        // Validate inputs
        if (!story || typeof story !== 'string') {
            return NextResponse.json({ error: 'Story is required' }, { status: 400 });
        }
        if (!images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
        }
        if (images.length > 4) {
            return NextResponse.json({ error: 'Maximum 4 characters allowed' }, { status: 400 });
        }

        // Generate comic using AgentKit (onchain)
        const comic = await generateComicStory(story, images);

        return NextResponse.json({
            success: true,
            comic: comic as ComicMetadata,
        });
    } catch (error: any) {
        console.error('Comic generation error:', error);
        return NextResponse.json(
            { error: `Failed to generate comic: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}