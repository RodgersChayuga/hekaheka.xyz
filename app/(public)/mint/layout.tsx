import type { Metadata } from "next";
import Background from "./Background";



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
            <Background>
                {children}
            </Background>
        </div>
    );
}
