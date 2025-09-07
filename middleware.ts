import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((p) => pathname.startsWith(p));
}
function isPrivateRoute(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  const isAuth = Boolean(req.cookies.get("accessToken")?.value);

  if (isPrivateRoute(pathname) && !isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute(pathname) && isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
