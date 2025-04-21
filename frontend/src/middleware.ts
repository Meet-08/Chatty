// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("all cookies:", JSON.stringify(req.cookies.getAll()));

  // get the specific cookie
  const raw = req.cookies.get("auth_token");
  const token = raw?.value;
  console.log("auth_token value:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile"],
};
