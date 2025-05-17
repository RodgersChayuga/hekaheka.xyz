// app/api/comics/generate/route.ts

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

        // Before the generateComicStory call, map the images array to just the URIs
        const characterImages = images.map(img => img.ipfsURI);
        const comic = await generateComicStory(story, characterImages);

        // Create a complete ComicMetadata object
        const comicMetadata: ComicMetadata = {
            name: `Comic: ${story.substring(0, 40)}...`,
            description: story,
            image: characterImages[0],
            created_at: new Date().toISOString(),
            story: {
                text: story,
                summary: story.substring(0, 100),
                genre: "comic"
            },
            characters: images.map(img => ({
                name: img.characterName,
                images: [img.ipfsURI],
                traits: {}
            })),
            pages: comic,
            generator: { version: "1.0", model: "stable-diffusion-xl" }
        };

        return NextResponse.json({
            success: true,
            comic: comicMetadata
        });
    } catch (error: any) {
        console.error('Comic generation error:', error);
        return NextResponse.json(
            { error: `Failed to generate comic: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}