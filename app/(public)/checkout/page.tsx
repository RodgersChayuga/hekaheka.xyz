
"use client"

import { PricingPlan } from "./PricingPlan";
import React, { useState } from 'react'

type Props = {}

function page({ }: Props) {

    // State management for basic plan
    const [selectedBasicOption, setSelectedBasicOption] = useState('stripe');

    // State management for advanced plan
    const [selectedAdvancedOption, setSelectedAdvancedOption] = useState('stripe');

    // Handlers for checkout clicks
    const handleBasicCheckout = () => {
        console.log('Basic plan checkout:', selectedBasicOption);
        // Add your Stripe/Crypto logic here
    };

    const handleAdvancedCheckout = () => {
        console.log('Advanced plan checkout:', selectedAdvancedOption);
        // Add your Stripe/Crypto logic here
    };

    return (
        <div className="flex gap-8 justify-center p-8">
            <PricingPlan
                title="Single Page"
                subtitle="For Student Use"
                coverImage="/image-placeholder.jpg"
                options={[
                    {
                        id: "stripe",
                        name: "Use Stripe",
                        price: "$100",
                        description: "Single Page",
                        period: "One-time payment"
                    },
                    {
                        id: "crypto",
                        name: "Use Crypto",
                        price: "0.05 ETH",
                        description: "",
                        period: "One time payment"
                    }
                ]}
                selectedOption={selectedBasicOption}
                onOptionChange={setSelectedBasicOption}
                ctaText="CHECKOUT"
                onCtaClick={handleBasicCheckout}
            />

            <PricingPlan
                title="Full Storybook"
                subtitle="For Professional Use"
                coverImage="/image-placeholder.jpg"
                options={[
                    {
                        id: "stripe",
                        name: "Use Stripe",
                        price: "$300/month",
                        description: "Full access",
                        period: "Monthly subscription"
                    },
                    {
                        id: "crypto",
                        name: "Use Crypto",
                        price: "0.5 ETH",
                        description: "",
                        period: "One time payment"
                    }
                ]}
                selectedOption={selectedAdvancedOption}
                onOptionChange={setSelectedAdvancedOption}
                ctaText="CHECKOUT"
                onCtaClick={handleAdvancedCheckout}
            />
        </div>
    );
}


export default page