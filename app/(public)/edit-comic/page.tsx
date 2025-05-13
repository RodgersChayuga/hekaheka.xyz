"use client";

import CustomButton from "@/components/CustomButton";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PhotoUpload from "../image-upload/Upload";

type Props = {};

function EditComic({ }: Props) {
    const router = useRouter();
    const [story, setStory] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [characters, setCharacters] = useState<string[]>([]);
    const [characterFiles, setCharacterFiles] = useState<Record<string, File[]>>({});

    useEffect(() => {
        try {
            const storedStory = localStorage.getItem("aiStory");
            const storedCharacters = localStorage.getItem("characters");
            const storedIpfsHashes = localStorage.getItem("ipfsHashes");

            if (storedStory) {
                setStory(storedStory);
            }

            if (storedCharacters) {
                const parsedCharacters = JSON.parse(storedCharacters);
                if (Array.isArray(parsedCharacters) && parsedCharacters.every((char) => typeof char === "string")) {
                    setCharacters(parsedCharacters);
                    setInputValue(parsedCharacters.join(", "));
                } else {
                    throw new Error("Invalid characters data");
                }
            }

            if (storedIpfsHashes) {
                const ipfsHashes = JSON.parse(storedIpfsHashes);
                const files: Record<string, File[]> = {};
                characters.forEach((character) => {
                    const urls = ipfsHashes[character] || [];
                    files[character] = urls.map((url: string, index: number) => new File([], `image-${index}.jpg`));
                });
                setCharacterFiles(files);
            }
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
            toast.error("Invalid data format. Please start over.");
            localStorage.clear();
            router.push("/how-it-works");
        }
    }, [router, characters]);

    const handleSave = async () => {
        if (!story.trim()) {
            toast.error("Please enter your story.");
            return;
        }
        if (characters.length === 0) {
            toast.error("Please enter at least one character name.");
            return;
        }
        if (characters.length > 4) {
            toast.error("You can only enter up to 4 characters.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("story", story);
            formData.append("characters", JSON.stringify(characters));
            characters.forEach((character) => {
                characterFiles[character]?.forEach((file, index) => {
                    formData.append(`${character}-${index}`, file);
                });
            });

            const response = await fetch("/api/comics/update", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update comic");
            }

            localStorage.setItem("aiStory", story);
            localStorage.setItem("characters", JSON.stringify(characters));
            router.push("/mint");
        } catch (error: any) {
            console.error("Error:", error);
            toast.error(error.message || "Failed to update comic. Please try again.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);

        const array = raw
            .split(",")
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
        setCharacters(array);
    };

    const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStory(e.target.value);
    };

    return (
        <div className="w-full min-h-screen p-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6">Edit Your Comic</h2>
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <label className="block text-lg font-bold mb-2" htmlFor="story-input">
                        AI Story
                    </label>
                    <textarea
                        id="story-input"
                        placeholder="Edit your story..."
                        value={story}
                        onChange={handleStoryChange}
                        className="w-full min-h-40 p-2 px-8 mb-4 bg-white text-black rounded-none border-4 border-black"
                        aria-label="Edit story input"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-lg font-bold mb-2" htmlFor="characters-input">
                        Characters (up to 4)
                    </label>
                    <input
                        id="characters-input"
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Edit characters' names, separated by commas"
                        className="p-2 w-full bg-white text-black rounded-none mb-4 border-4 border-black"
                        aria-label="Edit character names input"
                    />
                    {characters.length > 0 && (
                        <div className="mb-4 w-full text-left">
                            <p className="font-bold">Characters ({characters.length}):</p>
                            <div className="flex flex-wrap gap-2">
                                {characters.map((character, index) => (
                                    <span key={index} className="bg-black text-white px-3 py-1 rounded-full text-sm">
                                        {character}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Character Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {characters.map((character, idx) => (
                            <div key={idx}>
                                <PhotoUpload
                                    character={character}
                                    files={characterFiles[character] || [] as File[]}
                                    setFiles={(files) => {
                                        setCharacterFiles((prev) => ({
                                            ...prev,
                                            [character]: files,
                                        }));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-8">
                    <CustomButton onClick={handleSave} className="bg-green-700 text-white hover:text-black">
                        SAVE & PROCEED
                    </CustomButton>
                </div>
            </div>
        </div>
    );
}

export default EditComic;