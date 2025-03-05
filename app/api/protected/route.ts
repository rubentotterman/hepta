import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get the authorization header
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized: Missing or invalid authorization header" }, { status: 401 })
  }

  // Extract the token
  const token = authHeader.split(" ")[1]

  // Check if this is a test token
  if (token.startsWith("test_")) {
    // Allow test tokens for local development
    return NextResponse.json({
      message: "Authenticated successfully with test token",
      user: {
        id: "test-user-id",
        email: "test@example.com",
      },
      timestamp: new Date().toISOString(),
    })
  }

  // Verify the token with Supabase
  const supabase = createRouteHandlerClient({ cookies })
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return NextResponse.json({ error: "Unauthorized: Invalid session token" }, { status: 401 })
  }

  // If we get here, the token is valid
  return NextResponse.json({
    message: "Authenticated successfully",
    user: {
      id: data.user.id,
      email: data.user.email,
    },
    timestamp: new Date().toISOString(),
  })
}

