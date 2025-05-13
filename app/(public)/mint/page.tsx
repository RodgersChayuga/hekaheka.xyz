"use client";

import CustomButton from "@/components/CustomButton";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ComicPreview from "@/components/comic/ComicPreview";
import { toast } from "sonner";

interface ComicPage {
    image: string;
    text: string;
}

interface Props {
    comicPages: ComicPage[];
}

function MintPage({ }: Props) {
    const router = useRouter();
    const [comicPages, setComicPages] = useState<ComicPage[]>([]);

    useEffect(() => {
        const fetchComic = async () => {
            try {
                const response = await fetch("/api/comics/preview");
                if (!response.ok) {
                    throw new Error("Failed to fetch comic");
                }
                const data = await response.json();
                setComicPages(data.pages || []);
            } catch (error) {
                console.error("Error:", error);
                toast.error("Failed to load comic preview.");
            }
        };
        fetchComic();
    }, []);

    const handleEdit = () => {
        router.push("/how-it-works");
    };

    const handleProceed = () => {
        router.push("/checkout");
    };

    return (
        <div className="w-full min-h-screen p-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6">Your Comic Preview</h2>
            <ComicPreview pages={comicPages} />
            <div className="flex gap-6 mt-6">
                <CustomButton onClick={handleEdit} className="bg-red-700 text-white hover:text-black">
                    EDIT
                </CustomButton>
                <CustomButton onClick={handleProceed} className="bg-green-700 text-white hover:text-black">
                    PROCEED
                </CustomButton>
            </div>
        </div>
    );
}

export default MintPage;