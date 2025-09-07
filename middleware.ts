import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/api",
  "/_next",
  "/favicon",
  "/assets",
];

function isPublic(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivate =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  if (isPrivate && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
