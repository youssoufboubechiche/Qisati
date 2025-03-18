import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { cookies } from "next/headers";

// GET a specific story by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    params = await params;
    const id = parseInt(params.id);

    // Check if the story exists
    const story = await prisma.story.findUnique({
      where: { id },
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

    // Check if the story is public or if the user is the author
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

    // Increment view count if not the author
    if (!isAuthor) {
      await prisma.story.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

// PUT update a story
export async function PUT(
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

    const id = parseInt(params.id);
    const body = await request.json();

    // Check if the story exists and belongs to the user
    const story = await prisma.story.findUnique({
      where: { id },
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

    // Update the story
    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        title: body.title,
        setting: body.setting,
        characterInfo: body.characterInfo,
        genre: body.genre,
        style: body.style,
        targetAge: body.targetAge,
        targetPages: body.targetPages,
        isCompleted: body.isCompleted,
        isPublic: body.isPublic,
        summary: body.summary,
        coverImage: body.coverImage,
        tags: body.tags,
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}

// DELETE a story
export async function DELETE(
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

    const id = parseInt(params.id);

    // Check if the story exists and belongs to the user
    const story = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.authorId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this story" },
        { status: 403 }
      );
    }

    // Delete the story (and associated pages due to cascading delete)
    await prisma.story.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
