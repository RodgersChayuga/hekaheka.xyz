import { NextRequest, NextResponse } from 'next/server';
import { ComicMetadata } from '@/types/comic';
import { pinFileToIPFS, pinJSONToIPFS } from '@/lib/ipfs/pinata';
import { IncomingForm } from 'formidable';
import { createReadStream } from 'fs';

// Update to use the new App Router format
export async function POST(request: NextRequest) {
    const form = new IncomingForm();
    const formData = await request.formData();

    try {
        const fields: Record<string, string[]> = {};
        const files: Record<string, any[]> = {};

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                files[key] = [value];
            } else {
                fields[key] = [value.toString()];
            }
        }

        // Validate Inputs
        const requiredFields = ['story', 'characters'];
        for (const field of requiredFields) {
            if (!fields[field]) throw new Error(`Missing ${field} field`);
        }

        // Parse Inputs
        const story = JSON.parse(fields.story[0]);
        const characters = JSON.parse(fields.characters[0]);

        // Upload Character Images
        const characterImages = await Promise.all(
            characters.map(async (character: string) => {
                const file = files[character]?.[0];
                if (!file) throw new Error(`Missing image for ${character}`);

                const stream = createReadStream(file.filepath);
                const { IpfsHash } = await pinFileToIPFS(stream, `${character}-image`);

                return {
                    name: character,
                    images: [`ipfs://${IpfsHash}`],
                    traits: {} // Add traits if needed
                };
            })
        );

        // Generate Comic Pages (AI Integration)
        const generatedPages = await generateComicPages({
            story,
            characters: characterImages,
            options: {
                model: "stabilityai/stable-diffusion-xl-base-1.0",
                style: "comic-book"
            }
        });

        // Create Metadata
        const metadata: ComicMetadata = {
            name: `Comic: ${story.summary.substring(0, 40)}...`,
            description: story.text,
            image: characterImages[0].images[0],
            created_at: new Date().toISOString(),
            story,
            characters: characterImages,
            pages: generatedPages,
            generator: {
                version: "1.0",
                model: "stable-diffusion-xl"
            }
        };

        // Store Metadata
        const { IpfsHash } = await pinJSONToIPFS(metadata);

        return NextResponse.json({
            success: true,
            ipfsHash: IpfsHash,
            previewUrl: `/comic/${IpfsHash}`
        });

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// AI Generation Helper
async function generateComicPages(params: {
    story: any;
    characters: any[];
    options: { model: string; style: string };
}): Promise<ComicMetadata['pages']> {
    // Implement your AI integration here
    // Example using mock data:
    return [
        {
            page_number: 1,
            panel_image: "ipfs://Qm...",
            panel_text: params.story.text.split('.')[0],
            characters_present: params.characters.map(c => c.name)
        }
    ];
}