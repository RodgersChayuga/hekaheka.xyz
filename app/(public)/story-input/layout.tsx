import type { Metadata } from "next";
import Background from "@/components/Background";
import { backgroundConfigs } from "@/components/Background/background-configs";



export const metadata: Metadata = {
    title: "Story Input",
    description: "Story Input",
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
