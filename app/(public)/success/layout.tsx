import type { Metadata } from "next";
import Background from "@/components/Background";
import { backgroundConfigs } from "@/components/Background/background-configs";



export const metadata: Metadata = {
    title: "Success",
    description: "Checkout successful",
};

export default function StoryInputLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className=""
        >
            <Background config={backgroundConfigs.storyInput}>
                {children}
            </Background>
        </div>
    );
}
