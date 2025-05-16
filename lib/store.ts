import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ComicPage {
    imageUrl: string;
    text: string;
    character: string;
    userImageHash?: string;
}

interface Store {
    wallet: { address: string; isValid: boolean } | null;
    story: string;
    characters: string[];
    ipfsHash: string;
    comicPages: ComicPage[];
    setWallet: (wallet: Store['wallet']) => void;
    setStory: (story: string) => void;
    setCharacters: (characters: string[]) => void;
    setIpfsHash: (ipfsHash: string) => void;
    setComicPages: (pages: ComicPage[]) => void;
    reset: () => void;
}

export const useZustandStore = create<Store>()(
    persist(
        (set) => ({
            wallet: null,
            story: '',
            characters: [],
            ipfsHash: '',
            comicPages: [],
            setWallet: (wallet) => set({ wallet }),
            setStory: (story) => set({ story }),
            setCharacters: (characters) => set({ characters }),
            setIpfsHash: (ipfsHash) => set({ ipfsHash }),
            setComicPages: (comicPages) => set({ comicPages }),
            reset: () => set({
                story: '',
                characters: [],
                ipfsHash: '',
                comicPages: []
            })
        }),
        {
            name: 'comicchain-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);