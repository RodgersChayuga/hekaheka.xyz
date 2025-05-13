import { FC, useState } from "react";
import CustomButton from "@/components/CustomButton";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="flex w-full max-w-md mb-4">
            <input
                type="text"
                className="flex-grow border rounded-l-md p-2 focus:outline-none bg-white mr-2"
                placeholder="Search comics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search comics"
            />
            <CustomButton onClick={handleSearch} className="rounded-l-none">
                Search
            </CustomButton>
        </div>
    );
};

export default SearchBar;