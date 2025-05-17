// app/(public)/success/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CustomButton from '@/components/CustomButton';
import { useZustandStore } from '@/lib/store';
import { ethers } from 'ethers';
import ComicNFT from '@/contracts/artifacts/contracts/ComicNFT.sol/ComicNFT.json';

// Create a client component that uses useSearchParams
function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { wallet, ipfsHash, comicPages } = useZustandStore();
    const sessionId = searchParams.get('session_id');

    const handleMintToBase = async () => {
        if (!wallet || !ipfsHash) {
            toast.error('Wallet not connected or comic data missing');
            return;
        }

        try {
            setIsLoading(true);

            // Connect to the contract
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_COMIC_NFT_ADDRESS!,
                ComicNFT.abi,
                signer
            );

            // Create metadata for the NFT
            const metadata = {
                name: "My Comic Book",
                description: "A personalized comic book created on HekaHeka",
                image: comicPages[0]?.imageUrl || '', // Changed from image to imageUrl
                attributes: [
                    {
                        trait_type: "Pages",
                        value: comicPages.length
                    }
                ]
            };

            // Upload metadata to IPFS
            const response = await fetch('/api/ipfs/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(metadata),
            });

            const { ipfsHash: metadataHash } = await response.json();

            // Mint the NFT
            const tx = await contract.mintComic(metadataHash);
            const receipt = await tx.wait();

            // Get the token ID from the event
            const event = receipt.logs.find(
                (log: any) => log.fragment?.name === 'ComicMinted'
            );
            const tokenId = event?.args[1];

            toast.success(`Comic minted successfully! Token ID: ${tokenId}`);

            // Redirect to the comic page
            router.push(`/comic/${tokenId}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to mint comic');
        } finally {
            setIsLoading(false);
        }
    };

    const handleListToMarketplace = () => {
        router.push('/marketplace')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-lg mb-8">Your comic is ready! What would you like to do next?</p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md">
                <CustomButton
                    onClick={handleMintToBase}
                    disabled={isLoading || !wallet}
                    className="w-full py-4 text-lg"
                >
                    {isLoading ? 'Minting...' : 'Mint to Base'}
                </CustomButton>

                <CustomButton
                    onClick={handleListToMarketplace}
                    disabled={isLoading || !wallet}
                    className="w-full py-4 text-lg bg-green-600 hover:bg-green-700"
                >
                    {isLoading ? 'Processing...' : 'List to Marketplace'}
                </CustomButton>
            </div>
        </div>
    );
}

// Main page component with Suspense
export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}