"use client";

import React, { useState, useEffect } from "react";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "next/navigation";
import PhotoUpload from "./Upload";
import { toast } from "sonner";

type Props = {};

const ImageUpload = (props: Props) => {
    const router = useRouter();
    const [characters, setCharacters] = useState<string[]>([]);
    const [story, setStory] = useState<string>("");
    const [characterFiles, setCharacterFiles] = useState<Record<string, File[]>>({});

    const updateCharacterFiles = (character: string, files: File[]) => {
        setCharacterFiles((prev) => ({
            ...prev,
            [character]: files,
        }));
    };

    useEffect(() => {
        const storedCharacters = localStorage.getItem("characters");
        const storedStory = localStorage.getItem("aiStory");

        if (storedCharacters) {
            setCharacters(JSON.parse(storedCharacters));
        }
        if (storedStory) {
            setStory(storedStory);
        }
    }, []);

    const handleBack = () => {
        router.push("/how-it-works");
    };

    const handleNext = async () => {
        if (characters.length === 0) {
            toast.error("No characters found. Please add characters.");
            return;
        }

        const hasFiles = characters.every((character) => characterFiles[character]?.length > 0);
        if (!hasFiles) {
            toast.error("Please upload at least one image for each character.");
            return;
        }

        try {
            const formData = new FormData();
            characters.forEach((character) => {
                characterFiles[character]?.forEach((file, index) => {
                    formData.append(`${character}-${index}`, file);
                });
            });

            const response = await fetch("/api/comics/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload images");
            }

            router.push("/mint");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to upload images. Please try again.");
        }
    };

    return (
        <div className="flex gap-8 relative min-h-screen p-4">
            <div className="text-center flex flex-col items-center justify-center flex-1 relative">
                <h2 className="text-3xl font-bold mb-6">Upload Character Photos</h2>

                {characters.length === 0 ? (
                    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4">
                        No characters found. Please go back and add character names.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 w-full">
                        {characters.map((character, idx) => (
                            <div key={idx}>
                                <PhotoUpload
                                    character={character}
                                    files={characterFiles[character] || []}
                                    setFiles={(files) => updateCharacterFiles(character, files)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between w-full mt-8">
                    <div className="flex flex-col items-center justify-center w-full">
                        <div className="mb-8">
                            <p className="text-sm font-light text-black leading-relaxed">
                                Upload photos of your characters to bring your story to life.
                            </p>
                            <p className="text-sm font-light text-black leading-relaxed">
                                These images will be used to generate your personalized comic.
                            </p>
                        </div>

                        <div className="flex justify-around gap-8">
                            <CustomButton onClick={handleBack}>BACK</CustomButton>
                            <CustomButton onClick={handleNext} disabled={characters.length === 0}>
                                NEXT
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;