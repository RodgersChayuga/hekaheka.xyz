'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CustomButton from '@/components/CustomButton';
import { jsPDF } from 'jspdf';
import { useZustandStore } from '@/lib/store';

export default function SuccessPage() {
    const { wallet } = useZustandStore();
    const [tokenId, setTokenId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    if (!wallet) {
        toast.error('Please connect your wallet first');
        router.push('/');
        return null;
    }

    useEffect(() => {
        const fetchedTokenId = searchParams.get('tokenId') || localStorage.getItem('tokenId');
        if (fetchedTokenId) {
            setTokenId(fetchedTokenId);
        } else {
            toast.error('No purchase data found.');
            router.push('/marketplace');
        }

        if (sessionId) {
            const verifyPayment = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/payments/fiat/verify?session_id=${sessionId}`);
                    if (!response.ok) {
                        throw new Error('Payment verification failed');
                    }
                    toast.success('Payment verified successfully!');
                } catch (error) {
                    console.error('Verification error:', error);
                    toast.error('Failed to verify payment.');
                } finally {
                    setIsLoading(false);
                }
            };
            verifyPayment();
        }
    }, [sessionId, router]);

    const handleDownloadPDF = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/comics/preview?tokenId=${tokenId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch comic');
            }
            const { pages } = await response.json();
            const doc = new jsPDF();
            pages.forEach((page: { image: string }, index: number) => {
                if (index > 0) doc.addPage();
                doc.addImage(page.image, 'JPEG', 10, 10, 190, 277);
            });
            doc.save(`comic-${tokenId}.pdf`);
            toast.success('Comic downloaded as PDF!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download comic.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-8 min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Purchase Successful!</h1>
            {isLoading ? (
                <div className="text-center">Processing...</div>
            ) : (
                <>
                    <p className="text-xl mb-4">Your comic has been minted as an NFT!</p>
                    {tokenId && (
                        <p className="mb-4">
                            Token ID: <a href={`https://basescan.org/token/${tokenId}`} target="_blank" className="text-blue-500">
                                {tokenId}
                            </a>
                        </p>
                    )}
                    <div className="flex gap-4">
                        <CustomButton onClick={handleDownloadPDF} disabled={isLoading}>
                            Download PDF
                        </CustomButton>
                        <CustomButton onClick={() => router.push('/marketplace')} disabled={isLoading}>
                            Go to Marketplace
                        </CustomButton>
                        <CustomButton onClick={() => router.push(`/comic/${tokenId}`)} disabled={isLoading}>
                            View Comic
                        </CustomButton>
                    </div>
                </>
            )}
        </div>
    );
}