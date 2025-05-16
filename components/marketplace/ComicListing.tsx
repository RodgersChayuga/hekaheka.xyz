'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useZustandStore } from '@/lib/store';
import CustomButton from '@/components/CustomButton';

type ComicListingProps = {
    comic: {
        tokenId: string;
        metadata: {
            name: string;
            image: string;
        };
        price: string;
        owner: string;
    };
};

export default function ComicListing({ comic }: ComicListingProps) {
    const { wallet } = useZustandStore();
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handleBuy = async () => {
        if (!wallet) {
            toast.error('Please connect your wallet first');
            return;
        }
        setIsPurchasing(true);
        try {
            const response = await fetch('/api/marketplace/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId: comic.tokenId }),
            });
            if (response.ok) {
                toast.success('Comic purchased successfully!');
            } else {
                toast.error('Failed to purchase comic.');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error('Failed to purchase comic.');
        } finally {
            setIsPurchasing(false);
        }
    };

    const isOwner = wallet && wallet.address === comic.owner;

    return (
        <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
            <img src={comic.metadata.image} alt={comic.metadata.name} className="w-full h-48 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{comic.metadata.name}</h3>
            <p className="text-gray-600">Price: {comic.price} ETH</p>
            {!isOwner && (
                <CustomButton
                    onClick={handleBuy}
                    disabled={isPurchasing || !wallet}
                    className="mt-2 w-full"
                >
                    {isPurchasing ? 'Purchasing...' : 'Buy Now'}
                </CustomButton>
            )}
            {isOwner && <p className="mt-2 text-gray-500">You own this comic</p>}
        </div>
    );
}