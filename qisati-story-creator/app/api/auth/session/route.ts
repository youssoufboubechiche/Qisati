import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const cookiesList = await cookies();
    const token = cookiesList.get("auth_token")?.value;

    const user = await getUserSession(token || "");

    if (!user) {
      // If no valid session, clear cookie
      (await cookies()).set({
        name: "auth_token",
        value: "",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });

      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
