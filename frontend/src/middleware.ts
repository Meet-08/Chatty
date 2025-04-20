// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  // Allow /setting without auth check (as per your original logic)
  if (pathname === "/setting") return NextResponse.next();

  const authToken = req.cookies.get("auth_token")?.value;

  // If no token, and not on auth routes, redirect to login
  if (!authToken && !isAuthRoute) {
    console.log(
      `[Middleware] No token found for ${pathname}. Redirecting to /login.`
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token exists, validate it by calling the backend
  let isAuthenticated = false;
  if (authToken) {
    try {
      console.log(
        `[Middleware] Token found, validating with backend for ${pathname}`
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`,
        {
          method: "GET", // Assuming /auth/check is a GET endpoint
          headers: {
            // Use Authorization: Bearer header instead of Cookie header
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json", // Standard header
          },
        }
      );

      console.log(`[Middleware] Backend check response status: ${res.status}`);

      if (res.ok) {
        // Check for a successful status code (e.g., 200)
        // const data: User = await res.json();
        // Assuming a successful response with user data means authenticated
        isAuthenticated = true;
        console.log(`[Middleware] Authentication successful for ${pathname}`);
      } else {
        // Handle specific backend error responses if needed
        const errorData = await res.json().catch(() => ({})); // Try parsing error body
        console.error(
          `[Middleware] Backend authentication failed for ${pathname}. Status: ${res.status}, Body:`,
          errorData
        );
        isAuthenticated = false;
      }
    } catch (error) {
      console.error(
        `[Middleware] Error during backend fetch for ${pathname}:`,
        error
      );
      // Treat network errors or exceptions during fetch as unauthenticated
      isAuthenticated = false;
    }
  }

  // If not authenticated and not on auth pages, redirect to login
  if (!isAuthenticated && !isAuthRoute) {
    console.log(
      `[Middleware] User not authenticated for ${pathname}. Redirecting to /login.`
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is logged in but on login/signup, send them home
  if (isAuthenticated && isAuthRoute) {
    console.log(
      `[Middleware] User authenticated on auth route ${pathname}. Redirecting to /. `
    );
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Otherwise let them through
  console.log(
    `[Middleware] Allowing access to ${pathname}. Authenticated: ${isAuthenticated}`
  );
  return NextResponse.next();
}

export const config = {
  matcher: [
    // This matcher is fine
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
