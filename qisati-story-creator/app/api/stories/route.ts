import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";
import { cookies } from "next/headers";

// GET all stories (with filtering options)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const isPublic = searchParams.get("isPublic");
    const isCompleted = searchParams.get("isCompleted");
    const genre = searchParams.get("genre");
    const targetAge = searchParams.get("targetAge")
      ? parseInt(searchParams.get("targetAge")!)
      : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    const offset = (page - 1) * limit;

    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    let userId = null;

    if (token) {
      const user = await getUserSession(token);
      if (user) {
        userId = user.id;
      }
    }

    // Build filter object - only show public stories OR stories owned by the user
    const filter: any = {
      OR: [{ isPublic: true }, ...(userId ? [{ authorId: userId }] : [])],
    };

    // Add additional filters
    if (isCompleted !== null) filter.isCompleted = isCompleted === "true";
    if (genre) filter.genre = genre;
    if (targetAge) filter.targetAge = targetAge;
    if (isPublic !== null) {
      // If specifically requesting public/private stories,
      // handle differently for authenticated vs non-authenticated users
      if (userId) {
        // For authenticated users, apply the isPublic filter only to their stories
        if (isPublic === "true") {
          // Show public stories (from anyone) and any public stories by the user
          // This is already covered by the OR condition above
        } else {
          // Show only private stories by the current user
          filter.OR = undefined;
          filter.isPublic = false;
          filter.authorId = userId;
        }
      } else {
        // For non-authenticated users, they can only see public stories
        filter.OR = undefined;
        filter.isPublic = true;
      }
    }

    // Get stories with pagination
    const stories = await prisma.story.findMany({
      where: filter,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        pages: {
          select: {
            id: true,
            pageNumber: true,
          },
          orderBy: {
            pageNumber: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.story.count({
      where: filter,
    });

    return NextResponse.json({
      stories,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

// POST create a new story
export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookies
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
    const body = await request.json();
    // Validate required fields
    const {
      title,
      setting,
      characterInfo,
      genre,
      style,
      targetAge,
      targetPages,
    } = body;
    if (
      !title ||
      !setting ||
      !characterInfo ||
      !genre ||
      !style ||
      !targetAge ||
      !targetPages
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const story = await prisma.story.create({
      data: {
        title,
        setting,
        characterInfo,
        genre,
        style,
        targetAge,
        targetPages,
        summary: body.summary,
        coverImage: body.coverImage,
        tags: body.tags || [],
        isPublic: body.isPublic || false,
        author: {
          connect: { id: user.id },
        },
      },
    });
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
