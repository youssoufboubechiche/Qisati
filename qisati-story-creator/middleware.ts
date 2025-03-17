import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // You'll need to install: npm install jose

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    // No token found, redirect to login
    return redirectToLogin(request);
  }

  try {
    // Simple token check (you can't use the full getUserSession in middleware)
    // This just checks if the JWT is valid - database checks are done in actual API routes
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-jwt-secret"
    );
    await jwtVerify(token, secretKey);

    // Continue with the request if token is valid
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?redirect=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    // Protected routes
    //..."/dashboard/:path*",
  ],
};
