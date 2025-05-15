
"use client"

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMemo } from "react";

// Define fixed star positions that won't change between renders
const STAR_POSITIONS = [

    // Top-center quadrant
    { top: "12%", left: "50%" },
    { top: "14%", left: "70%" },
    { top: "-2%", left: "30%" },

    // Bottom-left quadrant
    { top: "75%", left: "5%" },
    { top: "88%", left: "15%" },
    { top: "92%", left: "-4%" },

    // Bottom-right quadrant
    { top: "62%", left: "95%" },
    { top: "95%", left: "75%" },
    { top: "70%", left: "92%" },

    // Bottom-center quadrant
    { top: "52%", left: "50%" },
    { top: "75%", left: "70%" },
    { top: "70%", left: "10%" },
];

// Animation variants for the stars
const ANIMATION_VARIANTS = ["slow", "medium", "fast"];

const Background = ({ children }: { children: React.ReactNode }) => {
    // Generate random delays for star animations, but only once per component mount
    const animationDelays = useMemo(() => {
        return STAR_POSITIONS.map(() => `${Math.random() * 3}s`);
    }, []);

    return (
        <div className="h-screen bg-comic-pattern animate-comic-fade relative overflow-hidden ">
            {/* Background Elements */}
            <div className="-z-10">



                {/* Clouds */}
                {/* Bottom Left Cloud */}
                <div className="absolute bottom-90 left-10 w-60 h-60 z-40" >
                    <Image
                        src="/images/comic_cloud.png"
                        alt="Bottom left cloud"
                        fill
                        className=""
                    />
                </div>
                {/* Bottom Right Cloud */}
                <div className="absolute top-90 -right-10 w-90 h-90">
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
                            animationDelay: animationDelays[i],
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
                <div className="absolute -bottom-70 right-10 w-120 h-120 z-20">
                    <Image
                        src="/images/comic_sun.png"
                        alt="Large sun at top right"
                        fill
                        className="w-full h-full"
                    />
                </div>
                {/* Top Left (Smaller) */}
                <div className="absolute top-0 left-0 w-62 h-62 z-20">
                    <Image
                        src="/images/comic_sun_left.png"
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
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Background