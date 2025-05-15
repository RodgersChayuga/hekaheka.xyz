"use client"

import Header from "@/components/Header";
import Image from "next/image";

const Background = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="fixed inset-0 bg-comic-pattern animate-comic-fade overflow-auto">
                {/* Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
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
            </div>
            <div className="relative min-h-screen flex flex-col">
                <Header />
                <main className="container mx-auto flex-grow overflow-y-auto">
                    <div className="w-full pt-24">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}

export default Background;