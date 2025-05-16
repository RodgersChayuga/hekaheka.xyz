// "use client";

// import { PricingPlan } from "./PricingPlan";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { handleMint } from "@/components/MintButton";

// type Props = {};

// function CheckoutPage({ }: Props) {
//     const router = useRouter();
//     const [selectedBasicOption, setSelectedBasicOption] = useState("stripe");
//     const [selectedAdvancedOption, setSelectedAdvancedOption] = useState("stripe");

//     const handleCheckout = async (plan: "basic" | "advanced", option: string) => {
//         try {
//             const response = await fetch(`/api/payments/${option}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ plan, option }),
//             });

//             if (!response.ok) {
//                 throw new Error("Payment failed");
//             }

//             const { success, tokenId } = await response.json();
//             if (success) {
//                 // Mint NFT
//                 await handleMint("your-ipfs-hash-here");

//                 localStorage.setItem("isPurchased", "true");
//                 localStorage.setItem("purchasedPlan", plan);
//                 localStorage.setItem("tokenId", tokenId);
//                 localStorage.setItem("listOnMarketplace", "true");

//                 toast.success(`Successfully purchased ${plan} plan!`);
//                 router.push("/marketplace");
//             } else {
//                 throw new Error("Payment processing error");
//             }
//         } catch (error) {
//             console.error("Checkout error:", error);
//             toast.error("Failed to process payment. Please try again.");
//         }
//     };

//     return (
//         <div className="flex gap-8 justify-center p-8">
//             <PricingPlan
//                 title="Single Page"
//                 subtitle="For Student Use"
//                 coverImage="/images/image-placeholder.jpg"
//                 options={[
//                     {
//                         id: "stripe",
//                         name: "Use Stripe",
//                         price: "$100",
//                         description: "",
//                         period: "One-time payment",
//                     },
//                     {
//                         id: "crypto",
//                         name: "Use Crypto",
//                         price: "0.05 ETH",
//                         description: "",
//                         period: "One-time payment",
//                     },
//                 ]}
//                 selectedOption={selectedBasicOption}
//                 onOptionChange={setSelectedBasicOption}
//                 ctaText="CHECKOUT"
//                 onCtaClick={() => handleCheckout("basic", selectedBasicOption)}
//             />

//             <PricingPlan
//                 title="Full Storybook"
//                 subtitle="For Professional Use"
//                 coverImage="/images/image-placeholder.jpg"
//                 options={[
//                     {
//                         id: "stripe",
//                         name: "Use Stripe",
//                         price: "$300/month",
//                         description: "",
//                         period: "Monthly subscription",
//                     },
//                     {
//                         id: "crypto",
//                         name: "Use Crypto",
//                         price: "0.5 ETH",
//                         description: "",
//                         period: "One-time payment",
//                     },
//                 ]}
//                 selectedOption={selectedAdvancedOption}
//                 onOptionChange={setSelectedAdvancedOption}
//                 ctaText="CHECKOUT"
//                 onCtaClick={() => handleCheckout("advanced", selectedAdvancedOption)}
//             />
//         </div>
//     );
// }

// export default CheckoutPage;