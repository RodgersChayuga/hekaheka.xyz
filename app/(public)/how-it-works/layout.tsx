import type { Metadata } from "next";
import Background from "@/components/Background";
import { backgroundConfigs } from "@/components/Background/background-configs";



export const metadata: Metadata = {
  title: "How it works",
  description: "How it works",
};

export default function HowItWorksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className=""
    >
      <Background config={backgroundConfigs.howItWorks}>
        {children}
      </Background>
    </div>
  );
}
