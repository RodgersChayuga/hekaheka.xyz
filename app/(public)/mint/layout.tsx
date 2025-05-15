import type { Metadata } from "next";
import Background from "@/components/Background";
import { backgroundConfigs } from "@/components/Background/background-configs";


export const metadata: Metadata = {
    title: "Mint",
    description: "Mint your comic",
};

export default function MintLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className=""
        >
            <Background config={backgroundConfigs.mint}>
                {children}
            </Background>
        </div>
    );
}
