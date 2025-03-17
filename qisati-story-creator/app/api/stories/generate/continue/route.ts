import { generateText } from "@/lib/generate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // Retrieve the prompt from the request body.
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
        return NextResponse.json(
            { message: "Prompt is required" },
            { status: 400 }
        );
    }

    // Get API key and frontend URL from environment variables.
    const apiKey = process.env.OPENROUTER_API_KEY;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!apiKey || !frontendUrl) {
        return NextResponse.json(
            { message: "API key and frontend URL are required" },
            { status: 500 }
        );
    }

    try {
        // Call generateText with the provided prompt and the server-side env variables.
        const result = await generateText(prompt, apiKey, frontendUrl);
        // Extract JSON content by finding the first '{' and the last '}' to remove markdown fences
        const jsonStart = result.content.indexOf('{');
        const jsonEnd = result.content.lastIndexOf('}');
        const jsonString = result.content.substring(jsonStart, jsonEnd + 1);
        const jsonResponse = JSON.parse(jsonString);
        // Return the generated text to the client.
        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error("Error generating text:", error);
        return NextResponse.json(
            { message: "Error generating text" },
            { status: 500 }
        );
    }
}
