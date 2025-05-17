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

// Use the correct Next.js page component format
export default function Page() {
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

    // Only show first 3 pages if not purchased, but allow navigation through all pages
    const displayedPages = isPurchased ? comicPages : comicPages.slice(0, 3);
    const totalPages = comicPages.length;

    return (
        <div>
            <div className="w-full  p-4 flex flex-col items-center ">

                <h2 className="text-3xl font-bold mb-6">Your Comic Preview</h2>

                {/* Pass only the pages that should be displayed normally */}
                <ComicPreview
                    pages={displayedPages}
                    totalPages={totalPages}
                    isPurchased={isPurchased}
                />

                <div className="flex flex-col items-end gap-6 -mt-30 -mr-200 z-20">
                    <CustomButton onClick={handleEdit} className="bg-red-700 text-white hover:text-black">
                        EDIT
                    </CustomButton>
                    <CustomButton onClick={handleProceed} className="bg-green-700 text-white hover:text-black">
                        PROCEED
                    </CustomButton>
                </div>

                {comicPages.length > 3 && !isPurchased && (
                    <div className="mt-12 -ml-20 p-4 bg-yellow-100 border border-yellow-300 rounded">
                        <p className="text-center text-gray-700">
                            Only the first 3 pages are shown. Purchase to unlock all {comicPages.length} pages.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}