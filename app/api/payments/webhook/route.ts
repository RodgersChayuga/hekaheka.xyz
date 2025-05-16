import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { ethers } from 'ethers';
import ComicNFT from '@/contracts/ComicNFT.json';

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to handle raw webhook payload
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-04-30.basil' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const { plan, ipfsHash } = session.metadata || {};

                if (!plan || !ipfsHash) {
                    console.error('Missing metadata in session:', session.id);
                    return res.status(400).json({ error: 'Invalid session metadata' });
                }

                // Mint NFT on Base blockchain
                const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
                const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider); // Add PRIVATE_KEY to .env.local
                const contract = new ethers.Contract(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                    ComicNFT.abi,
                    wallet
                );

                const royalty = 1000; // 10% royalty (1000 basis points)
                const tx = await contract.mintComic(`ipfs://${ipfsHash}`, royalty);
                const receipt = await tx.wait();
                const tokenId = receipt.logs
                    .filter((log: any) => log.eventName === 'Transfer')
                    .map((log: any) => log.args.tokenId.toString())[0];

                // Optionally store tokenId in a database or notify the user
                console.log(`Minted NFT with tokenId ${tokenId} for session ${session.id}`);

                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log(`Checkout session expired: ${session.id}`);
                // Optionally notify user or clean up
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({ error: 'Failed to process webhook' });
    }
}