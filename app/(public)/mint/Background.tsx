
"use client"

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMemo } from "react";

// Define fixed star positions that won't change between renders
const STAR_POSITIONS = [

    // Top-center quadrant
    { top: "12%", left: "50%", delay: "0.5s" },
    { top: "14%", left: "70%", delay: "1.2s" },
    { top: "-2%", left: "30%", delay: "0.8s" },

    // Bottom-left quadrant
    { top: "75%", left: "5%", delay: "1.5s" },
    { top: "88%", left: "15%", delay: "2.1s" },
    { top: "92%", left: "-4%", delay: "0.3s" },

    // Bottom-right quadrant
    { top: "62%", left: "95%", delay: "1.7s" },
    { top: "95%", left: "75%", delay: "0.9s" },
    { top: "70%", left: "92%", delay: "2.3s" },

    // Bottom-center quadrant
    { top: "52%", left: "50%", delay: "1.1s" },
    { top: "75%", left: "70%", delay: "0.7s" },
    { top: "70%", left: "10%", delay: "1.9s" }
];

// Animation variants for the stars
const ANIMATION_VARIANTS = ["slow", "medium", "fast"];

const Background = ({ children }: { children: React.ReactNode }) => {
  

    return (
        <div className="h-screen bg-comic-pattern animate-comic-fade relative overflow-hidden ">
            {/* Background Elements */}
            <div className="-z-10">



                {/* Clouds */}
                {/* Bottom Left Cloud */}
                <div className="absolute top-90 -left-40 w-80 h-80 z-10" >
                    <Image
                        src="/images/comic_cloud.png"
                        alt="Bottom left cloud"
                        fill
                        className=""
                    />
                </div>
                {/* Bottom Right Cloud */}
                <div className="absolute -top-40 left-40 w-80 h-80">
                    <Image
                        src="/images/comic_cloud.png"
                        alt="Bottom right cloud"
                        fill
                        className=""
                    />
                </div>

                {/* Floating Stars (Scattered in fixed positions) */}
                {STAR_POSITIONS.map((position, i) => (
                    <div
                        key={`star-${i}`}
                        className={`absolute w-10 h-10 animate-pulse-${i % 3}`}
                        style={{
                            top: position.top,
                            left: position.left,
                            animationDelay: position.delay,
                        }}
                    >
                        <Image
                            src="/images/comic_star.png"
                            alt="Yellow star element"
                            fill
                            className=""
                        />
                    </div>
                ))}

                {/* Comic Suns */}
                {/* Top Right (Larger) */}
                <div className="absolute -bottom-70 right-100 w-120 h-120 z-20">
                    <Image
                        src="/images/comic_sun.png"
                        alt="Large sun at top right"
                        fill
                        className="w-full h-full"
                    />
                </div>
                {/* Top Left (Smaller) */}
                <div className="absolute top-0 right-0 w-56 h-56 z-20">
                    <Image
                        src="/images/comic_sun_right.png"
                        alt="Smaller sun at top left"
                        fill
                        className=""
                    />
                </div>
            </div>
            {/* Main Content */}
            <div className="min-h-screen relative z-30">
                <Header />
                <main className="container mx-auto flex h-[calc(100vh-80px)] items-center justify-center">
                    <div className="w-full pt-24">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Background