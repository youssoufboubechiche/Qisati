import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { cookies } from "next/headers";

// GET all pages for a story
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    params = await params;
    const storyId = parseInt(params.id);

    // Check if the story exists
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { isPublic: true, authorId: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Check if the user is authorized to view the story
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = token ? await getUserSession(token) : null;
    const isAuthor = user && user.id === story.authorId;

    if (!story.isPublic && !isAuthor) {
      return NextResponse.json(
        { error: "Unauthorized to view this story" },
        { status: 403 }
      );
    }

    // Get all pages for the story
    const pages = await prisma.storyPage.findMany({
      where: { storyId },
      orderBy: { pageNumber: "asc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching story pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch story pages" },
      { status: 500 }
    );
  }
}

// POST create a new page for a story
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
    const body = await request.json();

    // Check if the story exists and belongs to the user
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true, targetPages: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.authorId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to add pages to this story" },
        { status: 403 }
      );
    }

    // Get the highest page number to determine the next page number
    const highestPage = await prisma.storyPage.findFirst({
      where: { storyId },
      orderBy: { pageNumber: "desc" },
      select: { pageNumber: true },
    });

    const nextPageNumber = highestPage ? highestPage.pageNumber + 1 : 1;

    // Create the new page
    const page = await prisma.storyPage.create({
      data: {
        storyId,
        pageNumber: nextPageNumber,
        text: body.text,
        imagePrompt: body.imagePrompt,
        imageUrl: body.imageUrl,
        suggestedDecisions: body.suggestedDecisions
          ? body.suggestedDecisions
          : [],
        decisionTaken: body.decisionTaken,
        generationPrompt: body.generationPrompt,
        aiModel: body.aiModel,
        readTime: body.readTime,
      },
    });

    // If this isn't the first page, update the previous page to point to this one
    if (nextPageNumber > 1) {
      const previousPage = await prisma.storyPage.findFirst({
        where: {
          storyId,
          pageNumber: nextPageNumber - 1,
        },
      });

      if (previousPage) {
        await prisma.storyPage.update({
          where: { id: previousPage.id },
          data: { nextPageId: page.id },
        });
      }
    }

    // If this page completes the targeted number of pages, mark the story as completed
    if (nextPageNumber >= story.targetPages) {
      await prisma.story.update({
        where: { id: storyId },
        data: { isCompleted: true },
      });
    }

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Error creating story page:", error);
    return NextResponse.json(
      { error: "Failed to create story page" },
      { status: 500 }
    );
  }
}
