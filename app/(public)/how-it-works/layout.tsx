import type { Metadata } from "next";
import Background from "./Background";



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
      <Background>
        {children}
      </Background>
    </div>
  );
}
