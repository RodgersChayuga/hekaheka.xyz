import type { Metadata } from "next";
import Background from "./Background";



export const metadata: Metadata = {
    title: "Image Upload",
    description: "Image Upload",
};

export default function ImageUploadLayout({
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
