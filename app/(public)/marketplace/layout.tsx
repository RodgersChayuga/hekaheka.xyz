import type { Metadata } from "next";
import Background from "./Background";



export const metadata: Metadata = {
    title: "Marketplace",
    description: "View the marketplace",
};

export default function MarketplaceLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className=""
        >
            <Background>
                {children}
            </Background>
        </div>
    );
}
