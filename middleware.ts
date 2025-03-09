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

  // List of admin routes that require admin role
  const adminRoutes = ["/admin", "/admin/users"]

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Check for test session in cookies
  const hasTestSession = req.cookies.get("hasTestSession")?.value === "true"

  // Check for session cookie
  const hasSessionCookie = req.cookies.get("session")?.value === "authenticated"

  console.log("Middleware check:", {
    path: req.nextUrl.pathname,
    isProtectedRoute,
    isAdminRoute,
    hasSession: !!session,
    hasTestSession,
    hasSessionCookie,
  })

  // For admin routes, check if the user has admin role
  if (isAdminRoute) {
    // In development with test session, allow access
    if (process.env.NODE_ENV === "development" && (hasTestSession || hasSessionCookie)) {
      return res
    }

    // Check if user is authenticated
    if (!session && !hasSessionCookie) {
      console.log("Redirecting to home - no valid session for admin route")
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/"
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has admin role by fetching from Supabase
    try {
      const supabase = createMiddlewareClient({ req, res })
      const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

      if (error || !profile || profile.role !== "admin") {
        console.log("Redirecting to dashboard - user is not an admin")
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/dashboard"
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error("Error checking admin role:", error)
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/dashboard"
      return NextResponse.redirect(redirectUrl)
    }
  }
  // For regular protected routes, just check authentication
  else if (isProtectedRoute && !session && !hasTestSession && !hasSessionCookie) {
    console.log("Redirecting to home - no valid session for protected route")
    // Redirect to login if accessing protected route without auth
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/faktura/:path*", "/innstillinger/:path*", "/admin/:path*"],
}

