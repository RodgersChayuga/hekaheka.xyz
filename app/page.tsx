
"use client"

import React from 'react'
import Image from "next/image";

import CustomButton from "@/components/CustomButton";
import Background from "./Background";
import { useRouter } from "next/navigation"

type Props = {}

const Home = (props: Props) => {
    const router = useRouter()

    const handleStart = () => {
        router.push('/how-it-works')
    }

    return (
        <Background>
            <div className="flex gap-8 relative">
                {/* Description Section */}
                <div className="relative flex-1 h-full">
                    <div className="w-full ">
                        <Image
                            src="/images/comic-page-1.png" // Placeholder, replace with actual image
                            alt="Comic panel"
                            width={400}
                            height={300}
                            className="object-cover w-full" />
                    </div>
                    <p className="mt-4 text-xl font-light text-black font-geist leading-relaxed">
                        ComicChain transforms real-life memories into epic, AI-powered comic books – minted forever onchain. Users narrate their moments, upload a few photos to inspire their character, and instantly mint their own.
                    </p>
                    {/* Onomatopoeia Burst */}

                </div>

                {/* Hero Section */}
                <div className="text-center flex flex-col items-center justify-center  flex-1 relative ">
                    <div className="  ">
                        <Image
                            src="/images/comic_cloud.png"
                            alt="Right cloud"
                            width={400}
                            height={400}
                            className="" />

                    </div>
                    <div className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide text-black mb-8">
                        <span className="relative inline-block">
                            <span className="absolute inset-0  transform -skew-y-6 z-0" />
                            <span className="relative z-10">&quot;TURN YOUR LIFE INTO A COMIC BOOK&quot;</span>
                        </span>
                    </div>
                    <CustomButton onClick={() => handleStart()}>START</CustomButton>

                </div>
            </div >
        </Background>
    )
}

export default Home