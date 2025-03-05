import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // List of protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/faktura", "/innstillinger"]

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Check for test session in cookies
  const hasTestSession = req.cookies.get("hasTestSession")?.value === "true"

  console.log("Middleware check:", {
    path: req.nextUrl.pathname,
    isProtectedRoute,
    hasSession: !!session,
    hasTestSession,
  })

  if (isProtectedRoute && !session && !hasTestSession) {
    console.log("Redirecting to home - no valid session for protected route")
    // Redirect to login if accessing protected route without auth
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/faktura/:path*", "/innstillinger/:path*"],
}

