'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CustomButton from '@/components/CustomButton';
import PhotoUpload from './Upload';
import { useZustandStore } from '@/lib/store';
import ConnectAndSIWE from '@/components/ConnectAndSIWE';

export default function ImageUpload() {
    const { wallet, story, characters, setIpfsHash, setComicPages } = useZustandStore();
    const [characterFiles, setCharacterFiles] = useState<Record<string, File[]>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [walletPrompt, setWalletPrompt] = useState(!wallet);
    const router = useRouter();

    useEffect(() => {
        if (!story || characters.length === 0) {
            toast.error('No story or characters found. Please start over.');
            router.push('/story-input');
        }
    }, [story, characters, router]);

    const updateCharacterFiles = (character: string, files: File[]) => {
        setCharacterFiles((prev) => ({
            ...prev,
            [character]: files,
        }));
    };

    const handleCreateComic = async () => {
        if (!wallet) {
            toast.error('Please connect your wallet');
            return;
        }

        if (!characters.every(c => characterFiles[c]?.length > 0)) {
            toast.error('Please upload images for all characters');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('story', story);
            formData.append('characters', JSON.stringify(characters));

            characters.forEach(character => {
                const file = characterFiles[character]?.[0];
                if (file) formData.append(`character-image-${character}`, file);
            });

            const response = await fetch('/api/comics/generate', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Generation failed');

            const { ipfsHash, pages } = await response.json();

            setIpfsHash(ipfsHash);
            setComicPages(pages);
            toast.success('Comic generated!');
            router.push('/edit-comic');

        } catch (error) {
            toast.error('Failed to generate comic');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const byPassCreateComic = () => {
        router.push('/comic');
    }

    return (
        <div className="flex flex-col gap-8 p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center">Upload Character Images</h1>
            {walletPrompt && (
                <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4 text-center">
                    <p className="mb-2">Please connect your wallet to continue:</p>
                    <ConnectAndSIWE />
                </div>
            )}
            {characters.length === 0 ? (
                <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4 text-center">
                    No characters found. Please go back and add character names.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => (
                        <div key={character}>
                            <PhotoUpload
                                character={character}
                                files={characterFiles[character] || []}
                                setFiles={(files) => updateCharacterFiles(character, files)}
                            />
                        </div>
                    ))}
                </div>
            )}
            <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>Upload high-quality images for best results</p>
                <p>Supported formats: JPEG, PNG (max 5MB each)</p>
            </div>
            <div className="flex justify-center gap-4 mt-4">
                <CustomButton onClick={() => router.back()}>Back</CustomButton>
                <CustomButton
                    onClick={byPassCreateComic}
                    disabled={isLoading || characters.length === 0 || !characters.every((c) => characterFiles[c]?.length > 0)}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-2"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                />
                            </svg>
                            Generating...
                        </div>
                    ) : (
                        'Create Comic'
                    )}
                </CustomButton>
            </div>
        </div>
    );
}