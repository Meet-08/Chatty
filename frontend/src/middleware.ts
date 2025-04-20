import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./interfaces/user";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/setting") return NextResponse.next();

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  const data: User | { error: string } = await res.json();
  const isAuthenticated = !("error" in data);

  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
