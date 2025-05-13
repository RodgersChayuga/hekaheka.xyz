"use client";

import { PricingPlan } from "./PricingPlan";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {};

function CheckoutPage({ }: Props) {
    const [selectedBasicOption, setSelectedBasicOption] = useState("stripe");
    const [selectedAdvancedOption, setSelectedAdvancedOption] = useState("stripe");

    const handleCheckout = async (plan: "basic" | "advanced", option: string) => {
        try {
            const response = await fetch(`/api/payments/${option}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan, option }),
            });

            if (!response.ok) {
                throw new Error("Payment failed");
            }

            const { success, tokenId } = await response.json();
            if (success) {
                toast.success(`Successfully purchased ${plan} plan!`);
                // Optionally redirect to my-comics with tokenId
            } else {
                throw new Error("Payment processing error");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Failed to process payment. Please try again.");
        }
    };

    return (
        <div className="flex gap-8 justify-center p-8  ">
            <PricingPlan
                title="Single Page"
                subtitle="For Student Use"
                coverImage="/images/image-placeholder.jpg" // TODO: Add actual image from the storybook
                options={[
                    {
                        id: "stripe",
                        name: "Use Stripe",
                        price: "$100",
                        description: "",
                        period: "One-time payment",
                    },
                    {
                        id: "crypto",
                        name: "Use Crypto",
                        price: "0.05 ETH",
                        description: "",
                        period: "One-time payment",
                    },
                ]}
                selectedOption={selectedBasicOption}
                onOptionChange={setSelectedBasicOption}
                ctaText="CHECKOUT"
                onCtaClick={() => handleCheckout("basic", selectedBasicOption)}
            />

            <PricingPlan
                title="Full Storybook"
                subtitle="For Professional Use"
                coverImage="/images/image-placeholder.jpg" // TODO: Add actual image from the storybook
                options={[
                    {
                        id: "stripe",
                        name: "Use Stripe",
                        price: "$300",
                        description: "",
                        period: "One-time payment",
                    },
                    {
                        id: "crypto",
                        name: "Use Crypto",
                        price: "0.5 ETH",
                        description: "",
                        period: "One-time payment",
                    },
                ]}
                selectedOption={selectedAdvancedOption}
                onOptionChange={setSelectedAdvancedOption}
                ctaText="CHECKOUT"
                onCtaClick={() => handleCheckout("advanced", selectedAdvancedOption)}
            />
        </div>
    );
}

export default CheckoutPage;