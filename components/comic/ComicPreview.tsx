"use client"

import { FC, useState } from "react";
import Image from "next/image";

interface ComicPage {
    image: string;
    text: string;
}

interface ComicPreviewProps {
    pages: ComicPage[];
    totalPages?: number;
    isPurchased?: boolean;
}

const ComicPreview: FC<ComicPreviewProps> = ({
    pages,
    totalPages = pages.length,
    isPurchased = false
}) => {
    // Track the starting index for our current view (showing 3 pages at a time)
    const [startIndex, setStartIndex] = useState(0);

    // Handle empty pages case
    if (pages.length === 0) {
        return (
            <div className="w-full max-w-4xl text-center text-gray-500">
                No pages to display.
            </div>
        );
    }

    // Calculate maximum start index (don't allow scrolling beyond last page)
    const maxStartIndex = Math.max(0, totalPages - 3);

    const goToPrevPage = () => {
        // Move back one page at a time (instead of three)
        setStartIndex((prev) => Math.max(0, prev - 1));
    };

    const goToNextPage = () => {
        // Move forward one page at a time (instead of three)
        setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
    };

    // Determine the label based on the index
    const getPageLabel = (index: number) => {
        if (index === 0) return "COVER";
        return `PAGE ${index}`;
    };

    // Determine if a page is locked (available in totalPages but not in pages array)
    const isPageLocked = (index: number) => {
        return index >= pages.length && index < totalPages;
    };

    // Get 3 pages to display in current view
    const currentPageIndices = [startIndex, startIndex + 1, startIndex + 2].filter(
        (index) => index < totalPages
    );

    const getPageImage = (index: number) => {
        switch (index) {
            case 0:
                return "/comics/1.jpeg";
            case 1:
                return "/comics/2.jpeg";
            case 2:
                return "/comics/3.jpeg";
            default:
                return pages[index]?.image || "/images/comic_placeholder.jpeg";
        }
    };

    return (
        <div className="w-full max-w-4xl relative">
            <div className="p-8 rounded-lg relative overflow-hidden">
                {/* Comic viewer container */}
                <div className="border-4 border-gray-800 bg-white p-6 relative z-10 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full">
                        {/* Previous button */}
                        <button
                            onClick={goToPrevPage}
                            disabled={startIndex === 0}
                            className="text-4xl text-gray-800 disabled:text-gray-400 focus:outline-none"
                        >
                            ◀
                        </button>

                        {/* Comic pages display (3 at a time) */}
                        <div className="flex-1 flex justify-center gap-4">
                            {currentPageIndices.map((pageIndex) => (
                                <div key={pageIndex} className="flex flex-col items-center">
                                    <div className="relative">
                                        {isPageLocked(pageIndex) ? (
                                            <div className="h-64 w-48 border-2 border-gray-700 rounded flex items-center justify-center bg-gray-100">
                                                {/* Lock icon */}
                                                <div className="relative text-center">
                                                    <div className="text-5xl text-gray-400 mb-2">🔒</div>
                                                    <p className="text-sm text-gray-500">Purchase to unlock</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <Image
                                                src={getPageImage(pageIndex)}
                                                alt={`Comic page ${pageIndex + 1}`}
                                                width={192}
                                                height={256}
                                                className="h-64 w-48 object-cover border-2 border-gray-700 rounded"
                                            />
                                        )}
                                    </div>
                                    {/* Page label */}
                                    <div className="text-center font-bold text-lg mt-2">
                                        {getPageLabel(pageIndex)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={goToNextPage}
                            disabled={startIndex >= maxStartIndex}
                            className="text-4xl text-gray-800 disabled:text-gray-400 focus:outline-none"
                        >
                            ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComicPreview;