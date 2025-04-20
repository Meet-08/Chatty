// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./interfaces/user"; // Assuming User interface is correct

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Start Logging ---
  console.log(`[Middleware] Processing request for path: ${pathname}`);
  console.log("[Middleware] Request Cookies:", req.cookies); // Log all cookies received by the middleware

  const authToken = req.cookies.get("auth_token")?.value;
  console.log(
    `[Middleware] Found auth_token value: ${authToken ? "Yes" : "No"} (Value: ${
      authToken ? authToken.substring(0, 5) + "..." : "None"
    })`
  ); // Log if token found (masking value)
  // --- End Logging ---

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  // Allow /setting without auth check (as per your original logic)
  // You might want to revisit if /setting should truly be public
  if (pathname === "/setting") {
    console.log(`[Middleware] Path ${pathname} is excluded from auth check.`);
    return NextResponse.next();
  }

  // If no token found in cookies, and not on auth pages, redirect to login immediately
  if (!authToken && !isAuthRoute) {
    console.log(
      `[Middleware] No auth_token found for protected path ${pathname}. Redirecting to /login.`
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // --- Token Validation with Backend ---
  let isAuthenticated = false;
  // let userData: User | null = null; // Optional: Store user data if needed later

  if (authToken) {
    console.log(
      `[Middleware] auth_token found. Validating with backend: ${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`
    );
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        console.error("[Middleware] NEXT_PUBLIC_BACKEND_URL is not set!");
        // Decide how to handle: redirect to error page, login, or proceed with caution
        // For now, treating as unauthenticated
        isAuthenticated = false;
      } else {
        const res = await fetch(`${backendUrl}/auth/check`, {
          method: "GET", // Assuming /auth/check is a GET endpoint based on AuthService
          headers: {
            // *** RECOMMENDED: Use Authorization: Bearer header ***
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            // Do NOT manually forward the Cookie header if using Authorization: Bearer
            // If you MUST use Cookie header for some reason, uncomment below,
            // but Authorization: Bearer is preferred.
            // Cookie: `auth_token=${authToken}`,
          },
        });

        // --- Logging Backend Response ---
        console.log(
          `[Middleware] Backend check response status: ${res.status}`
        );
        if (!res.ok) {
          console.warn(
            `[Middleware] Backend check returned non-OK status: ${res.status}`
          );
          // Try to read error body even on non-OK status
          try {
            const errorBody = await res.json();
            console.warn(
              "[Middleware] Backend error response body:",
              errorBody
            );
          } catch (e) {
            console.warn(
              "[Middleware] Could not parse backend error response body as JSON."
            );
            console.log(e);
          }
          isAuthenticated = false; // Treat non-OK as unauthenticated
        } else {
          // Status is OK (e.g., 200)
          try {
            const data: User = await res.json();
            console.log(
              "[Middleware] Backend check response body (success):",
              data
            );
            // Assuming a successful response with User data means authenticated
            isAuthenticated = !("error" in data); // Keep check for potential error field in 200 response body if backend sends it
            if (isAuthenticated) {
              // userData = data; // Store user data if needed
              console.log(
                `[Middleware] Authentication successful for ${pathname}.`
              );
            } else {
              console.warn(
                '[Middleware] Backend check response body contains "error" field despite OK status.'
              );
            }
          } catch (e) {
            console.error(
              "[Middleware] Failed to parse backend success response body as JSON:",
              e
            );
            isAuthenticated = false; // Treat parsing error as authentication failure
          }
        }
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
  // --- End Token Validation ---

  // --- Authorization Logic ---
  // If user is NOT authenticated and NOT on auth pages, redirect to login
  if (!isAuthenticated && !isAuthRoute) {
    console.log(
      `[Middleware] User not authenticated for protected path ${pathname}. Redirecting to /login.`
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user IS authenticated but IS on login/signup pages, send them home
  if (isAuthenticated && isAuthRoute) {
    console.log(
      `[Middleware] User authenticated on auth route ${pathname}. Redirecting to /. `
    );
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Otherwise (user is authenticated on a protected page, or not authenticated on a public page), let them through
  console.log(
    `[Middleware] Allowing access to ${pathname}. Authenticated: ${isAuthenticated}.`
  );
  // If you need user data in the page/layout, you might set headers here
  // Example: response.headers.set('x-user-id', userData._id);
  return NextResponse.next();
  // --- End Authorization Logic ---
}

export const config = {
  // Apply middleware to all paths except API routes, static files, and specific assets
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
