
// app/api/marketplace/list/route.ts

import { NextResponse } from 'next/server';
import { listNFT } from '@/lib/blockchain/marketplace';
import { ethers } from 'ethers';

export async function POST(request: Request) {
    try {
        const { tokenId, price, address } = await request.json();
        if (tokenId === undefined || !price || !address) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!ethers.isAddress(address)) {
            return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
        }
        if (isNaN(tokenId) || tokenId < 0) {
            return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 });
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 });
        }

        const result = await listNFT(tokenId, price, address);
        return NextResponse.json({
            success: true,
            listingId: result.listingId,
            transactionHash: result.transactionHash,
        });
    } catch (error: any) {
        console.error('List NFT error:', error);
        return NextResponse.json(
            { error: `Failed to list NFT: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}