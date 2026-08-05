import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Gates the dashboard UI. This is not the security boundary — the API verifies
 * every request independently — but it must not be fooled by a made-up cookie,
 * so the JWT signature and expiry are checked here for real.
 *
 * `jose` is used rather than `jsonwebtoken` because middleware runs on the Edge
 * runtime, which has no Node crypto module.
 */

const secret = process.env.JWT_SECRET;
const encodedSecret = secret ? new TextEncoder().encode(secret) : null;

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  const response = NextResponse.redirect(loginUrl);
  // Drop the unusable cookie so the browser stops replaying it.
  response.cookies.delete("token");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return redirectToLogin(request, pathname);
  }

  if (!encodedSecret) {
    // Misconfiguration, not an attack. Fall back to the old presence-only check
    // rather than locking every admin out, but make the cause impossible to miss.
    console.error(
      "[middleware] JWT_SECRET is not set — session cookies are NOT being verified. " +
        "Set JWT_SECRET (same value as the API) in the dashboard environment.",
    );
    return NextResponse.next();
  }

  try {
    // Throws on a bad signature, a wrong algorithm, or an expired token.
    await jwtVerify(token, encodedSecret, { algorithms: ["HS256"] });
  } catch {
    return redirectToLogin(request, pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
