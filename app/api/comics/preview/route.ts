import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        pages: [
            { image: "/mock-image1.jpg", text: "Rodgers cooks a delicious meal." },
            { image: "/mock-image2.jpg", text: "Playing badminton with friends." },
            { image: "/mock-image3.jpg", text: "A sunny day at the park." },
            { image: "/mock-image4.jpg", text: "Exploring the forest." },
            { image: "/mock-image5.jpg", text: "Celebrating a birthday." },
        ],
    });
}