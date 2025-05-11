import { NextResponse } from 'next/server';
import { pinFileToIPFS } from '@/lib/ipfs/pinata';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const characterName = formData.get('characterName') as string;

        if (!file || !characterName) {
            return NextResponse.json({ error: 'File and characterName are required' }, { status: 400 });
        }

        // Validate file type (image)
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Pin image to IPFS
        const ipfsResponse = await pinFileToIPFS(buffer, `${characterName}-${Date.now()}.png`);

        return NextResponse.json({
            success: true,
            ipfsHash: ipfsResponse.IpfsHash,
            ipfsURI: `ipfs://${ipfsResponse.IpfsHash}`,
            characterName,
        });
    } catch (error: any) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            { error: `Failed to upload image: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}