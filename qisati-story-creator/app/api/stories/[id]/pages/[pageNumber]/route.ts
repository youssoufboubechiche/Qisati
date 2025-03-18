import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

// GET a specific page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; pageNumber: string } }
) {
  try {
    params = await params;
    const storyId = parseInt(params.id);
    const pageNumber = parseInt(params.pageNumber);

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

    // Get the page
    const page = await prisma.storyPage.findFirst({
      where: {
        storyId,
        pageNumber,
      },
      include: {
        nextPage: true,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error(
      `Error fetching story page for storyId: ${params.id}, pageNumber: ${params.pageNumber}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch story page" },
      { status: 500 }
    );
  }
}

// PATCH update a specific page
export async function PATCH(
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

    // Check if the story exists and belongs to the user
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
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
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Construct the data object dynamically
    const data: { [key: string]: any } = {};

    if (body.text !== undefined) data.text = body.text;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.suggestedDecisions !== undefined)
      data.suggestedDecisions = body.suggestedDecisions;
    if (body.decisionTaken !== undefined)
      data.decisionTaken = body.decisionTaken;
    if (body.generationPrompt !== undefined)
      data.generationPrompt = body.generationPrompt;
    if (body.aiModel !== undefined) data.aiModel = body.aiModel;
    if (body.readTime !== undefined) data.readTime = body.readTime;

    // Update the page
    const updatedPage = await prisma.storyPage.update({
      where: { storyId_pageNumber: { storyId, pageNumber } },
      data,
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating story page:", error);
    return NextResponse.json(
      { error: "Failed to update story page" },
      { status: 500 }
    );
  }
}

// DELETE a specific page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { storyId: string; pageId: string } }
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
    const storyId = parseInt(params.storyId);
    const pageId = parseInt(params.pageId);

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
        { error: "Not authorized to edit this story" },
        { status: 403 }
      );
    }

    // Check if the page exists
    const page = await prisma.storyPage.findFirst({
      where: {
        id: pageId,
        storyId,
      },
      include: {
        previousPage: true,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Find the next and previous pages to update references
    const previousPage = page.previousPage;
    const nextPage = await prisma.storyPage.findUnique({
      where: { nextPageId: pageId },
    });

    // Start a transaction to handle all the updates
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // If there's a previous page pointing to this one, update it to point to the next page
      if (previousPage) {
        await tx.storyPage.update({
          where: { id: previousPage.id },
          data: { nextPageId: page.nextPageId },
        });
      }

      // Delete the page
      await tx.storyPage.delete({
        where: { id: pageId },
      });

      // Update the page numbers for all subsequent pages
      const subsequentPages = await tx.storyPage.findMany({
        where: {
          storyId,
          pageNumber: { gt: page.pageNumber },
        },
        orderBy: { pageNumber: "asc" },
      });

      for (const subPage of subsequentPages) {
        await tx.storyPage.update({
          where: { id: subPage.id },
          data: { pageNumber: subPage.pageNumber - 1 },
        });
      }

      // Update the story completion status if needed
      const remainingPagesCount =
        (await tx.storyPage.count({
          where: { storyId },
        })) - 1; // Subtract 1 for the page we're deleting

      await tx.story.update({
        where: { id: storyId },
        data: {
          isCompleted: remainingPagesCount >= story.targetPages,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting story page:", error);
    return NextResponse.json(
      { error: "Failed to delete story page" },
      { status: 500 }
    );
  }
}
