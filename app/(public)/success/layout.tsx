import type { Metadata } from "next";
import Background from "@/components/Background";
import { backgroundConfigs } from "@/components/Background/background-configs";



export const metadata: Metadata = {
    title: "Success",
    description: "Success",
};

export default function SuccessLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className=""
        >
            <Background config={backgroundConfigs.success}>
                {children}
            </Background>
        </div>
    );
}
