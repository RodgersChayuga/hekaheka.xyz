"use client";

import CustomButton from "@/components/CustomButton";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useZustandStore } from "@/lib/store";

export default function Page() {
    const { wallet, setStory, setCharacters } = useZustandStore();
    const [story, setLocalStory] = useState('');
    const [characters, setLocalCharacters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!wallet) {
            toast.error('Please connect your wallet first');
            router.push('/');
        }
    }, [wallet, router]);

    const handleAddCharacter = () => {
        if (characters.length < 4) {
            setLocalCharacters([...characters, '']);
        } else {
            toast.error('Maximum 4 characters allowed');
        }
    };

    const handleCharacterChange = (index: number, value: string) => {
        const newCharacters = [...characters];
        newCharacters[index] = value;
        setLocalCharacters(newCharacters);
    };

    const handleSubmit = () => {
        console.log('Characters array:', characters);
        console.log('Characters length:', characters.length);
        console.log('Characters validation:', characters.some(c => !c.trim()));

        if (!story.trim()) {
            toast.error('Story is required');
            return;
        }
        if (characters.some(c => !c.trim())) {
            toast.error('All character names must be filled');
            return;
        }
        setIsLoading(true);
        setStory(story);
        setCharacters(characters);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/image-upload');
        }, 500);
    };

    return (
        <div className="flex gap-8 relative w-full min-h-screen">
            {/* Description Section */}
            <div className="relative flex-1 h-screen">
                <div className="w-full h-full flex items-center justify-center">
                    <Image
                        src="/images/comic-page-2.png"
                        alt="Comic panel"
                        width={400}
                        height={300}
                        className="object-cover w-full animate-float"
                        style={{ animationDelay: "0s" }}
                    />
                </div>
            </div>

            {/* Hero Section */}
            <div className="text-center flex flex-col items-center justify-center flex-1 relative p-4">
                <div className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide text-black mb-8">
                    <span className="relative inline-block">
                        <h3 className="relative z-10">TELL US ABOUT</h3>
                        <h3 className="relative z-10">YOUR MEMORIES &</h3>
                        <h3 className="relative z-10">MILESTONES</h3>
                    </span>
                </div>

                <textarea
                    placeholder="AI Story builder"
                    value={story}
                    onChange={(e) => setLocalStory(e.target.value)}
                    className="w-full min-h-40 p-2 px-8 mb-4 bg-white text-black rounded-none border-4 border-black"
                    aria-label="Story input"
                />

                {characters.map((character, index) => (
                    <input
                        key={index}
                        type="text"
                        value={character}
                        onChange={(e) => handleCharacterChange(index, e.target.value)}
                        placeholder={`Character ${index + 1}`}
                        className="p-2 w-full bg-white text-black rounded-none mb-4 border-4 border-black"
                        aria-label={`Character ${index + 1} input`}
                    />
                ))}

                <div className="flex justify-around gap-8">
                    <CustomButton onClick={handleAddCharacter} disabled={characters.length >= 4} className="">
                        Add Character
                    </CustomButton>
                    <CustomButton onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Next: Upload Images'}
                    </CustomButton>
                </div>
            </div>
        </div>
    );
}