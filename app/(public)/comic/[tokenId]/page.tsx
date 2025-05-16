'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import ComicPreview from '@/components/comic/ComicPreview';
import CustomButton from '@/components/CustomButton';
import { useZustandStore } from '@/lib/store';

interface Comic {
    tokenId: string;
    metadata: { name: string; image: string; description: string };
    price: string;
    owner: string;
    pages: { image: string; text: string }[];
}

export default function ComicPage() {
    const { wallet } = useZustandStore();
    const [comic, setComic] = useState<Comic | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const tokenId = params.tokenId as string;

    if (!wallet) {
        toast.error('Please connect your wallet first');
        router.push('/');
        return null;
    }

    useEffect(() => {
        const fetchComic = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/marketplace/get?tokenId=${tokenId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comic');
                }
                const data = await response.json();
                setComic(data.comic);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load comic details.');
                router.push('/marketplace');
            } finally {
                setIsLoading(false);
            }
        };
        fetchComic();
    }, [tokenId, router]);

    const handleBuy = async () => {
        if (!comic) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/marketplace/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId }),
            });
            if (response.ok) {
                toast.success('Comic purchased successfully!');
                router.push('/success?tokenId=' + tokenId);
            } else {
                throw new Error('Failed to purchase comic');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error('Failed to purchase comic.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading comic...</div>;
    }

    if (!comic) {
        return null;
    }

    const isOwner = wallet.address === comic.owner;

    return (
        <div className="flex flex-col items-center p-8 min-h-screen">
            <h1 className="text-4xl font-bold mb-8">{comic.metadata.name}</h1>
            <ComicPreview
                pages={isOwner ? comic.pages : comic.pages.slice(0, 3)}
                totalPages={comic.pages.length}
                isPurchased={isOwner}
            />
            <div className="max-w-2xl w-full mt-8">
                <p className="text-lg mb-4">{comic.metadata.description}</p>
                <p className="text-lg mb-4">Price: {comic.price} ETH</p>
                <p className="text-lg mb-4">Owner: {comic.owner}</p>
                {!isOwner && (
                    <CustomButton onClick={handleBuy} disabled={isLoading} className="w-full">
                        {isLoading ? 'Purchasing...' : 'Buy Now'}
                    </CustomButton>
                )}
                {isOwner && <p className="text-gray-500">You own this comic</p>}
            </div>
        </div>
    );
}