import { NextResponse } from 'next/server';
import { buyNFT } from '@/lib/blockchain/marketplace';
import { ethers } from 'ethers';

export async function POST(request: Request) {
    try {
        const { listingId, address, price } = await request.json();
        if (listingId === undefined || !address || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!ethers.isAddress(address)) {
            return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
        }
        if (isNaN(listingId) || listingId < 0) {
            return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 });
        }

        const result = await buyNFT(listingId, address, price);
        return NextResponse.json({
            success: true,
            listingId: result.listingId,
            tokenId: result.tokenId,
            transactionHash: result.transactionHash,
        });
    } catch (error: any) {
        console.error('Buy NFT error:', error);
        return NextResponse.json(
            { error: `Failed to buy NFT: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}