import { NextApiRequest, NextApiResponse } from 'next';
import { ComicMetadata } from '@/types/comic';
import { pinFileToIPFS, pinJSONToIPFS } from '@/lib/ipfs/pinata';
import { IncomingForm } from 'formidable';
import { createReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const config = {
    api: { bodyParser: false }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new IncomingForm();

    try {
        const { fields, files } = await new Promise<any>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

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

        res.status(200).json({
            success: true,
            ipfsHash: IpfsHash,
            previewUrl: `/comic/${IpfsHash}`
        });

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
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