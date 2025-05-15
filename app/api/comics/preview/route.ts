import { NextResponse } from 'next/server';
import { ComicMetadata } from '@/types/comic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { comic } = body as { comic: ComicMetadata };

        // Validate comic metadata
        if (!comic || !comic.name || !comic.description || !comic.image) {
            return NextResponse.json({ error: 'Invalid comic metadata' }, { status: 400 });
        }

        // Return preview (in production, this could render a temporary view)
        return NextResponse.json({
            success: true,
            preview: {
                ...comic,
                pages: comic.description.split('\n').map((text, i) => ({
                    pageNumber: i + 1,
                    text,
                    image: comic.image,
                })),
            },
        });
    } catch (error: any) {
        console.error('Comic preview error:', error);
        return NextResponse.json(
            { error: `Failed to generate preview: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}