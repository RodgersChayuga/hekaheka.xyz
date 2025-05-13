import type { Metadata } from "next";
import Background from "./Background";



export const metadata: Metadata = {
    title: "Image Upload",
    description: "Generated storybook",
};

export default function CheckoutLayout({
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
