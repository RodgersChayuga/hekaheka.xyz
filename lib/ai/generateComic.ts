import { ComicMetadata } from '@/types/comic';
import { pinFileToIPFS } from "../ipfs/pinata";

export async function generateComicContent(
    prompt: string,
    characterImages: string[]
): Promise<ComicMetadata['pages']> {
    try {
        // Example implementation using Stability AI
        const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
                Accept: 'application/json',
            },
            body: JSON.stringify({
                prompt: `Comic panel: ${prompt}`,
                output_format: 'png',
                aspect_ratio: '9:16',
                model: 'stable-diffusion-xl-beta',
                style_preset: 'comic-book',
            }),
        });

        if (!response.ok) throw new Error('AI generation failed');

        const { image } = await response.json();
        const imageBuffer = Buffer.from(image, 'base64');

        // Upload generated image to IPFS
        const { IpfsHash } = await pinFileToIPFS(imageBuffer, 'generated-panel.png');

        return [{
            page_number: 1,
            panel_image: `ipfs://${IpfsHash}`,
            panel_text: prompt,
            characters_present: characterImages.map(img => img.split('/')[2]) // Extract character names
        }];
    } catch (error) {
        console.error('AI Generation Error:', error);
        throw new Error('Failed to generate comic content');
    }
}