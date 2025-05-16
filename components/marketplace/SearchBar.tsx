'use client';
import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import CustomButton from '@/components/CustomButton';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setIsSearching(false);
            onSearch(value);
        }, 300),
        [onSearch]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSearching(true);
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsSearching(true);
            onSearch(query);
        }
    };

    return (
        <div className="flex max-w-md">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Search comics..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md"
                aria-label="Search comics"
                disabled={isSearching}
            />
            <CustomButton onClick={() => onSearch(query)} className="rounded-r-md" disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
            </CustomButton>
        </div>
    );
}