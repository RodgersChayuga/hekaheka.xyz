
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "@/components/CustomButton";
import PhotoUpload from "./Upload";

const ImageUpload = () => {
    const router = useRouter();
    const [characters, setCharacters] = useState<string[]>([]);
    const [story, setStory] = useState<string>("");
    const [characterFiles, setCharacterFiles] = useState<Record<string, File[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Get data from URL params first, then localStorage
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlStory = params.get('story');
        const urlCharacters = params.get('characters');

        try {
            setStory(urlStory || localStorage.getItem("aiStory") || "");

            const chars = urlCharacters
                ? JSON.parse(decodeURIComponent(urlCharacters))
                : JSON.parse(localStorage.getItem("characters") || "[]");

            if (!Array.isArray(chars)) {
                throw new Error("Invalid characters format");
            }

            setCharacters(chars);
        } catch (error) {
            console.error("Data loading error:", error);
            toast.error("Invalid data format. Please start over.");
            router.push("/how-it-works");
        }
    }, [router]);

    const updateCharacterFiles = (character: string, files: File[]) => {
        setCharacterFiles(prev => ({
            ...prev,
            [character]: files
        }));
    };

    const handleCreateComic = async () => {
        if (!characters.every(c => characterFiles[c]?.length > 0)) {
            return toast.error("Please upload images for all characters");
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("story", story);
            formData.append("characters", JSON.stringify(characters));

            // Add all image files
            characters.forEach(character => {
                const files = characterFiles[character] || [];
                files.forEach((file, index) => {
                    formData.append(`${character}-${index}`, file);
                });
            });

            const response = await fetch("/api/comics/generate", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || "Comic generation failed");
            }

            const data = await response.json();
            router.push(`/comic/${data.ipfsHash}`);

        } catch (error) {
            console.error("Comic creation failed:", error);
            toast.error(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center">
                Upload Character Images
            </h1>

            {characters.length === 0 ? (
                <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4 text-center">
                    No characters found. Please go back and add character names.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => (
                        <div key={character}>
                            <PhotoUpload
                                character={character}
                                files={characterFiles[character] || []}
                                setFiles={(files) => updateCharacterFiles(character, files)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>Upload high-quality images for best results</p>
                <p>Supported formats: JPEG, PNG (max 5MB each)</p>
            </div>

            <div className="flex justify-center gap-4 mt-4">
                <CustomButton
                    onClick={() => router.back()}
                    className="bg-secondary text-white"
                >
                    Back
                </CustomButton>

                <CustomButton
                    onClick={handleCreateComic}
                    disabled={isLoading || characters.length === 0 || !characters.every(c => characterFiles[c]?.length > 0)}
                >
                    {isLoading ? "Generating..." : "Create Comic"}
                </CustomButton>
            </div>
        </div>
    );
};

export default ImageUpload;