import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { mintComic } from '@/lib/blockchain/mint';
import { ethers } from 'ethers';

export async function POST(request: Request) {
    const sig = request.headers.get('stripe-signature')!;
    const body = await request.text();
    try {
        const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { tokenURI, royalty } = session.metadata;
            const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
            const { tokenId } = await mintComic(tokenURI, Number(royalty), signer);
            // Notify user or update database
        }
        return NextResponse.json({ received: true });
    } catch (error) {
        return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }
}