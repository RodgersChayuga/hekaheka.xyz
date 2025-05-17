import type { Metadata } from "next";
import Background from "@/components/Background";
import { backgroundConfigs } from "@/components/Background/background-configs";



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
            <Background config={backgroundConfigs.editComic}>
                {children}
            </Background>
        </div>
    );
}
