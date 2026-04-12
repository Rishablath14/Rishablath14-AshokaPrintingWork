import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { getExpiredAuthCookieOptions } from "@/lib/auth/cookies";
import { verifyAuthTokenInEdge } from "@/lib/auth/edge-jwt";

const redirectToLogin = (request, shouldClearCookie = false) => {
  const response = NextResponse.redirect(new URL("/login", request.nextUrl));

  if (shouldClearCookie) {
    response.cookies.set(AUTH_COOKIE_NAME, "", getExpiredAuthCookieOptions());
  }

  return response;
};

export async function proxy(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login";
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value || "";
  const hasToken = Boolean(token);
  const payload = hasToken ? await verifyAuthTokenInEdge(token, process.env.TOKEN_SECRET) : null;
  const isAuthenticated = Boolean(payload?.id);

  if (!isPublicPath && !isAuthenticated) {
    return redirectToLogin(request, hasToken);
  }

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (isPublicPath && hasToken && !isAuthenticated) {
    return redirectToLogin(request, true);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/add", "/login", "/customers", "/customers/:path*"],
};
