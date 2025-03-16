import { NextRequest, NextResponse } from "next/server";
import { initiatePasswordReset, completePasswordReset } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if we're initiating a reset or completing a reset
    if (body.email && !body.token && !body.newPassword) {
      // Initiating password reset
      const result = await initiatePasswordReset(body.email);

      return NextResponse.json({
        message:
          "If your email is registered, you will receive a password reset link",
        // Only in development/demo - in production, this would be sent via email
        ...(process.env.NODE_ENV !== "production"
          ? { resetUrl: result.resetUrl }
          : {}),
      });
    } else if (body.token && body.newPassword) {
      // Completing password reset
      try {
        await completePasswordReset(body.token, body.newPassword);

        return NextResponse.json({
          message: "Password has been reset successfully",
        });
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || "Invalid or expired reset token" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
