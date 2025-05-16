'use client';
import { useState } from 'react';

type ComicPage = {
    image: string;
    text: string;
};

type ComicPreviewProps = {
    pages: ComicPage[];
    totalPages?: number;
    isPurchased?: boolean;
};

export default function ComicPreview({ pages, totalPages = pages.length, isPurchased = false }: ComicPreviewProps) {
    const [startIndex, setStartIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const maxStartIndex = Math.max(0, totalPages - 3);

    const goToPrevPage = () => {
        if (startIndex > 0) setStartIndex(startIndex - 1);
    };

    const goToNextPage = () => {
        if (startIndex < maxStartIndex) setStartIndex(startIndex + 1);
    };

    const getPageLabel = (index: number) => (index === 0 ? 'COVER' : `PAGE ${index + 1}`);

    const isPageLocked = (index: number) => !isPurchased && index >= pages.length;

    return (
        <div className="flex flex-col items-center space-y-4">
            <button
                onClick={goToPrevPage}
                disabled={startIndex === 0}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
                aria-label="Previous page"
            >
                ◀
            </button>
            <div className="flex space-x-4">
                {Array.from({ length: 3 }).map((_, i) => {
                    const index = startIndex + i;
                    if (index < totalPages) {
                        return (
                            <div key={i} className="relative w-64 h-96 border border-gray-300 rounded overflow-hidden">
                                {isPageLocked(index) ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <span className="text-4xl">🔒</span>
                                        <p>Purchase to unlock</p>
                                    </div>
                                ) : (
                                    <>
                                        {isLoading && <div className="absolute inset-0 flex items-center justify-center">Loading...</div>}
                                        <img
                                            src={pages[index]?.image || '/images/image-placeholder.jpg'}
                                            alt={`Page ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onLoad={() => setIsLoading(false)}
                                            onError={() => setIsLoading(false)}
                                            aria-label={getPageLabel(index)}
                                        />
                                        <p className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
                                            {getPageLabel(index)}
                                        </p>
                                    </>
                                )}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <button
                onClick={goToNextPage}
                disabled={startIndex === maxStartIndex}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
                aria-label="Next page"
            >
                ▶
            </button>
        </div>
    );
}