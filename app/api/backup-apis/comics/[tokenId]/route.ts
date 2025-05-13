
// app/api/comics/[tokenId]/route.ts

import { NextResponse } from 'next/server';
import { getComicNFTContract } from '@/lib/blockchain/contracts';
import { checkIfTokenIsListed } from '@/lib/blockchain/marketplace';

export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
    try {
        const tokenId = parseInt(params.tokenId);
        if (isNaN(tokenId) || tokenId < 0) {
            return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 });
        }

        const contract = getComicNFTContract(false);

        // Fetch token details
        const [owner, creator, royalty, tokenURI] = await Promise.all([
            contract.ownerOf(tokenId).catch(() => null),
            contract.getCreator(tokenId).catch(() => null),
            contract.getRoyaltyPercentage(tokenId).catch(() => null),
            contract.tokenURI(tokenId).catch(() => null),
        ]);

        if (!owner || !creator || royalty === null || !tokenURI) {
            return NextResponse.json({ error: 'Token does not exist' }, { status: 404 });
        }

        // Check listing status
        const listingStatus = await checkIfTokenIsListed(tokenId);

        return NextResponse.json({
            success: true,
            tokenId: tokenId.toString(),
            owner,
            creator,
            royalty: royalty.toString(),
            tokenURI,
            listing: {
                listingId: listingStatus.listingId,
                isListed: listingStatus.isListed,
            },
        });
    } catch (error: any) {
        console.error('Comic details API error:', error);
        return NextResponse.json(
            { error: `Failed to fetch comic details: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}