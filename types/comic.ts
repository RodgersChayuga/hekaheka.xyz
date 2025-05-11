export interface ComicMetadata {
    name: string;
    description: string;
    image: string;
    attributes: Array<{ trait_type: string; value: string }>;
    pages?: Array<{ pageNumber: number; text: string; image: string }>;
}