import type { Metadata } from "next";
import Background from "@/components/Background";
import { backgroundConfigs } from "@/components/Background/background-configs";

export const metadata: Metadata = {
    title: "Edit Comic",
    description: "Edit your comic",
};

export default function EditComicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            <Background config={backgroundConfigs.editComic}>
                {children}
            </Background>
        </div>
    );
}