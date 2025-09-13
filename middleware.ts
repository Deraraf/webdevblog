import NextAuth from "next-auth";
import authConfig from "./auth.config";

import {
  apiAuthPrifix,
  authRoutes,
  LOGIN_REDIRECT,
  publicRoutes,
} from "./lib/routes";

const { auth: middleware } = NextAuth(authConfig);

const checkIsPublicRoute = (pathname: string) => {
  const isPublicRoute = publicRoutes.some((route) =>
    typeof route === "string"
      ? pathname.startsWith(route)
      : route.test(pathname)
  );
  return isPublicRoute;
};

export default middleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrifix);
  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isPublicRoute = checkIsPublicRoute(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(LOGIN_REDIRECT, nextUrl));
    }
    return;
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   console.log(new URL("/login", req.url));
//   const session = req.cookies.get("session")?.value;

//   if (!session) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// // Protect specific routes
// export const config = {
//   matcher: ["/dashboard", "/profile", "/admin/:path*"],
// };
