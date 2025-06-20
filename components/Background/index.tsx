"use client"

import Header from "@/components/Header";
import Image from "next/image";
import { useMemo } from "react";
import { BackgroundConfig } from "@/types/background";

interface BackgroundProps {
    children: React.ReactNode;
    config: BackgroundConfig;
}

const Background = ({ children, config }: BackgroundProps) => {
    // Generate random delays for star animations, but only once per component mount
    const animationDelays = useMemo(() => {
        return config.starPositions.map(() => `${Math.random() * 3}s`);
    }, [config.starPositions]);

    return (
        <div className="relative h-screen overflow-hidden">
            {/* Fixed Background Elements */}
            <div className="fixed inset-0 -z-10 bg-comic-pattern animate-comic-fade">
                {/* Clouds */}
                {config?.clouds?.one && (
                    <div
                        className={`absolute ${config.clouds.one?.className || ""}`}
                        style={{
                            top: config.clouds.one?.position?.top,
                            left: config.clouds.one?.position?.left,
                            right: config.clouds.one?.position?.right,
                            bottom: config.clouds.one?.position?.bottom,
                            width: config.clouds.one?.size?.width,
                            height: config.clouds.one?.size?.height,
                            zIndex: config.clouds.one?.zIndex,
                        }}
                    >
                        <Image
                            src="/images/comic_cloud.png"
                            alt="Bottom left cloud"
                            fill
                            className="animate-float"
                        />
                    </div>
                )}

                {config?.clouds?.two && (
                    <div
                        className={`absolute ${config.clouds.two?.className || ""}`}
                        style={{
                            top: config.clouds.two?.position?.top,
                            left: config.clouds.two?.position?.left,
                            right: config.clouds.two?.position?.right,
                            bottom: config.clouds.two?.position?.bottom,
                            width: config.clouds.two?.size?.width,
                            height: config.clouds.two?.size?.height,
                            zIndex: config.clouds.two?.zIndex,
                        }}
                    >
                        <Image
                            src="/images/comic_cloud.png"
                            alt="Bottom right cloud"
                            fill
                            className="animate-float"
                        />
                    </div>
                )}

                {/* Floating Stars */}
                {config.starPositions.map((position, i) => (
                    <div
                        key={`star-${i}`}
                        className={`absolute w-10 h-10 animate-pulse-${i % 3}`}
                        style={{
                            top: position.top,
                            left: position.left,
                            right: position.right,
                            bottom: position.bottom,
                            animationDelay: position.animationDelay || "0s",
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
                {config?.suns?.left && (
                    <div
                        className={`absolute ${config.suns.left?.className || ""}`}
                        style={{
                            top: config.suns.left?.position?.top,
                            left: config.suns.left?.position?.left,
                            right: config.suns.left?.position?.right,
                            bottom: config.suns.left?.position?.bottom,
                            width: config.suns.left?.size?.width,
                            height: config.suns.left?.size?.height,
                            zIndex: config.suns.left?.zIndex,
                        }}
                    >
                        <Image
                            src={config.suns.left?.image || "/images/comic_sun.png"}
                            alt="Smaller sun at top left"
                            fill
                            className="animate-float"
                        />
                    </div>
                )}

                {config?.suns?.right && (
                    <div
                        className={`absolute ${config.suns.right?.className || ""}`}
                        style={{
                            top: config.suns.right?.position?.top,
                            left: config.suns.right?.position?.left,
                            right: config.suns.right?.position?.right,
                            bottom: config.suns.right?.position?.bottom,
                            width: config.suns.right?.size?.width,
                            height: config.suns.right?.size?.height,
                            zIndex: config.suns.right?.zIndex,
                        }}
                    >
                        <Image
                            src={config.suns.right?.image || "/images/comic_sun.png"}
                            alt="Large sun at top right"
                            fill
                            className="w-full h-full animate-float"
                        />
                    </div>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="relative z-30 h-screen flex flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto ">
                    <div className="container mx-auto py-36 mt-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Background;