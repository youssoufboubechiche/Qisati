import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    try {
      const { token, user } = await loginUser(email, password);

      // Set cookie
      (await cookies()).set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        message: "Login successful",
        user,
      });
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
