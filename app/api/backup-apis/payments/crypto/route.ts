
// app/api/payments/crypto/route.ts

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { verifyCryptoPayment } from '@/lib/payments/metamask';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactionHash, action, recipient, amountETH, pages } = body as {
            transactionHash: string;
            action: 'mint' | 'buy';
            recipient: string;
            amountETH: string;
            pages?: number[];
        };

        // Validate inputs
        if (!transactionHash || !transactionHash.match(/^0x[a-fA-F0-9]{64}$/)) {
            return NextResponse.json({ error: 'Invalid transaction hash' }, { status: 400 });
        }
        if (!['mint', 'buy'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
        if (!recipient || !ethers.isAddress(recipient)) {
            return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
        }
        if (!amountETH || isNaN(parseFloat(amountETH)) || parseFloat(amountETH) <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }
        if (pages && (!Array.isArray(pages) || pages.some(p => p < 1))) {
            return NextResponse.json({ error: 'Invalid page numbers' }, { status: 400 });
        }

        // Verify payment
        const paymentDetails = await verifyCryptoPayment(transactionHash, recipient, amountETH);

        return NextResponse.json({
            success: true,
            transactionHash,
            amountETH,
            recipient,
            pages,
            blockNumber: paymentDetails.blockNumber,
        });
    } catch (error: any) {
        console.error('Crypto payment error:', error);
        return NextResponse.json(
            { error: `Failed to process crypto payment: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}