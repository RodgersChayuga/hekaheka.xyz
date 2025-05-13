
// app/api/comics/mint/route.ts

import { NextResponse } from 'next/server';
import { mintNFT } from '@/lib/blockchain/mint';
import { pinJSONToIPFS } from '@/lib/ipfs/pinata';
import { ComicMetadata } from '@/types/comic';
import { ethers } from 'ethers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { metadata, recipient, royalty } = body as {
            metadata: ComicMetadata;
            recipient: string;
            royalty: number;
        };

        // Validate inputs
        if (!metadata || !metadata.name || !metadata.description || !metadata.image) {
            return NextResponse.json({ error: 'Invalid or missing metadata' }, { status: 400 });
        }
        if (!recipient || !ethers.isAddress(recipient)) {
            return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
        }
        if (royalty < 0 || royalty > 1000) {
            return NextResponse.json({ error: 'Royalty must be between 0 and 10%' }, { status: 400 });
        }

        // Pin metadata to IPFS
        const ipfsResponse = await pinJSONToIPFS(metadata);
        const metadataURI = `ipfs://${ipfsResponse.IpfsHash}`;

        // Mint NFT
        const mintResult = await mintNFT(metadataURI, royalty, recipient);

        return NextResponse.json({
            success: true,
            tokenId: mintResult.tokenId,
            transactionHash: mintResult.transactionHash,
            metadataURI,
            ipfsHash: ipfsResponse.IpfsHash,
        });
    } catch (error: any) {
        console.error('Mint API error:', error);
        return NextResponse.json(
            { error: `Failed to mint comic: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}