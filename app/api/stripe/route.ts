// app/api/stripe/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
});

export async function POST(req: Request) {
    try {
        const { price, comicId } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Comic Book',
                            description: 'Your personalized comic book',
                        },
                        unit_amount: price * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
            metadata: {
                comicId,
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { error: 'Error creating checkout session' },
            { status: 500 }
        );
    }
}