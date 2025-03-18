import { getUserSession } from "@/lib/auth";
import {
  generateContinuationPrompt,
  generateFinalSegmentPrompt,
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
    // Retrieve auth token from cookies
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

    // Parse story ID from the route params
    params = await params;
    const storyId = parseInt(params.id);

    // Parse request body for decision
    const body = await request.json();
    if (!body.decisionTaken || typeof body.decisionTaken !== "string") {
      return NextResponse.json(
        { error: "Decision taken is required" },
        { status: 400 }
      );
    }

    // Ensure required environment variables are available
    const apiKey = process.env.OPENROUTER_API_KEY;
    const frontendUrl = process.env.FRONTEND_URL;
    if (!apiKey || !frontendUrl) {
      return NextResponse.json(
        { message: "API key and frontend URL are required" },
        { status: 500 }
      );
    }

    // Fetch the story and ensure it belongs to the user
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: {
          orderBy: { pageNumber: "asc" },
        },
        author: {
          select: { id: true, name: true },
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

    // Retrieve the last page in the story (ordered descending)
    const lastPage = await prisma.storyPage.findFirst({
      where: { storyId },
      orderBy: { pageNumber: "desc" },
      include: { previousPage: true },
    });

    if (!lastPage) {
      return NextResponse.json(
        { error: "No pages found for this story" },
        { status: 404 }
      );
    }

    // Determine if this should be the final segment
    const systemPrompt = getSystemPrompt(
      story.targetAge,
      story.genre,
      story.style
    );
    let userPrompt;
    if (lastPage.pageNumber >= story.targetPages - 1) {
      userPrompt = generateFinalSegmentPrompt(body.decisionTaken, story);
    } else {
      userPrompt = generateContinuationPrompt(body.decisionTaken, story);
    }

    // Generate text based on the prompts
    const result = await generateText(
      systemPrompt,
      userPrompt,
      apiKey,
      frontendUrl
    );

    // Extract JSON response from the generated text
    console.log(result.data.content);
    const jsonStart = result.data.content.indexOf("{");
    const jsonEnd = result.data.content.lastIndexOf("}");
    const jsonString = result.data.content.substring(jsonStart, jsonEnd + 1);
    const jsonResponse = JSON.parse(jsonString);

    // Return the generated content to the client
    return NextResponse.json({ ...jsonResponse, ...result.metadata });
  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json(
      { message: "Error generating text" },
      { status: 500 }
    );
  }
}
