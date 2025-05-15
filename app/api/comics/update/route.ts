import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const story = formData.get("story") as string;
        const characters = JSON.parse(formData.get("characters") as string);

        const ipfsHashes: Record<string, string[]> = {};
        characters.forEach((character: string) => {
            const files = formData.getAll(`${character}-0`);
            ipfsHashes[character] = files.map((_, index) => `ipfs://mock-hash-${character}-${index}`);
        });

        return NextResponse.json({ success: true, ipfsHashes });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}