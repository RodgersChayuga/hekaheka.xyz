"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/marketplace/SearchBar";
import ComicListing from "@/components/marketplace/ComicListing";
import CustomButton from "@/components/CustomButton";
import { toast } from "sonner";
import { ethers } from "ethers";
import ComicMarketplace from "@/contracts/artifacts/contracts/ComicMarketplace.sol/ComicMarketplace.json";
interface Comic {
    tokenId: string;
    metadata: { name: string; image: string };
    price: string;
}

function MarketplacePage() {
    const [comics, setComics] = useState<Comic[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [userComicTokenId, setUserComicTokenId] = useState<string | null>(null);

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

        const tokenId = localStorage.getItem("tokenId");
        if (tokenId) {
            setUserComicTokenId(tokenId);
        }
    }, [searchQuery]);

    const handleMintDownload = async () => {
        if (!userComicTokenId) {
            toast.error("No comic to mint or download.");
            return;
        }

        try {
            const response = await fetch(`/api/comics/mint-download?tokenId=${userComicTokenId}`);
            if (!response.ok) {
                throw new Error("Failed to mint/download comic");
            }
            toast.success("Comic minted and downloaded successfully!");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to mint/download comic.");
        }
    };

    const handlePublish = async () => {
        if (!userComicTokenId) {
            toast.error("No comic to publish.");
            return;
        }

        try {
            const response = await fetch("/api/marketplace/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tokenId: userComicTokenId, price: "0.1 ETH" }),
            });

            if (!response.ok) {
                throw new Error("Failed to publish comic");
            }
            toast.success("Comic published to marketplace successfully!");
            // Refresh comics list
            const fetchResponse = await fetch(`/api/marketplace/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await fetchResponse.json();
            setComics(data.comics || []);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to publish comic.");
        }
    };

    const handleList = async (tokenId: string, price: string) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const marketplace = new ethers.Contract(
            process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
            ComicMarketplace.abi,
            signer
        );

        const tx = await marketplace.listComic(
            tokenId,
            ethers.parseEther(price),
            { value: ethers.parseEther("0.005") }
        );

        await tx.wait();
        toast.success("Comic listed on marketplace!");
    };

    return (
        <div className="w-full  p-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6">Marketplace</h2>
            {userComicTokenId && (
                <div className="mb-6 flex gap-4">
                    <CustomButton onClick={handleMintDownload} className="bg-blue-700 text-white hover:text-black">
                        Mint/Download Storybook
                    </CustomButton>
                    <CustomButton onClick={handlePublish} className="bg-green-700 text-white hover:text-black">
                        Publish to Marketplace
                    </CustomButton>
                </div>
            )}
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