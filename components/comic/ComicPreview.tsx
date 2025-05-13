import { FC } from "react";

interface ComicPage {
    image: string;
    text: string;
}

interface ComicPreviewProps {
    pages: ComicPage[];
}

const ComicPreview: FC<ComicPreviewProps> = ({ pages }) => {
    return (
        <div className="w-full max-w-4xl">
            {pages.length === 0 ? (
                <p className="text-center text-gray-500">No pages to display.</p>
            ) : (
                pages.map((page, index) => (
                    <div key={index} className="mb-8 border rounded-md p-4 bg-white shadow-md">
                        <img
                            src={page.image}
                            alt={`Page ${index + 1}`}
                            className="w-full h-64 object-cover rounded-md"
                        />
                        <p className="mt-2 text-gray-700">{page.text}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ComicPreview;