import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/setting") return NextResponse.next();

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  const token = req.cookies.get("auth_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  const isAuthenticated = !("error" in data);

  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
