import type { Metadata } from "next";
import Background from "@/components/Background";
import { backgroundConfigs } from "@/components/Background/background-configs";



export const metadata: Metadata = {
    title: "Comic",
    description: "Comic",
};

export default function ComicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className=""
        >
            <Background config={backgroundConfigs.comic}>
                {children}
            </Background>
        </div>
    );
}
