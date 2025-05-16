'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ComicPreview from '@/components/comic/ComicPreview';
import CustomButton from '@/components/CustomButton';
import { PricingPlan } from '../checkout/PricingPlan';
import { useZustandStore } from '@/lib/store';
import MintButton from '@/components/MintButton';

interface ComicPage {
    image: string;
    text: string;
}

export default function MintPage() {
    const { wallet, ipfsHash } = useZustandStore();
    const [comicPages, setComicPages] = useState<ComicPage[]>([]);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBasicOption, setSelectedBasicOption] = useState('stripe');
    const [selectedAdvancedOption, setSelectedAdvancedOption] = useState('stripe');
    const router = useRouter();

    if (!wallet) {
        toast.error('Please connect your wallet first');
        router.push('/');
        return null;
    }

    useEffect(() => {
        const fetchComic = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/comics/preview');
                if (!response.ok) {
                    throw new Error('Failed to fetch comic');
                }
                const data = await response.json();
                setComicPages(data.pages || []);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load comic preview.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchComic();

        const purchased = localStorage.getItem('isPurchased');
        if (purchased === 'true') {
            setIsPurchased(true);
        }
    }, []);

    const handleEdit = () => {
        router.push('/edit-comic');
    };

    const handleCheckout = async (plan: 'basic' | 'advanced', option: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/payments/${option}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, option, ipfsHash }),
            });

            if (!response.ok) {
                throw new Error('Payment failed');
            }

            const { success, tokenId, sessionId } = await response.json();
            if (success) {
                localStorage.setItem('isPurchased', 'true');
                localStorage.setItem('purchasedPlan', plan);
                localStorage.setItem('tokenId', tokenId);
                toast.success(`Successfully purchased ${plan} plan!`);
                router.push(`/success?session_id=${sessionId || ''}&tokenId=${tokenId}`);
            } else {
                throw new Error('Payment processing error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to process payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const displayedPages = isPurchased ? comicPages : comicPages.slice(0, 3);
    const totalPages = comicPages.length;

    return (
        <div className="w-full p-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6">Your Comic Preview</h2>
            {isLoading ? (
                <div className="text-center">Loading comic preview...</div>
            ) : (
                <>
                    <ComicPreview pages={displayedPages} totalPages={totalPages} isPurchased={isPurchased} />
                    <div className="flex flex-col items-end gap-6 -mt-30 -mr-200 z-20">
                        <CustomButton onClick={handleEdit} className="bg-red-700 text-white hover:text-black">
                            EDIT
                        </CustomButton>
                    </div>
                    {comicPages.length > 3 && !isPurchased && (
                        <div className="mt-12 -ml-20 p-4 bg-yellow-100 border border-yellow-300 rounded">
                            <p className="text-center text-gray-700">
                                Only the first 3 pages are shown. Purchase to unlock all {comicPages.length} pages.
                            </p>
                        </div>
                    )}
                    <div className="flex gap-8 justify-center p-8">
                        <PricingPlan
                            title="Single Page"
                            subtitle="For Student Use"
                            coverImage="/images/image-placeholder.jpg"
                            options={[
                                { id: 'stripe', name: 'Use Stripe', price: '$100', description: '', period: 'One-time payment' },
                                { id: 'crypto', name: 'Use Crypto', price: '0.05 ETH', description: '', period: 'One-time payment' },
                            ]}
                            selectedOption={selectedBasicOption}
                            onOptionChange={setSelectedBasicOption}
                            ctaText="CHECKOUT"
                            onCtaClick={() => handleCheckout('basic', selectedBasicOption)}
                            disabled={isLoading}
                        />
                        <PricingPlan
                            title="Full Storybook"
                            subtitle="For Professional Use"
                            coverImage="/images/image-placeholder.jpg"
                            options={[
                                { id: 'stripe', name: 'Use Stripe', price: '$300', description: '', period: 'One-time payment' },
                                { id: 'crypto', name: 'Use Crypto', price: '0.5 ETH', description: '', period: 'One-time payment' },
                            ]}
                            selectedOption={selectedAdvancedOption}
                            onOptionChange={setSelectedAdvancedOption}
                            ctaText="CHECKOUT"
                            onCtaClick={() => handleCheckout('advanced', selectedAdvancedOption)}
                            disabled={isLoading}
                        />
                    </div>
                </>
            )}
        </div>
    );
}