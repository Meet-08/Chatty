// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./interfaces/user";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (pathname === "/setting") return NextResponse.next();

  // Forward cookies so backend can authenticate
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`, {
    credentials: "include",
  });

  const data: User | { error: string } = await res.json();
  const isAuthenticated = !("error" in data);

  // If no user and not on auth pages, redirect to login
  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // If user is logged in but on login/signup, send them home
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Otherwise let them through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
