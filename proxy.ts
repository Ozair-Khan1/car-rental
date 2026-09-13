import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");
  
  // Add routes that require authentication here
  const protectedRoutes = ["/dashboard", "/host", "/admin", "/settings", "/bookings"];
  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // 1. If user is logged in and trying to access login/signup, redirect to dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  // 2. If user is NOT logged in and trying to access a protected route, redirect to login
  if (!isLoggedIn && isProtectedRoute) {
    // Save the original URL so we can redirect them back after they log in
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    
    return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // 3. Otherwise, let them pass
  return;
});

// Optionally, don't invoke Middleware on some paths (like static files or api routes)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
