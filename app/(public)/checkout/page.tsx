"use client";

import { PricingPlan } from "./PricingPlan";
import { useState } from "react";
import { useAccount } from 'wagmi';

export default function CheckoutPage() {
    const [selectedBasicOption, setSelectedBasicOption] = useState("stripe");
    const [selectedAdvancedOption, setSelectedAdvancedOption] = useState("stripe");
    const { isConnected, address } = useAccount();

    return (
        <div className="flex gap-8 justify-center p-8">
            <PricingPlan
                title="Single Page"
                subtitle="For Student Use"
                coverImage="/comics/1.jpeg"
                options={[
                    {
                        id: "stripe",
                        name: "Use Stripe",
                        price: 100,
                        description: "Pay with credit card",
                        period: "One-time payment",
                    },
                    {
                        id: "crypto",
                        name: "Use Crypto",
                        price: 0.000005,
                        description: "Pay with cryptocurrency",
                        period: "One-time payment",
                        currency: "ETH "
                    },
                ]}
                selectedOption={selectedBasicOption}
                onOptionChange={setSelectedBasicOption}
                ctaText="CHECKOUT"
                comicId="single-page-comic"
                isConnected={isConnected}
                address={address || ''}
            />

            <PricingPlan
                title="Full Storybook"
                subtitle="For Professional Use"
                coverImage="/comics/1.jpeg"
                options={[
                    {
                        id: "stripe",
                        name: "Use Stripe",
                        price: 300,
                        description: "Pay with credit card",
                        period: "Monthly subscription",
                    },
                    {
                        id: "crypto",
                        name: "Use Crypto",
                        price: 0.000005,
                        description: "Pay with cryptocurrency",
                        period: "One-time payment",
                        currency: "ETH "
                    },
                ]}
                selectedOption={selectedAdvancedOption}
                onOptionChange={setSelectedAdvancedOption}
                ctaText="CHECKOUT"
                comicId="full-storybook-comic"
                isConnected={isConnected}
                address={address || ''}
            />
        </div>
    );
}