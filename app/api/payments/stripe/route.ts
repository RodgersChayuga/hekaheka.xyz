import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-04-30.basil' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { plan, ipfsHash } = req.body;

    if (!plan || !ipfsHash) {
        return res.status(400).json({ error: 'Plan and IPFS hash are required' });
    }

    try {
        const price = plan === 'basic' ? 10000 : 30000; // $100 or $300 in cents
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan === 'basic' ? 'Single Page Comic' : 'Full Storybook Comic',
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&ipfsHash=${ipfsHash}`,
            cancel_url: `${req.headers.origin}/mint`,
            metadata: { plan, ipfsHash },
        });

        return res.status(200).json({ sessionId: session.id, success: true });
    } catch (error) {
        console.error('Stripe error:', error);
        return res.status(500).json({ error: 'Failed to create checkout session' });
    }
}