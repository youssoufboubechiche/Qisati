import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    try {
      const user = await registerUser(email, password, name);

      return NextResponse.json(
        { message: "User registered successfully", user },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.message === "User already exists") {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
