import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-04-30.basil',
});

export async function createPaymentIntent(
    amountUSD: number,
    metadata: { action: string; recipient: string; amountETH: string; pages: string }
): Promise<Stripe.PaymentIntent> {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amountUSD * 100), // Convert to cents
            currency: 'usd',
            payment_method_types: ['card'],
            metadata,
        });

        return paymentIntent;
    } catch (error: any) {
        console.error('Stripe payment intent error:', error);
        throw new Error(`Failed to create payment intent: ${error.message || 'Unknown error'}`);
    }
}