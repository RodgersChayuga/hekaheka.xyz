export interface ComicMetadata {
    // Core Metadata
    name: string;
    description: string;
    image: string; // Cover image
    created_at: string;

    // Story Elements
    story: {
        text: string;
        summary: string;
        genre: string;
    };

    // Character Data
    characters: Array<{
        name: string;
        images: string[]; // IPFS URLs
        traits: Record<string, string>;
    }>;

    // Generated Pages
    pages: Array<{
        page_number: number;
        panel_image: string; // IPFS URL
        panel_text: string;
        characters_present: string[];
    }>;

    // System Info
    generator: {
        version: string;
        model: string;
    };
}