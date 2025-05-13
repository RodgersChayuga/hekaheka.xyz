import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { story, characters } = await request.json();
        if (!story || !characters || !Array.isArray(characters)) {
            return NextResponse.json({ success: false, message: "Invalid story or characters" }, { status: 400 });
        }
        return NextResponse.json({ success: true, story, characters });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}