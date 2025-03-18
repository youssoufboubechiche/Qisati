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
  { params }: { params: { id: string; pageNumber: string } }
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
    const pageNumber = parseInt(params.pageNumber);
    const body = await request.json();

    // Return if decision is not provided
    if (!body.decisionTaken || typeof body.decisionTaken !== "string") {
      return NextResponse.json(
        { error: "Decision taken is required" },
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

    // Check if the page exists
    const page = await prisma.storyPage.findFirst({
      where: {
        storyId,
        pageNumber,
      },
      include: {
        previousPage: true,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Only keep previous pages
    story.pages = story.pages.filter((p) => p.pageNumber <= page.pageNumber);

    // Generate the next page
    const systemPrompt = getSystemPrompt(
      story.targetAge,
      story.genre,
      story.style
    );

    let userPrompt;
    if (page.pageNumber >= story.targetPages - 1) {
      userPrompt = generateFinalSegmentPrompt(body.decisionTaken, story);
    } else {
      userPrompt = generateContinuationPrompt(body.decisionTaken, story);
    }

    const result = await generateText(
      systemPrompt,
      userPrompt,
      apiKey,
      frontendUrl
    );

    // Extract JSON response from the result
    const jsonStart = result.content.indexOf("{");
    const jsonEnd = result.content.lastIndexOf("}");
    const jsonString = result.content.substring(jsonStart, jsonEnd + 1);
    const jsonResponse = JSON.parse(jsonString);
    // Return the generated text to the client.
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.log("Error generating text:", error);
    return NextResponse.json(
      { message: "Error generating text" },
      { status: 500 }
    );
  }
}
