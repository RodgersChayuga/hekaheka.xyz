
// app/api/payments/fiat/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ethers } from 'ethers';
import { createPaymentIntent } from '@/lib/payments/stripe';

const ETH_PRICE_USD = 2500; // Placeholder; use Chainlink in production

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amountUSD, action, recipient, pages } = body as {
            amountUSD: number;
            action: 'mint' | 'buy';
            recipient: string;
            pages?: number[];
        };

        // Validate inputs
        if (!amountUSD || amountUSD <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }
        if (!['mint', 'buy'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
        if (!recipient || !ethers.isAddress(recipient)) {
            return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
        }
        if (pages && (!Array.isArray(pages) || pages.some(p => p < 1))) {
            return NextResponse.json({ error: 'Invalid page numbers' }, { status: 400 });
        }

        // Convert USD to ETH
        const amountETH = amountUSD / ETH_PRICE_USD;
        const amountWei = ethers.parseEther(amountETH.toFixed(18));

        // Create Stripe payment intent
        const paymentIntent = await createPaymentIntent(amountUSD, {
            action,
            recipient,
            amountETH: amountETH.toString(),
            pages: pages?.join(',') || 'full',
        });

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            amountETH: amountETH.toString(),
            amountWei: amountWei.toString(),
            pages,
        });
    } catch (error: any) {
        console.error('Stripe payment error:', error);
        return NextResponse.json(
            { error: `Failed to process payment: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}