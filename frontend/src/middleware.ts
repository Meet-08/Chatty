import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip authentication check for the setting page
  if (pathname === "/setting") return NextResponse.next();

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  // Get the token from cookies
  const token = req.cookies.get("auth_token")?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token exists and we're on an auth route, validate before redirect
  if (token && isAuthRoute) {
    try {
      // Call the lightweight validation endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/validate-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (res.ok) {
        // If token is valid, redirect to home
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      // If validation fails, continue to auth route
      console.error("Token validation error:", error);
    }
  }

  // If token exists and accessing protected route, allow - will be validated by backend
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
