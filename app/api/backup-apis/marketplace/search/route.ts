
// app/api/marketplace/search/route.ts

import { NextResponse } from 'next/server';
import { getListingDetails, checkIfTokenIsListed } from '@/lib/blockchain/marketplace';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tokenId = searchParams.get('tokenId');
        const listingId = searchParams.get('listingId');

        if (tokenId) {
            const parsedTokenId = parseInt(tokenId);
            if (isNaN(parsedTokenId) || parsedTokenId < 0) {
                return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 });
            }
            const result = await checkIfTokenIsListed(parsedTokenId);
            return NextResponse.json({
                success: true,
                tokenId: parsedTokenId.toString(),
                listingId: result.listingId,
                isListed: result.isListed,
            });
        } else if (listingId) {
            const parsedListingId = parseInt(listingId);
            if (isNaN(parsedListingId) || parsedListingId < 0) {
                return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
            }
            const details = await getListingDetails(parsedListingId);
            return NextResponse.json({
                success: true,
                listingId: parsedListingId.toString(),
                details,
            });
        } else {
            return NextResponse.json({ error: 'tokenId or listingId required' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Search marketplace error:', error);
        return NextResponse.json(
            { error: `Failed to search marketplace: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}