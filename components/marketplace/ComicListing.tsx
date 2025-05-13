import { FC } from "react";
import CustomButton from "@/components/CustomButton";
import { toast } from "sonner";

interface Comic {
    tokenId: string;
    metadata: { name: string; image: string };
    price: string;
}

interface ComicListingProps {
    comic: Comic;
}

const ComicListing: FC<ComicListingProps> = ({ comic }) => {
    const handleBuy = async () => {
        try {
            const response = await fetch("/api/marketplace/buy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tokenId: comic.tokenId }),
            });

            if (!response.ok) {
                throw new Error("Failed to purchase comic");
            }

            toast.success("Comic purchased successfully!");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to purchase comic.");
        }
    };

    return (
        <div className="border rounded-md p-4 bg-white shadow-md hover:shadow-lg transition">
            <img
                src={comic.metadata.image}
                alt={comic.metadata.name}
                className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-lg font-bold mt-2 truncate">{comic.metadata.name}</h3>
            <p className="text-gray-600">Price: {comic.price} ETH</p>
            <CustomButton onClick={handleBuy} className="mt-2 w-full">
                Buy Now
            </CustomButton>
        </div>
    );
};

export default ComicListing;