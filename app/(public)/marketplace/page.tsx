"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/marketplace/SearchBar";
import ComicListing from "@/components/marketplace/ComicListing";
import { toast } from "sonner";

interface Comic {
    tokenId: string;
    metadata: { name: string; image: string };
    price: string;
}

function MarketplacePage() {
    const [comics, setComics] = useState<Comic[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await fetch(`/api/marketplace/search?query=${encodeURIComponent(searchQuery)}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch comics");
                }
                const data = await response.json();
                setComics(data.comics || []);
            } catch (error) {
                console.error("Error:", error);
                toast.error("Failed to load marketplace comics.");
            }
        };
        fetchComics();
    }, [searchQuery]);

    return (
        <div className="w-full flex flex-col items-center ">
            <h2 className="text-3xl font-bold mb-6">Marketplace</h2>
            <SearchBar onSearch={setSearchQuery} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {comics.length === 0 ? (
                    <p className="text-gray-500">No comics found.</p>
                ) : (
                    comics.map((comic) => <ComicListing key={comic.tokenId} comic={comic} />)
                )}
            </div>
        </div>
    );
}

export default MarketplacePage;