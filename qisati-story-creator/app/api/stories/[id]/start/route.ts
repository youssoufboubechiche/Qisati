import { getUserSession } from "@/lib/auth";
import {
  generateContinuationPrompt,
  generateInitialStoryPrompt,
  generateText,
  getSystemPrompt,
} from "@/lib/generate";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await getUserSession(token);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    params = await params;
    const storyId = parseInt(params.id);

    // Get API key and frontend URL from environment variables.
    const apiKey = process.env.OPENROUTER_API_KEY;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!apiKey || !frontendUrl) {
      return NextResponse.json(
        { message: "API key and frontend URL are required" },
        { status: 500 }
      );
    }

    // Check if the story exists and belongs to the user
    let story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: {
          orderBy: {
            pageNumber: "asc",
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.authorId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to edit this story" },
        { status: 403 }
      );
    }

    // Generate the next page
    const systemPrompt = getSystemPrompt(
      story.targetAge,
      story.genre,
      story.style
    );
    const userPrompt = generateInitialStoryPrompt(story);

    const result = await generateText(
      systemPrompt,
      userPrompt,
      apiKey,
      frontendUrl
    );

    // Extract JSON response from the generated text
    const jsonStart = result.data.content.indexOf("{");
    const jsonEnd = result.data.content.lastIndexOf("}");
    const jsonString = result.data.content.substring(jsonStart, jsonEnd + 1);
    const jsonResponse = JSON.parse(jsonString);

    // Return the generated content to the client
    return NextResponse.json({ ...jsonResponse, ...result.metadata });
  } catch (error) {
    console.log("Error generating text:", error);
    return NextResponse.json(
      { message: "Error generating text" },
      { status: 500 }
    );
  }
}
