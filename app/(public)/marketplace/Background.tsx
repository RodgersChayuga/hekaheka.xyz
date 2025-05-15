
"use client"

import Header from "@/components/Header";
import Image from "next/image";

// Animation variants for the stars
const ANIMATION_VARIANTS = ["slow", "medium", "fast"];

const Background = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="h-screen bg-comic-pattern animate-comic-fade relative overflow-hidden ">
            {/* Background Elements */}
            <div className="-z-10">
                <div className="absolute top-80 right-5 w-60 h-60">
                    <Image
                        src="/images/comic_cloud.png"
                        alt="Bottom right cloud"
                        fill
                        className=""
                    />
                </div>
                <div className="absolute -top-70 left-10 w-100 h-100 z-20">
                    <Image
                        src="/images/comic_sun.png"
                        alt="Large sun at top right"
                        fill
                        className="w-full h-full opacity-50"
                    />
                </div>
            </div>
            {/* Main Content */}
            <div className="min-h-screen relative z-30">
                <Header />
                <main className="container mx-auto flex h-[calc(100vh-80px)] items-center justify-center">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Background