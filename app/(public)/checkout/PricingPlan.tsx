"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PricingOption = {
    id: string;
    name: string;
    price: number;
    description: string;
    period: string;
    currency?: string;
};

interface PricingPlanProps {
    title: string;
    subtitle: string;
    coverImage: string;
    options: PricingOption[];
    selectedOption: string;
    onOptionChange: (value: string) => void;
    ctaText: string;
    comicId: string;
    disabled?: boolean;
    isConnected: boolean;
    address: string;
}

export const PricingPlan = ({
    title,
    subtitle,
    coverImage,
    options,
    selectedOption,
    onOptionChange,
    ctaText,
    comicId,
    disabled = false,
    isConnected,
    address,
}: PricingPlanProps) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const { sendTransaction, data: txHash, error: txError } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const handleCheckout = async () => {
        if (isLoading || isConfirming) return;

        try {
            setIsLoading(true);
            const selectedPlan = options.find(opt => opt.id === selectedOption);

            if (!selectedPlan) {
                toast.error('Please select a payment option');
                return;
            }

            // Handle crypto payment
            if (selectedPlan.id === 'crypto') {
                if (!isConnected || !address) {
                    toast.error('Please connect your wallet first');
                    return;
                }

                const paymentAddress = process.env.NEXT_PUBLIC_PAYMENT_ADDRESS as `0x${string}`;
                if (!paymentAddress) {
                    toast.error('Payment address not configured');
                    return;
                }

                try {
                    sendTransaction({
                        to: paymentAddress,
                        value: ethers.parseEther(selectedPlan.price.toString()),
                    });

                    toast.info('Transaction sent! Waiting for confirmation...');
                } catch (error: any) {
                    console.error('Crypto transaction error:', error);
                    toast.error(error.message || 'Failed to send transaction');
                    return;
                }
                return;
            }

            // Handle Stripe payment
            const response = await fetch('/api/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price: selectedPlan.price,
                    comicId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create Stripe checkout session');
            }

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            if (!stripe) {
                throw new Error('Stripe failed to initialize');
            }

            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
                throw new Error(error.message);
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to process payment');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle transaction confirmation
    React.useEffect(() => {
        if (isConfirmed && receipt && txHash) {
            const verifyPayment = async () => {
                try {
                    const selectedPlan = options.find(opt => opt.id === selectedOption);
                    if (!selectedPlan) return;

                    const response = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            txHash,
                            amount: selectedPlan.price,
                            comicId,
                            address,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to verify payment');
                    }

                    toast.success('Payment verified successfully!');
                    router.push('/success');
                } catch (error: any) {
                    console.error('Verification error:', error);
                    toast.error(error.message || 'Failed to verify payment');
                }
            };

            verifyPayment();
        }
    }, [isConfirmed, receipt, txHash, address, comicId, options, router]);

    // Handle transaction errors
    React.useEffect(() => {
        if (txError) {
            console.error('Transaction error:', txError);
            toast.error(txError.message || 'Transaction failed');
            setIsLoading(false);
        }
    }, [txError]);

    return (
        <div className="w-full max-w-sm flex flex-col bg-white rounded-lg border-2 border-black overflow-hidden">
            {/* Cover Image - Full width and height */}
            <div className="relative w-full h-[400px]">
                <Image
                    src={coverImage}
                    alt={`${title} cover`}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAC0wEy3fGscAAAAABJRU5ErkJggg=="
                />
            </div>

            {/* Content section with padding */}
            <div className="p-4">
                {/* Title and subtitle */}
                <div className="space-y-1 text-left mb-3">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>

                {/* Radio options */}
                <RadioGroup
                    value={selectedOption}
                    onValueChange={onOptionChange}
                    className="space-y-2 mb-4"
                    aria-label={`Payment options for ${title}`}
                    disabled={disabled || isLoading || isConfirming}
                >
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className={cn(
                                "flex items-center justify-between rounded-lg border-2 p-2",
                                selectedOption === option.id ? "border-primary bg-primary/10" : "border-gray-200"
                            )}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={option.id} id={option.id} />
                                <Label htmlFor={option.id} className="font-medium text-sm">
                                    {option.name}
                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                </Label>
                            </div>
                            <div className="text-right">
                                <p className="text-base font-bold">
                                    {option.currency || '$'}{option.price}
                                    {option.period.includes('month') ? '/month' : ''}
                                </p>
                                <p className="text-xs text-muted-foreground">{option.period}</p>
                            </div>
                        </div>
                    ))}
                </RadioGroup>

                <CustomButton
                    onClick={handleCheckout}
                    disabled={disabled || isLoading || isConfirming}
                    className="w-full py-2 text-sm"
                >
                    {isLoading || isConfirming ? 'Processing...' : ctaText}
                </CustomButton>
            </div>
        </div>
    );
};