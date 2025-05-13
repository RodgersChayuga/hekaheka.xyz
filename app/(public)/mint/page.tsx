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
    const [isPurchased, setIsPurchased] = useState(false);

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

        // Check if the comic has been purchased
        const purchased = localStorage.getItem("isPurchased");
        if (purchased === "true") {
            setIsPurchased(true);
        }
    }, []);

    const handleEdit = () => {
        router.push("/edit-comic");
    };

    const handleProceed = () => {
        router.push("/checkout");
    };

    const displayedPages = isPurchased ? comicPages : comicPages.slice(0, 3);

    return (
        <div className="w-full min-h-screen p-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6">Your Comic Preview</h2>
            <ComicPreview pages={displayedPages} />
            {comicPages.length > 3 && !isPurchased && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
                    <p className="text-center text-gray-700">
                        Only the first 3 pages are shown. Purchase to unlock all {comicPages.length} pages.
                    </p>
                </div>
            )}
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